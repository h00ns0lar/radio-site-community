export default function SupabaseSetupNotice() {
  return (
    <div className="rounded-lg border border-dashed border-line bg-surface px-4 py-10 text-center text-sm text-muted">
      Supabase 연결이 아직 설정되지 않았어요.
      <br />
      <code className="font-mono-data text-xs">.env.local</code>에 프로젝트 URL과 anon key를
      설정하면 커뮤니티 기능이 활성화됩니다.
    </div>
  );
}
