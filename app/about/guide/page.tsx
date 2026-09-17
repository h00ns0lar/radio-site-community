import SectionHeading from "@/components/SectionHeading";

type PartGroup = {
  key: string;
  label: string;
  badgeClass: string;
  desc: string;
  items?: string[];
  parts?: { partLabel: string; items: string[] }[];
};

const PART_GROUPS: PartGroup[] = [
  {
    key: "required",
    label: "필수",
    badgeClass: "border-danger/40 text-danger",
    desc: "빠지면 관측 자체가 불가능한 핵심 부품입니다.",
    items: ["LNB(저잡음 컨버터) 또는 RTL-SDR 수신 모듈", "SDR 소프트웨어 구동용 노트북/PC", "구리 탐침"],
  },
  {
    key: "choice-required",
    label: "선택필수",
    badgeClass: "border-signal/40 text-signal",
    desc: "각 파트에서 최소 한 가지 이상을 선택해서 준비하세요.",
    parts: [
      {
        partLabel: "파트1(구경 약 50cm 기준)",
        items: ["우드락", "알루미늄 호일", "알루미늄 테이프", "빈 깡통 (구경 15cm 추천)"],
      },
      {
        partLabel: "파트 2",
        items: [],
      },
    ],
  },
  {
    key: "optional",
    label: "선택",
    badgeClass: "border-line text-muted",
    desc: "있으면 더 좋은 부가 부품입니다.",
    items: ["망원경 삼각대", "가대"],
  },
];

const STEPS: { title: string; desc: string; image?: string; imageCaption?: string }[] = [
  {
    title: "깡통에 구멍 뚫기",
    desc: "바닥에서 8.5cm 부근에 0.7cm 직경의 구멍을 뚫어 주세요.",
  },
  {
    title: "우드락 재단",
    desc: "아래 사진과 같이 우드락을 잘라주세요.",
    image: "/guide/woodrock-cut-pattern.svg",
    imageCaption:
      "삼각형 밑변은 100mm(10cm) 기준이에요. 양 끝 회색 점선 부분은 버리는 자투리인데, 삼각형 대각선을 따라 생기는 사다리꼴 모양이라 위쪽 폭은 약 55mm(5.5cm), 아래쪽 폭은 5mm 정도예요.",
  },
  {
    title: "원뿔 제작 및 고정",
    desc: "우드락을 원뿔 모양으로 만들고 빈 깡통에 맞게 넣은 후 고정시켜주세요.",
  },
  {
    title: "반사판 마감",
    desc: "원뿔 안쪽에 알루미늄 호일과 테이프를 빈틈없이 붙여주세요.",
  },
  {
    title: "탐침 삽입 및 수신부 연결",
    desc: "깡통에 뚫은 구멍에 탐침을 삽입하고, 그 후 LNA와 SDR을 순서대로 연결해주세요.",
  },
  {
    title: "프로그램 실행 및 촬영",
    desc: "노트북에 연결해 프로그램을 실행시켜 주고, 촬영을 진행해주세요.",
  },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <SectionHeading
        eyebrow="BUILD GUIDE"
        title="키트 제작 가이드"
        desc="아래 부품 목록과 단계를 따라 전파망원경 키트를 조립하세요. 학교 상황에 맞춰 부품은 대체할 수 있습니다."
      />

      <div className="mt-12">
        <h2 className="font-mono-data text-sm text-signal">PARTS LIST</h2>
        <div className="mt-4 space-y-5">
          {PART_GROUPS.map((group) => (
            <div key={group.key} className="rounded-lg border border-line bg-surface p-5">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${group.badgeClass}`}
                >
                  {group.label}
                </span>
                <p className="text-sm text-muted">{group.desc}</p>
              </div>

              {group.parts ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {group.parts.map((part) => (
                    <div key={part.partLabel} className="rounded-md border border-line-soft p-4">
                      <div className="font-mono-data text-xs text-muted">{part.partLabel}</div>
                      {part.items.length > 0 ? (
                        <ul className="mt-2 space-y-1.5 text-sm">
                          {part.items.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/50" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-muted">준비 중입니다.</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : group.items && group.items.length > 0 ? (
                <ul className="mt-4 space-y-1.5 text-sm">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted">준비 중입니다.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="font-mono-data text-sm text-signal">ASSEMBLY STEPS</h2>
        {STEPS.length > 0 ? (
          <ol className="mt-4 space-y-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-lg border border-line bg-surface p-5">
                <div className="font-mono-data text-xl text-signal">{String(i + 1).padStart(2, "0")}</div>
                <div className="flex-1">
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.desc}</p>
                  {step.image && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={step.image}
                        alt={step.title}
                        className="mt-3 w-full max-w-md rounded-md border border-line-soft bg-surface-2"
                      />
                      {step.imageCaption && (
                        <p className="mt-2 max-w-md text-xs text-muted">{step.imageCaption}</p>
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-4 rounded-lg border border-line bg-surface p-5">
            <p className="text-sm text-muted">준비 중입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
