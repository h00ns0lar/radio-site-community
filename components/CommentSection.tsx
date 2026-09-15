"use client";

import { useActionState } from "react";
import Link from "next/link";
import CommentItem from "@/components/CommentItem";
import { createComment } from "@/lib/actions/comments";
import type { ActionState } from "@/lib/actions/auth";
import type { Comment, PostType } from "@/lib/types";

const initialState: ActionState = { error: null };

export default function CommentSection({
  postType,
  postId,
  path,
  comments,
  currentUserId,
}: {
  postType: PostType;
  postId: string;
  path: string;
  comments: Comment[];
  currentUserId: string | null;
}) {
  const [state, formAction, pending] = useActionState(createComment, initialState);

  return (
    <div className="mt-12 border-t border-line pt-8">
      <h2 className="font-mono-data text-sm text-signal">COMMENTS ({comments.length})</h2>

      <div className="mt-4 space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            path={path}
            isAuthor={!!currentUserId && comment.author_id === currentUserId}
          />
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-muted">첫 댓글을 남겨보세요.</p>
        )}
      </div>

      {currentUserId ? (
        <form action={formAction} className="mt-6 space-y-2">
          <input type="hidden" name="post_type" value={postType} />
          <input type="hidden" name="post_id" value={postId} />
          <input type="hidden" name="path" value={path} />
          <textarea
            name="content"
            required
            rows={3}
            placeholder="댓글을 입력하세요"
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-signal"
          />
          {state.error && <p className="text-sm text-danger">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-background hover:bg-signal-soft transition-colors disabled:opacity-50"
          >
            {pending ? "등록 중..." : "댓글 등록"}
          </button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-muted">
          <Link href="/login" className="text-signal hover:underline">
            로그인
          </Link>
          하면 댓글을 남길 수 있어요.
        </p>
      )}
    </div>
  );
}
