import Animatable from "./[slug]/animatable";

export default function Loading() {
  return (
    <Animatable className="max-w-screen-lg p-8">
      <div className="w-1/2 bg-slate-200 animate-pulse h-12 rounded mx-auto my-8"></div>
      {Array(3)
        .fill(null)
        .map((_, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-lg border flex items-start gap-4 bg-white mb-8"
          >
            <div className="w-1/5 p-8 bg-slate-200 animate-pulse rounded"></div>
            <div className="w-4/5">
              <div className="mb-6 w-full h-8 bg-slate-200 animate-pulse rounded"></div>
              <div className="mb-2 w-full h-4 bg-slate-200 animate-pulse rounded"></div>
              <div className="w-full h-4 bg-slate-200 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
    </Animatable>
  );
}
