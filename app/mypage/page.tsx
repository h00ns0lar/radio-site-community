import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-user";
import RoleBadge from "@/components/RoleBadge";
import { CATEGORY_LABEL, type CommunityPost, type ObservationPost } from "@/lib/types";

export default async function MyPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();
  const [{ data: observations }, { data: posts }] = await Promise.all([
    supabase
      .from("observation_posts")
      .select("*")
      .eq("author_id", profile.id)
      .order("created_at", { ascending: false })
      .returns<ObservationPost[]>(),
    supabase
      .from("community_posts")
      .select("*")
      .eq("author_id", profile.id)
      .order("created_at", { ascending: false })
      .returns<CommunityPost[]>(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{profile.name}</h1>
        <RoleBadge role={profile.role} />
      </div>
      <p className="mt-1 font-mono-data text-xs text-muted">
        가입일 {new Date(profile.created_at).toLocaleDateString("ko-KR")}
      </p>

      <div className="mt-12">
        <h2 className="font-mono-data text-sm text-signal">MY OBSERVATIONS</h2>
        <div className="mt-4 divide-y divide-line-soft border border-line rounded-lg">
          {observations && observations.length > 0 ? (
            observations.map((post) => (
              <Link
                key={post.id}
                href={`/community/observations/${post.id}`}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-surface"
              >
                <span>{post.title}</span>
                <span className="font-mono-data text-xs text-muted">{post.observed_at}</span>
              </Link>
            ))
          ) : (
            <p className="px-4 py-6 text-sm text-muted">아직 공유한 관측이 없어요.</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-mono-data text-sm text-signal">MY POSTS</h2>
        <div className="mt-4 divide-y divide-line-soft border border-line rounded-lg">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/board/${post.id}`}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-surface"
              >
                <span>{post.title}</span>
                <span className="font-mono-data text-xs text-muted">
                  {CATEGORY_LABEL[post.category]}
                </span>
              </Link>
            ))
          ) : (
            <p className="px-4 py-6 text-sm text-muted">아직 작성한 글이 없어요.</p>
          )}
        </div>
      </div>
    </div>
  );
}
