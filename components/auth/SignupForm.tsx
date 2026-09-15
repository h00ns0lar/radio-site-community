"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUp, type ActionState } from "@/lib/actions/auth";
import type { Role } from "@/lib/types";

const initialState: ActionState = { error: null };

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [role, setRole] = useState<Role>("student");

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label htmlFor="name" className="text-xs text-muted">
          이름
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-signal"
        />
      </div>
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
          비밀번호 (6자 이상)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-signal"
        />
      </div>

      <div>
        <span className="text-xs text-muted">역할</span>
        <input type="hidden" name="role" value={role} />
        <div className="mt-1 grid grid-cols-2 gap-2">
          {(["student", "teacher"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                role === r
                  ? "border-signal text-signal"
                  : "border-line text-muted hover:border-foreground/40"
              }`}
            >
              {r === "student" ? "학생" : "교사"}
            </button>
          ))}
        </div>
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-signal py-2.5 text-sm font-medium text-background hover:bg-signal-soft transition-colors disabled:opacity-50"
      >
        {pending ? "가입 중..." : "회원가입"}
      </button>

      <p className="text-center text-xs text-muted">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-signal hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
