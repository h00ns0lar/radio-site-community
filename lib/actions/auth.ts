"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type ActionState = { error: string | null };

const NOT_CONFIGURED_ERROR =
  "아직 Supabase 연결이 설정되지 않았어요. .env.local에 프로젝트 URL과 anon key를 설정해주세요.";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{4,20}$/;
const USERNAME_DOMAIN = "antenna.local";

function usernameToEmail(username: string) {
  return `${username.toLowerCase()}@${USERNAME_DOMAIN}`;
}

export async function signUp(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: NOT_CONFIGURED_ERROR };
  }

  const name = String(formData.get("name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "student");

  if (!name || !username || !password) {
    return { error: "이름, 아이디, 비밀번호를 모두 입력해주세요." };
  }
  if (!USERNAME_PATTERN.test(username)) {
    return { error: "아이디는 영문, 숫자, _만 사용해서 4~20자로 입력해주세요." };
  }
  if (password.length < 6) {
    return { error: "비밀번호는 6자 이상이어야 해요." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: usernameToEmail(username),
    password,
    options: { data: { name, role, username: username.toLowerCase() } },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "이미 사용 중인 아이디예요." };
    }
    return { error: error.message };
  }

  if (!data.session) {
    redirect("/login?confirm=1");
  }

  redirect("/mypage");
}

export async function signIn(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: NOT_CONFIGURED_ERROR };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });

  if (error) {
    return { error: "아이디 또는 비밀번호가 올바르지 않아요." };
  }

  redirect("/mypage");
}

export async function signOut() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
