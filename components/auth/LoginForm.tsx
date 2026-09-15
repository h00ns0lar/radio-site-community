"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type ActionState } from "@/lib/actions/auth";

const initialState: ActionState = { error: null };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className="text-xs text-muted">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-signal"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-xs text-muted">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-signal"
        />
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-signal py-2.5 text-sm font-medium text-background hover:bg-signal-soft transition-colors disabled:opacity-50"
      >
        {pending ? "로그인 중..." : "로그인"}
      </button>

      <p className="text-center text-xs text-muted">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="text-signal hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
