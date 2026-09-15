import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <SectionHeading
        eyebrow="ABOUT THE PROJECT"
        title="전파망원경 교육 키트란?"
        desc="교실에서 직접 조립하고 운용할 수 있도록 설계된 소형 전파망원경 키트로, 교사와 학생이 천문학과 전파공학을 몸으로 배우는 것을 목표로 합니다."
      />

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-6">
          <h2 className="font-mono-data text-signal">WHY</h2>
          <h3 className="mt-2 text-lg font-medium">왜 전파망원경인가</h3>
          <p className="mt-3 text-sm text-muted">
            광학 망원경과 달리 전파망원경은 날씨와 낮/밤에 크게 구애받지 않고 관측할 수 있어
            교육 현장에서 다루기 좋습니다. 태양 전파, 은하수의 수소선(21cm) 신호처럼
            눈에 보이지 않는 우주를 &ldquo;신호&rdquo;로 직접 체험할 수 있습니다.
          </p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-6">
          <h2 className="font-mono-data text-signal">WHO</h2>
          <h3 className="mt-2 text-lg font-medium">누구를 위한 키트인가</h3>
          <p className="mt-3 text-sm text-muted">
            과학 동아리, 물리·지구과학 수업, 방과후 프로그램을 운영하는 교사와
            학생을 위해 설계되었습니다. 별도의 전문 장비 없이 조립·관측·데이터 분석까지
            한 학기 프로젝트로 진행할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-line bg-surface p-6">
        <h2 className="font-mono-data text-signal">HOW</h2>
        <h3 className="mt-2 text-lg font-medium">프로젝트 진행 흐름</h3>
        <ol className="mt-4 space-y-3 text-sm text-muted">
          <li>
            <span className="font-mono-data text-foreground">1.</span> 부품을 준비하고{" "}
            <Link href="/about/guide" className="text-signal hover:underline">
              제작 가이드
            </Link>
            를 따라 키트를 조립합니다.
          </li>
          <li>
            <span className="font-mono-data text-foreground">2.</span>{" "}
            <Link href="/about/usage" className="text-signal hover:underline">
              사용법 안내
            </Link>
            를 참고해 안테나를 조준하고 신호를 기록합니다.
          </li>
          <li>
            <span className="font-mono-data text-foreground">3.</span>{" "}
            <Link href="/community/observations" className="text-signal hover:underline">
              관측 공유 게시판
            </Link>
            에 결과를 올리고, 다른 학교의 관측과 비교해봅니다.
          </li>
          <li>
            <span className="font-mono-data text-foreground">4.</span>{" "}
            <Link href="/community/board" className="text-signal hover:underline">
              커뮤니티 게시판
            </Link>
            에서 궁금한 점을 묻고 노하우를 나눕니다.
          </li>
        </ol>
      </div>
    </div>
  );
}
