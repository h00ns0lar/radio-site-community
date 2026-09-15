import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ confirm?: string }>;
}) {
  const { confirm } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <p className="font-mono-data text-sm text-signal">SIGN IN</p>
      <h1 className="mt-2 text-2xl font-semibold">로그인</h1>

      {confirm && (
        <p className="mt-4 rounded-md border border-wave/40 bg-wave/10 px-3 py-2 text-sm text-wave">
          가입이 완료됐어요. 이메일 확인이 필요한 경우 메일함을 확인한 뒤 로그인해주세요.
        </p>
      )}

      <LoginForm />
    </div>
  );
}
