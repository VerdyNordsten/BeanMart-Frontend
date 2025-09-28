import { StoryHero } from "@/features/story/StoryHero";
import { MissionStatement } from "@/features/story/MissionStatement";
import { ValuesSection } from "@/features/story/ValuesSection";
import { TimelineSection } from "@/features/story/TimelineSection";
import { ImpactStats } from "@/features/story/ImpactStats";
import { CallToAction } from "@/features/story/CallToAction";

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