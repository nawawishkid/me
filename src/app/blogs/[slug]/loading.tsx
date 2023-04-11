import Animatable from "./animatable";

export default function Loading() {
  return (
    <Animatable className="max-w-screen-lg p-8">
      <div className="w-1/2 bg-slate-200 animate-pulse h-12 rounded mx-auto my-8"></div>
      <div className="mb-2 w-full h-4 bg-slate-200 animate-pulse rounded"></div>
      <div className="mb-2 w-full h-4 bg-slate-200 animate-pulse rounded"></div>
      <div className="mb-2 w-full h-4 bg-slate-200 animate-pulse rounded"></div>
      <div className="w-full h-4 bg-slate-200 animate-pulse rounded"></div>
    </Animatable>
  );
}
