import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentProfile } from "@/lib/current-user";
import SectionHeading from "@/components/SectionHeading";
import BoardTabs from "@/components/BoardTabs";
import RoleBadge from "@/components/RoleBadge";
import CommunityPostForm from "@/components/CommunityPostForm";
import SupabaseSetupNotice from "@/components/SupabaseSetupNotice";
import { CATEGORY_LABEL, type CommunityCategory, type CommunityPost } from "@/lib/types";

const CATEGORIES: CommunityCategory[] = ["free", "question", "tip"];

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; cat?: string }>;
}) {
  const { tab, cat } = await searchParams;
  const isWrite = tab === "write";
  const activeCategory = CATEGORIES.includes(cat as CommunityCategory)
    ? (cat as CommunityCategory)
    : null;

  if (isWrite) {
    const profile = await getCurrentProfile();
    if (!profile) redirect("/login");
  }

  let posts: CommunityPost[] | null = null;
  let commentCounts: Record<string, number> = {};
  if (!isWrite && isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase
      .from("community_posts")
      .select("*, profiles(*)")
      .order("created_at", { ascending: false });
    if (activeCategory) query = query.eq("category", activeCategory);
    const { data } = await query.returns<CommunityPost[]>();
    posts = data;

    if (posts && posts.length > 0) {
      const { data: commentRows } = await supabase
        .from("comments")
        .select("post_id")
        .eq("post_type", "community")
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
    <div className="mx-auto max-w-4xl px-6 py-16">
      <SectionHeading
        eyebrow="TEACHER & STUDENT COMMUNITY"
        title="커뮤니티 게시판"
        desc="자유로운 이야기, 질문, 사용 노하우를 교사와 학생이 함께 나누는 공간입니다."
        action={
          <Link
            href="/community/board?tab=write"
            className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-white hover:bg-signal-soft transition-colors"
          >
            글쓰기
          </Link>
        }
      />

      <div className="mt-8">
        <BoardTabs basePath="/community/board" active={isWrite ? "write" : "list"} />
      </div>

      {isWrite ? (
        <CommunityPostForm />
      ) : !isSupabaseConfigured() ? (
        <div className="mt-8">
          <SupabaseSetupNotice />
        </div>
      ) : (
        <div className="mt-8">
          <div className="flex gap-2">
            <Link
              href="/community/board"
              className={`rounded-full border px-3 py-1 text-xs ${
                !activeCategory ? "border-signal text-signal" : "border-line text-muted"
              }`}
            >
              전체
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/community/board?cat=${c}`}
                className={`rounded-full border px-3 py-1 text-xs ${
                  activeCategory === c ? "border-signal text-signal" : "border-line text-muted"
                }`}
              >
                {CATEGORY_LABEL[c]}
              </Link>
            ))}
          </div>

          <div className="mt-6 divide-y divide-line-soft border border-line rounded-lg">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/community/board/${post.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-surface"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded border border-line-soft px-1.5 py-0.5 text-[11px] text-muted">
                        {CATEGORY_LABEL[post.category]}
                      </span>
                      <span className="truncate font-medium">{post.title}</span>
                      <span className="shrink-0 text-danger">
                        ({commentCounts[post.id] ?? 0})
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                      {post.profiles && (
                        <>
                          <RoleBadge role={post.profiles.role} />
                          <span>{post.profiles.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 font-mono-data text-xs text-muted">
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </Link>
              ))
            ) : (
              <p className="px-4 py-16 text-center text-sm text-muted">아직 글이 없어요.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
