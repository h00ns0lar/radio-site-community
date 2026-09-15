"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import RoleBadge from "@/components/RoleBadge";
import { deleteComment, updateComment } from "@/lib/actions/comments";
import type { Comment } from "@/lib/types";

export default function CommentItem({
  comment,
  path,
  isAuthor,
}: {
  comment: Comment;
  path: string;
  isAuthor: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateComment(comment.id, path, { error: null }, formData);
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
        setIsEditing(false);
        router.refresh();
      }
    });
  };

  const handleDelete = () => {
    if (confirm("댓글을 삭제할까요? 되돌릴 수 없어요.")) {
      startTransition(async () => {
        await deleteComment(comment.id, path);
        router.refresh();
      });
    }
  };

  return (
    <div className="rounded-md border border-line-soft bg-surface p-4">
      <div className="flex items-center gap-2 text-xs">
        {comment.profiles && (
          <>
            <span className="font-medium">{comment.profiles.name}</span>
            <RoleBadge role={comment.profiles.role} />
          </>
        )}
        <span className="ml-auto font-mono-data text-muted">
          {new Date(comment.created_at).toLocaleString("ko-KR")}
        </span>
      </div>

      {isEditing ? (
        <form action={handleSave} className="mt-2 space-y-2">
          <textarea
            name="content"
            required
            rows={3}
            defaultValue={comment.content}
            className="w-full rounded-md border border-line bg-background px-3 py-2 text-sm outline-none focus:border-signal"
          />
          {error && <p className="text-xs text-danger">{error}</p>}
          <div className="flex justify-end gap-3 text-xs">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsEditing(false);
              }}
              className="text-muted underline underline-offset-2 hover:text-foreground"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="text-signal underline underline-offset-2 hover:text-signal-soft disabled:opacity-50"
            >
              {isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="mt-2 text-sm whitespace-pre-wrap">{comment.content}</p>
          {isAuthor && (
            <div className="mt-2 flex justify-end gap-3 text-xs">
              <button
                type="button"
                onClick={handleDelete}
                className="text-muted underline underline-offset-2 hover:text-danger"
              >
                삭제
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-muted underline underline-offset-2 hover:text-foreground"
              >
                수정
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
