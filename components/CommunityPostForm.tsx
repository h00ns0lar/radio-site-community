"use client";

import { useActionState, useState } from "react";
import { createCommunityPost, updateCommunityPost } from "@/lib/actions/posts";
import type { ActionState } from "@/lib/actions/auth";
import { CATEGORY_LABEL, type CommunityCategory, type CommunityPost } from "@/lib/types";

const initialState: ActionState = { error: null };
const CATEGORIES: CommunityCategory[] = ["free", "question", "tip"];

export default function CommunityPostForm({ post }: { post?: CommunityPost }) {
  const action = post ? updateCommunityPost.bind(null, post.id) : createCommunityPost;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [category, setCategory] = useState<CommunityCategory>(post?.category ?? "free");

  return (
    <form action={formAction} className="mt-8 max-w-xl space-y-4">
      <div>
        <span className="text-xs text-muted">카테고리</span>
        <input type="hidden" name="category" value={category} />
        <div className="mt-1 flex gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                category === c
                  ? "border-signal text-signal"
                  : "border-line text-muted hover:border-foreground/40"
              }`}
            >
              {CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="title" className="text-xs text-muted">
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={post?.title}
          className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-signal"
        />
      </div>

      <div>
        <label htmlFor="content" className="text-xs text-muted">
          내용
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={8}
          defaultValue={post?.content}
          className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-signal"
        />
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-background hover:bg-signal-soft transition-colors disabled:opacity-50"
      >
        {post
          ? pending
            ? "저장 중..."
            : "수정 완료"
          : pending
            ? "등록 중..."
            : "글 등록하기"}
      </button>
    </form>
  );
}
