import SectionHeading from "@/components/SectionHeading";

const SECTIONS = [
  {
    title: "관측 전 준비",
    items: [
      "관측 장소는 주변에 큰 건물이나 나무가 없는 개활지를 선택합니다.",
      "안테나를 관측 대상(태양, 은하수 방향 등)에 맞춰 고정합니다.",
      "SDR 소프트웨어를 열고 주파수·샘플레이트·게인 값을 점검합니다.",
    ],
  },
  {
    title: "관측 진행",
    items: [
      "스펙트럼 화면에서 잡음 대비 신호 피크가 나타나는지 확인합니다.",
      "일정 시간 간격으로 스크린샷과 원본 데이터를 기록합니다.",
      "관측 시각, 안테나 방향(방위각/고도), 날씨 등 관측 조건을 함께 기록합니다.",
    ],
  },
  {
    title: "데이터 정리 및 공유",
    items: [
      "관측 이미지와 요약 설명을 정리합니다.",
      "관측 공유 게시판에 제목, 관측일, 설명과 함께 업로드합니다.",
      "궁금한 점이나 특이 신호는 커뮤니티 게시판에 질문으로 올려 함께 해석해봅니다.",
    ],
  },
];

export default function UsagePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <SectionHeading
        eyebrow="HOW TO USE"
        title="사용법 안내"
        desc="조립을 마친 뒤 실제 관측을 진행하는 순서입니다. 학교 환경에 맞게 조정해 사용하세요."
      />

      <div className="mt-12 space-y-10">
        {SECTIONS.map((section, i) => (
          <div key={section.title}>
            <div className="flex items-center gap-3">
              <span className="font-mono-data text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="text-lg font-medium">{section.title}</h2>
            </div>
            <ul className="mt-4 space-y-2 border-l border-line pl-6">
              {section.items.map((item) => (
                <li key={item} className="text-sm text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
