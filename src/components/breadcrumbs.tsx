import Link from "next/link";

export default function Breadcrumbs({ path }: { path: string }) {
  const pathList = path.split("/").filter((p) => p);

  return (
    <p className="py-4">
      <Link href="/" className="text-green-500">
        Home
      </Link>
      {pathList.map((p, idx) => {
        const label = p.slice(0, 1).toUpperCase() + p.slice(1);

        return (
          <>
            {" > "}
            {idx < pathList.length - 1 ? (
              <Link href={p} className="underline text-green-500">
                {label}
              </Link>
            ) : (
              label
            )}
          </>
        );
      })}
    </p>
  );
}
