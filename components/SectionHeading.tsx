export default function SectionHeading({
  eyebrow,
  title,
  desc,
  action,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-line pb-10">
      <div>
        <p className="font-mono-data text-sm text-signal">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h1>
        {desc && <p className="mt-4 max-w-2xl text-muted">{desc}</p>}
      </div>
      {action && <div className="mt-1 shrink-0">{action}</div>}
    </div>
  );
}
