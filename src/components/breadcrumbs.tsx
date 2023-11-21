import Link from "next/link";

export default function Breadcrumbs({ path }: { path: string }) {
  const pathList = path.split("/").filter((p) => p);

  return (
    <p className="py-4 text-sm">
      <Link href="/">Home</Link>
      {pathList.map((p, idx) => {
        const label = p.slice(0, 1).toUpperCase() + p.slice(1);

        return (
          <>
            {" > "}
            <Link href={"/" + p}>{label}</Link>
          </>
        );
      })}
    </p>
  );
}
