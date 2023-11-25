import { getRedis } from "@/modules/blog/api/redis";
import { fileTypeFromBuffer } from "file-type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const redis = getRedis();
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return Response.json({ error: "url is required" }, { status: 400 });
  }

  const cacheKey = `image:${encodeURIComponent(url)}`;

  try {
    console.log(`Finding the image from cache '${cacheKey}'...`);
    const result = await redis.get(cacheKey);
    let buffer: Buffer,
      cacheHit = false;

    if (result === null) {
      console.log(`No cache found for '${cacheKey}', fetching from ${url}...`);

      const res = await fetch(url);

      if (res.status !== 200) {
        const msg = `Failed to fetch image from ${url} with status ${res.status}`;

        console.error(msg);

        return NextResponse.json({ error: msg }, { status: 502 });
      }

      const arrBuffer = await res.arrayBuffer();

      buffer = Buffer.from(arrBuffer);

      console.log(`Fetched ${url} successfully, caching...`);

      redis
        .set(cacheKey, buffer, "EX", 60 * 60 * 24)
        .then(() => console.log(`Successfully cached ${cacheKey}`))
        .catch((e) => console.error(`Failed to cache ${cacheKey}: ${e}`));
    } else {
      console.log(`Successfully got cached ${cacheKey}`);
      // Turn byte string from Redis into a Buffer
      cacheHit = true;
      buffer = Buffer.from(result);
    }

    // Detect mimetype from buffer
    const type = await fileTypeFromBuffer(buffer);

    if (!type) {
      const msg = `Failed to detect image type`;

      console.log(`${msg}. Deleting from cache... cacheKey=${cacheKey}`);

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
