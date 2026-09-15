import { ROLE_LABEL, type Role } from "@/lib/types";

export default function RoleBadge({ role }: { role: Role }) {
  const isTeacher = role === "teacher";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-mono-data ${
        isTeacher
          ? "border-wave/40 text-wave"
          : "border-signal/40 text-signal"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ROLE_LABEL[role]}
    </span>
  );
}
