import { redirect } from 'next/navigation';

export default function SuccessPage({
  searchParams,
}: { searchParams: { session_id?: string } }) {
  const sid = searchParams.session_id;
  // volta para a home, onde está o TesteQI com a verificação
  redirect(`/?success=1${sid ? `&session_id=${encodeURIComponent(sid)}` : ''}`);
}
