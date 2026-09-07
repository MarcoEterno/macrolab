import { cookies } from 'next/headers';
import Simulator from '@/components/simulator';
export default async function Page() {
  const cookieStore = await cookies();
  const language =
    cookieStore.get('macrolab-language')?.value === 'it' ? 'it' : 'en';
  return <Simulator initialLanguage={language} />;
}
