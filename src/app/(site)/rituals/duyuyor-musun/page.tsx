import { rituals } from '@/lib/data';
import { notFound } from 'next/navigation';
import RitualView from '@/components/RitualView';

export default function Page() {
  const ritual = rituals.find((r) => r.slug === 'duyuyor-musun');
  if (!ritual) notFound();
  return <RitualView ritual={ritual} />;
}
