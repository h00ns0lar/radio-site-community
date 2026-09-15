"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/actions/auth";
import type { PostType } from "@/lib/types";

export async function createComment(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요해요." };
  }

  const content = String(formData.get("content") ?? "").trim();
  const postType = String(formData.get("post_type") ?? "") as PostType;
  const postId = String(formData.get("post_id") ?? "");
  const path = String(formData.get("path") ?? "/");

  if (!content) {
    return { error: "댓글 내용을 입력해주세요." };
  }

  const { error } = await supabase.from("comments").insert({
    author_id: user.id,
    post_type: postType,
    post_id: postId,
    content,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(path);
  return { error: null };
}

export async function updateComment(
  id: string,
  path: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요해요." };
  }

  const content = String(formData.get("content") ?? "").trim();

  if (!content) {
    return { error: "댓글 내용을 입력해주세요." };
  }

  const { error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", id)
    .eq("author_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(path);
  return { error: null };
}

export async function deleteComment(id: string, path: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("comments").delete().eq("id", id).eq("author_id", user.id);

  revalidatePath(path);
}
