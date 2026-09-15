"use client";

import { useActionState } from "react";
import { createObservationPost, updateObservationPost } from "@/lib/actions/posts";
import type { ActionState } from "@/lib/actions/auth";
import type { ObservationPost } from "@/lib/types";

const initialState: ActionState = { error: null };

export default function ObservationForm({ post }: { post?: ObservationPost }) {
  const action = post ? updateObservationPost.bind(null, post.id) : createObservationPost;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-8 max-w-xl space-y-4">
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
        <label htmlFor="observed_at" className="text-xs text-muted">
          관측일
        </label>
        <input
          id="observed_at"
          name="observed_at"
          type="date"
          required
          defaultValue={post?.observed_at}
          className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm font-mono-data outline-none focus:border-signal"
        />
      </div>

      <div>
        <label htmlFor="description" className="text-xs text-muted">
          관측 설명
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={post?.description}
          className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-signal"
          placeholder="관측 조건, 안테나 방향, 관찰한 신호 특징 등을 자유롭게 적어주세요."
        />
      </div>

      {post ? (
        <p className="text-xs text-muted">
          이미지는 수정 화면에서 변경할 수 없어요. 이미지를 바꾸려면 글을 삭제한 뒤 다시 작성해주세요.
        </p>
      ) : (
        <div>
          <label htmlFor="images" className="text-xs text-muted">
            관측 이미지 (선택, 여러 장 가능)
          </label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-signal file:px-3 file:py-1 file:text-background"
          />
        </div>
      )}

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
            ? "업로드 중..."
            : "관측 공유하기"}
      </button>
    </form>
  );
}
