import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import RoleBadge from "@/components/RoleBadge";
import CommentSection from "@/components/CommentSection";
import PostActions from "@/components/PostActions";
import CommunityPostForm from "@/components/CommunityPostForm";
import { deleteCommunityPost } from "@/lib/actions/posts";
import { CATEGORY_LABEL, type Comment, type CommunityPost } from "@/lib/types";

export default async function BoardDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  if (!isSupabaseConfigured()) notFound();

  const { id } = await params;
  const { edit } = await searchParams;
  const supabase = await createClient();

  const [{ data: post }, { data: comments }, { data: userData }] = await Promise.all([
    supabase
      .from("community_posts")
      .select("*, profiles(*)")
      .eq("id", id)
      .single() as unknown as Promise<{ data: CommunityPost | null }>,
    supabase
      .from("comments")
      .select("*, profiles(*)")
      .eq("post_type", "community")
      .eq("post_id", id)
      .order("created_at", { ascending: true })
      .returns<Comment[]>(),
    supabase.auth.getUser(),
  ]);

  if (!post) notFound();

  const isAuthor = !!userData.user && post.author_id === userData.user.id;

  if (edit === "1" && isAuthor) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold">글 수정</h1>
        <CommunityPostForm post={post} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="rounded border border-line-soft px-1.5 py-0.5 text-[11px] text-muted">
        {CATEGORY_LABEL[post.category]}
      </span>
      <h1 className="mt-3 text-2xl font-semibold md:text-3xl">{post.title}</h1>
      <div className="mt-3 flex items-center gap-2 text-sm text-muted">
        {post.profiles && (
          <>
            <RoleBadge role={post.profiles.role} />
            <span>{post.profiles.name}</span>
          </>
        )}
        <span>·</span>
        <span>{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
      </div>

      <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
        {post.content}
      </p>

      {isAuthor && (
        <PostActions
          editHref={`/community/board/${post.id}?edit=1`}
          onDelete={deleteCommunityPost.bind(null, post.id)}
        />
      )}

      <CommentSection
        postType="community"
        postId={post.id}
        path={`/community/board/${post.id}`}
        comments={comments ?? []}
        currentUserId={userData.user?.id ?? null}
      />
    </div>
  );
}
