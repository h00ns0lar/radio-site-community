import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import RoleBadge from "@/components/RoleBadge";
import CommentSection from "@/components/CommentSection";
import PostActions from "@/components/PostActions";
import ObservationForm from "@/components/ObservationForm";
import { deleteObservationPost } from "@/lib/actions/posts";
import type { Comment, ObservationPost } from "@/lib/types";

export default async function ObservationDetailPage({
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
      .from("observation_posts")
      .select("*, profiles(*)")
      .eq("id", id)
      .single() as unknown as Promise<{ data: ObservationPost | null }>,
    supabase
      .from("comments")
      .select("*, profiles(*)")
      .eq("post_type", "observation")
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
        <h1 className="text-2xl font-semibold">관측 글 수정</h1>
        <ObservationForm post={post} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="font-mono-data text-xs text-signal">{post.observed_at}</div>
      <h1 className="mt-2 text-2xl font-semibold md:text-3xl">{post.title}</h1>
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

      {post.image_urls.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {post.image_urls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt={post.title} className="w-full rounded-lg border border-line" />
          ))}
        </div>
      )}

      <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
        {post.description}
      </p>

      {isAuthor && (
        <PostActions
          editHref={`/community/observations/${post.id}?edit=1`}
          onDelete={deleteObservationPost.bind(null, post.id)}
        />
      )}

      <CommentSection
        postType="observation"
        postId={post.id}
        path={`/community/observations/${post.id}`}
        comments={comments ?? []}
        currentUserId={userData.user?.id ?? null}
      />
    </div>
  );
}
