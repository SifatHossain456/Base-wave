import { Hero } from '@/components/home/Hero';
import { LiveStats } from '@/components/home/LiveStats';
import { TopProtocols } from '@/components/home/TopProtocols';
import { EcosystemBanner } from '@/components/home/EcosystemBanner';

export default function HomePage() {
  return (
    <>
      <Hero />
      <LiveStats />
      <TopProtocols />
      <EcosystemBanner />
    </>
  );
}
