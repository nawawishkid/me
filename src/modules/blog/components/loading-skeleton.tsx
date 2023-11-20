import Animatable from "@/components/animatable";

export default function LoadingSkeleton({
  mode = "grid",
}: {
  mode?: "grid" | "row";
}) {
  const isGrid = mode === "grid";

  return (
    <Animatable className="w-full max-w-screen-lg">
      {
        <ul className="flex flex-wrap gap-8 justify-center">
          {Array(isGrid ? 5 : 3)
            .fill(null)
            .map((_, idx) => (
              <li
                key={idx}
                className={`basis-full ${
                  isGrid &&
                  "sm:basis-[calc(50%_-_theme(spacing.8)_/_2)] lg:basis-[calc(33.33%_-_theme(spacing.8))]"
                }`}
              >
                <div className="p-6 sm:p-8 rounded-lg border flex items-start gap-4">
                  {/* {post.coverImageUrl && (
                      <Image
                        src={post.coverImageUrl}
                        width={64}
                        height={64}
                        alt={`${post.title}'s logo`}
                      />
                    )} */}
                  <div
                    className={`flex w-full flex-col ${
                      isGrid && "sm:min-h-[200px] lg:min-h-[250px]"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="mb-4 w-full h-8 skeleton"></div>
                      <div className="h-4 mb-2 w-full skeleton"></div>
                      <div className="h-4 w-full skeleton"></div>
                    </div>
                    <div className="flex-1 flex items-end">
                      <ul className="flex gap-2 mt-4 w-full">
                        {Array(3)
                          .fill(null)
                          .map((_, idx) => (
                            <li key={idx} className="h-4 p-1 w-8 skeleton"></li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      }
    </Animatable>
  );
}
