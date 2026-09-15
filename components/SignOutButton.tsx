"use client";

import { signOut } from "@/lib/actions/auth";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
    >
      로그아웃
    </button>
  );
}
