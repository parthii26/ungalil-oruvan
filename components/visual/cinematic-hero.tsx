"use client";

import { GrowthStory } from "@/components/story/growth-story";
import type { GrowthStoryView } from "@/lib/story/types";

export function CinematicHero({ story }: { story: GrowthStoryView }) {
  return <GrowthStory story={story} />;
}
