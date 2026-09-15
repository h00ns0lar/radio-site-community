import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <p className="font-mono-data text-sm text-signal">SIGN UP</p>
      <h1 className="mt-2 text-2xl font-semibold">회원가입</h1>
      <p className="mt-2 text-sm text-muted">
        교사·학생 여부는 게시글에 배지로만 표시돼요. 게시판 이용에는 제한이 없어요.
      </p>
      <SignupForm />
    </div>
  );
}
