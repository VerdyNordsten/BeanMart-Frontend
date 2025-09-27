import { StoryHero } from '@/components/story/StoryHero';
import { MissionStatement } from '@/components/story/MissionStatement';
import { ValuesSection } from '@/components/story/ValuesSection';
import { TimelineSection } from '@/components/story/TimelineSection';
import { ImpactStats } from '@/components/story/ImpactStats';
import { CallToAction } from '@/components/story/CallToAction';

export default function Story() {
  return (
    <div className="min-h-screen bg-background">
      <StoryHero />
      <MissionStatement />
      <ValuesSection />
      <TimelineSection />
      <ImpactStats />
      <CallToAction />
    </div>
  );
}