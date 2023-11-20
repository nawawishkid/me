import { findBlogPosts } from "@/modules/blog/helpers";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { z } from "zod";

const Body: z.ZodType<
  Omit<QueryDatabaseParameters, "database_id" | "filter_properties">
> = z.object({
  start_cursor: z.string().optional(),
});

export async function POST(request: Request) {
  const body = Body.parse(await request.json());
  console.log("body: ", body);

  try {
    const response = await findBlogPosts(body);

    return Response.json(response);
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  }
}
