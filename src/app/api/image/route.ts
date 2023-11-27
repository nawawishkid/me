import { fetchPageCoverImageUrl, getNotionClient } from "@/modules/blog/api";
import { getRedis } from "@/modules/blog/api/redis";
import { fileTypeFromBuffer } from "file-type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const redis = getRedis();
  const pageId = request.nextUrl.searchParams.get("pageId");

  if (!pageId) {
    return Response.json({ error: "pageId is required" }, { status: 400 });
  }

  const cacheKey = `image:${pageId}`;
  const logData: {
    pageId: string;
    cacheKey: string;
    cacheHit?: boolean;
    notionCoverImageUrl?: string;
    imageLoaded?: boolean;
  } = {
    pageId,
    cacheKey,
  };

  try {
    const result = await redis.getBuffer(cacheKey);
    let buffer: Buffer,
      cacheHit = false;

    if (result === null) {
      logData.cacheHit = false;

      const coverImageUrl = await fetchPageCoverImageUrl(
        getNotionClient(),
        pageId
      );

      if (!coverImageUrl) {
        const msg = `Image not found`;
        console.log(msg, logData);

        return NextResponse.json({ error: msg }, { status: 404 });
      }

      logData.notionCoverImageUrl = coverImageUrl;

      const res = await fetch(coverImageUrl);

      if (res.status !== 200) {
        logData.imageLoaded = false;
        const msg = `Failed to fetch image from ${coverImageUrl} with status ${res.status}`;

        console.error(msg, logData);

        return NextResponse.json({ error: msg }, { status: 502 });
      }

      logData.imageLoaded = true;

      const arrBuffer = await res.arrayBuffer();

      buffer = Buffer.from(arrBuffer);

      redis
        .set(cacheKey, buffer, "EX", 60 * 60 * 24)
        .then(() => console.log(`Successfully cached ${cacheKey}`))
        .catch((e) => console.error(`Failed to cache ${cacheKey}: ${e}`));
    } else {
      logData.cacheHit = true;
      // Turn byte string from Redis into a Buffer
      cacheHit = true;
      buffer = result;
    }

    // Detect mimetype from buffer
    const type = await fileTypeFromBuffer(buffer);

    if (!type) {
      const msg = `Failed to detect image type`;

      console.log(
        `${msg}. Deleting from cache... cacheKey=${cacheKey}`,
        logData
      );

      redis
        .del(cacheKey)
        .then(() =>
          console.log(
            `Deleted ${cacheKey} from cache because it's not an image`
          )
        )
        .catch((e) =>
          console.error(`Failed to delete ${cacheKey} from cache: ${e}`)
        );

      return NextResponse.json({ error: msg }, { status: 500 });
    }

    console.log(`Get image successfully`, logData);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": type.mime,
        "X-Nawawishkid-Cache": cacheHit ? "HIT" : "MISS",
      },
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Failed to get cached ${cacheKey}: ${e.message}`);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
}
