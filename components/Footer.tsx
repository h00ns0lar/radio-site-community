export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 text-xs text-muted">
        <div className="font-mono-data text-sm text-foreground">AN:TENNA</div>
        <p>전파망원경 교육 키트 프로젝트 — 교사와 학생이 함께 만들고 관측하고 나눕니다.</p>
        <p className="font-mono-data">© {new Date().getFullYear()} AN:TENNA Project</p>
      </div>
    </footer>
  );
}
