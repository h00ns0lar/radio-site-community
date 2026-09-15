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
    items: ["LNB(저잡음 컨버터) 또는 RTL-SDR 수신 모듈", "SDR 소프트웨어 구동용 노트북/PC"],
  },
  {
    key: "choice-required",
    label: "선택필수",
    badgeClass: "border-signal/40 text-signal",
    desc: "각 파트에서 최소 한 가지 이상을 선택해서 준비하세요.",
    parts: [
      {
        partLabel: "파트 1",
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
    items: [],
  },
];

const STEPS: { title: string; desc: string }[] = [];

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
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.desc}</p>
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
