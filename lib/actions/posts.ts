"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/actions/auth";
import type { CommunityCategory } from "@/lib/types";

export async function createObservationPost(
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

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const observedAt = String(formData.get("observed_at") ?? "");
  const images = formData.getAll("images").filter(
    (file): file is File => file instanceof File && file.size > 0,
  );

  if (!title || !description || !observedAt) {
    return { error: "제목, 설명, 관측일을 모두 입력해주세요." };
  }

  const imageUrls: string[] = [];
  for (const file of images) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("observation-images")
      .upload(path, file, { contentType: file.type || undefined });

    if (uploadError) {
      return { error: `이미지 업로드에 실패했어요: ${uploadError.message}` };
    }

    const { data: publicUrl } = supabase.storage
      .from("observation-images")
      .getPublicUrl(path);
    imageUrls.push(publicUrl.publicUrl);
  }

  const { data: post, error } = await supabase
    .from("observation_posts")
    .insert({
      author_id: user.id,
      title,
      description,
      observed_at: observedAt,
      image_urls: imageUrls,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/community/observations");
  redirect(`/community/observations/${post.id}`);
}

export async function updateObservationPost(
  id: string,
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

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const observedAt = String(formData.get("observed_at") ?? "");

  if (!title || !description || !observedAt) {
    return { error: "제목, 설명, 관측일을 모두 입력해주세요." };
  }

  const { error } = await supabase
    .from("observation_posts")
    .update({ title, description, observed_at: observedAt })
    .eq("id", id)
    .eq("author_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/community/observations");
  revalidatePath(`/community/observations/${id}`);
  redirect(`/community/observations/${id}`);
}

export async function deleteObservationPost(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("observation_posts").delete().eq("id", id).eq("author_id", user.id);

  revalidatePath("/community/observations");
  redirect("/community/observations");
}

export async function createCommunityPost(
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

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "free") as CommunityCategory;

  if (!title || !content) {
    return { error: "제목과 내용을 입력해주세요." };
  }

  const { data: post, error } = await supabase
    .from("community_posts")
    .insert({ author_id: user.id, title, content, category })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/community/board");
  redirect(`/community/board/${post.id}`);
}

export async function updateCommunityPost(
  id: string,
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

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "free") as CommunityCategory;

  if (!title || !content) {
    return { error: "제목과 내용을 입력해주세요." };
  }

  const { error } = await supabase
    .from("community_posts")
    .update({ title, content, category })
    .eq("id", id)
    .eq("author_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/community/board");
  revalidatePath(`/community/board/${id}`);
  redirect(`/community/board/${id}`);
}

export async function deleteCommunityPost(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("community_posts").delete().eq("id", id).eq("author_id", user.id);

  revalidatePath("/community/board");
  redirect("/community/board");
}
