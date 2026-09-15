import Link from "next/link";
import { getCurrentProfile } from "@/lib/current-user";
import SignOutButton from "@/components/SignOutButton";

const NAV = [
  { href: "/about", label: "소개" },
  { href: "/about/guide", label: "제작 가이드" },
  { href: "/about/usage", label: "사용법" },
  { href: "/community/observations", label: "관측 공유" },
  { href: "/community/board", label: "커뮤니티" },
];

export default async function Header() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-mono-data text-[21.6px] font-semibold">
          <span className="text-signal">AN</span>
          <span className="text-muted">:</span>
          <span>TENNA</span>
        </Link>

        <nav className="hidden items-center gap-6 text-[18px] text-muted md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {profile ? (
            <>
              <Link href="/mypage" className="text-sm hover:text-signal transition-colors">
                {profile.name}
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-muted hover:text-foreground transition-colors">
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-signal px-3 py-1.5 text-sm font-medium text-background hover:bg-signal-soft transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
      <nav className="flex items-center gap-4 overflow-x-auto border-t border-line-soft px-6 py-2 text-xs text-muted md:hidden">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-foreground">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
