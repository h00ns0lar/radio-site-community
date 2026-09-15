"use client";

import Link from "next/link";

export default function PostActions({
  editHref,
  onDelete,
}: {
  editHref: string;
  onDelete: () => Promise<void>;
}) {
  const handleDelete = () => {
    if (confirm("정말 삭제할까요? 되돌릴 수 없어요.")) {
      onDelete();
    }
  };

  return (
    <div className="mt-6 flex justify-end gap-3 text-xs">
      <button
        type="button"
        onClick={handleDelete}
        className="text-muted underline underline-offset-2 hover:text-danger"
      >
        삭제
      </button>
      <Link
        href={editHref}
        className="text-muted underline underline-offset-2 hover:text-foreground"
      >
        수정
      </Link>
    </div>
  );
}
