import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentProfile } from "@/lib/current-user";
import SectionHeading from "@/components/SectionHeading";
import BoardTabs from "@/components/BoardTabs";
import RoleBadge from "@/components/RoleBadge";
import ObservationForm from "@/components/ObservationForm";
import SupabaseSetupNotice from "@/components/SupabaseSetupNotice";
import type { ObservationPost } from "@/lib/types";

export default async function ObservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const isWrite = tab === "write";

  if (isWrite) {
    const profile = await getCurrentProfile();
    if (!profile) redirect("/login");
  }

  let posts: ObservationPost[] | null = null;
  let commentCounts: Record<string, number> = {};
  if (!isWrite && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("observation_posts")
      .select("*, profiles(*)")
      .order("created_at", { ascending: false })
      .returns<ObservationPost[]>();
    posts = data;

    if (posts && posts.length > 0) {
      const { data: commentRows } = await supabase
        .from("comments")
        .select("post_id")
        .eq("post_type", "observation")
        .in(
          "post_id",
          posts.map((post) => post.id),
        );
      commentCounts = (commentRows ?? []).reduce<Record<string, number>>((acc, row) => {
        acc[row.post_id] = (acc[row.post_id] ?? 0) + 1;
        return acc;
      }, {});
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SectionHeading
        eyebrow="OBSERVATION LOG"
        title="관측 공유 게시판"
        desc="교사와 학생이 함께 조립한 전파망원경으로 관측한 결과를 공유하는 공간입니다."
        action={
          <Link
            href="/community/observations?tab=write"
            className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-white hover:bg-signal-soft transition-colors"
          >
            글쓰기
          </Link>
        }
      />

      <div className="mt-8">
        <BoardTabs basePath="/community/observations" active={isWrite ? "write" : "list"} />
      </div>

      {isWrite ? (
        <ObservationForm />
      ) : (
        <div className="mt-8">
          {!isSupabaseConfigured() ? (
            <SupabaseSetupNotice />
          ) : posts && posts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/community/observations/${post.id}`}
                  className="rounded-lg border border-line bg-surface p-5 hover:border-signal transition-colors"
                >
                  {post.image_urls[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.image_urls[0]}
                      alt={post.title}
                      className="mb-4 h-36 w-full rounded-md object-cover"
                    />
                  )}
                  <div className="font-mono-data text-xs text-muted">{post.observed_at}</div>
                  <h3 className="mt-1 font-medium">
                    {post.title}{" "}
                    <span className="text-danger">({commentCounts[post.id] ?? 0})</span>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{post.description}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                    {post.profiles && (
                      <>
                        <RoleBadge role={post.profiles.role} />
                        <span>{post.profiles.name}</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-muted">
              아직 공유된 관측이 없어요. 첫 번째 관측 결과를 올려보세요.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
