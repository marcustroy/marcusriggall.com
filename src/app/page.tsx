import HeroVignette from '@/components/vignettes/hero/HeroVignette';
import WorkSection from '@/components/WorkSection';
import Header from '@/components/Header';
import { IntroSequenceProvider } from '@/lib/intro-sequence-context';

export default function Home() {
  return (
    <IntroSequenceProvider>
      <Header />
      <main className="w-full min-h-screen text-primary bg-transparent relative z-10">
        <div>
          <HeroVignette />
          <WorkSection />
        </div>
      </main>
    </IntroSequenceProvider>
  );
}
