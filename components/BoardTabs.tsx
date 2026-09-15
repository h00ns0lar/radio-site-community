import Link from "next/link";

export default function BoardTabs({
  basePath,
  active,
}: {
  basePath: string;
  active: "list" | "write";
}) {
  return (
    <div className="flex gap-1 border-b border-line">
      <Link
        href={basePath}
        className={`px-4 py-2.5 text-sm font-medium transition-colors ${
          active === "list"
            ? "border-b-2 border-signal text-signal"
            : "text-muted hover:text-foreground"
        }`}
      >
        목록
      </Link>
    </div>
  );
}
