import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import Waveform from "@/components/Waveform";
import RoleBadge from "@/components/RoleBadge";
import type { ObservationPost } from "@/lib/types";

export default async function Home() {
  let recent: ObservationPost[] | null = null;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("observation_posts")
      .select("*, profiles(*)")
      .order("created_at", { ascending: false })
      .limit(3)
      .returns<ObservationPost[]>();
    recent = data;
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="font-mono-data text-sm text-signal">RADIO TELESCOPE EDU KIT</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
            직접 만든 전파망원경으로,
            <br />
            <span className="text-signal">우주의 신호</span>를 듣습니다.
          </h1>
          <p className="mt-6 max-w-xl text-muted">
            AN:TENNA는 교사와 학생이 직접 조립하는 전파망원경 교육 키트 프로젝트입니다.
            함께 만든 망원경으로 관측한 데이터를 공유하고, 사용법과 노하우를 나누세요.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/about/guide"
              className="rounded-md bg-signal px-5 py-3 text-sm font-medium text-background hover:bg-signal-soft transition-colors"
            >
              키트 제작 가이드 보기
            </Link>
            <Link
              href="/community/observations"
              className="rounded-md border border-line px-5 py-3 text-sm font-medium hover:border-signal hover:text-signal transition-colors"
            >
              관측 공유 둘러보기
            </Link>
          </div>
        </div>
        <Waveform className="h-16 w-full text-signal/40" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "01. 만든다",
              desc: "부품 목록과 단계별 가이드를 따라 교실에서 전파망원경 키트를 직접 조립합니다.",
              href: "/about/guide",
            },
            {
              title: "02. 관측한다",
              desc: "사용법 안내를 참고해 전파 신호를 관측하고 데이터를 기록합니다.",
              href: "/about/usage",
            },
            {
              title: "03. 나눈다",
              desc: "관측 결과를 공유하고, 다른 교사·학생들과 질문과 노하우를 주고받습니다.",
              href: "/community/board",
            },
          ].map((step) => (
            <Link
              key={step.title}
              href={step.href}
              className="group rounded-lg border border-line bg-surface p-6 transition-colors hover:border-signal"
            >
              <div className="font-mono-data text-signal">{step.title}</div>
              <p className="mt-3 text-sm text-muted group-hover:text-foreground transition-colors">
                {step.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono-data text-sm text-signal">LATEST OBSERVATIONS</p>
              <h2 className="mt-2 text-2xl font-semibold">최근 공유된 관측</h2>
            </div>
            <Link href="/community/observations" className="text-sm text-muted hover:text-signal">
              전체 보기 →
            </Link>
          </div>

          {recent && recent.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {recent.map((post) => (
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
                  <h3 className="mt-1 font-medium">{post.title}</h3>
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
            <p className="mt-8 text-sm text-muted">
              아직 공유된 관측이 없어요. 첫 번째 관측 결과를 올려보세요.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
