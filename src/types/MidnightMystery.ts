export type MidnightMysteryPhase = 'story_selection' | 'story_preview' | 'solving' | 'winner_selection' | 'all_stories_played';

export interface Story {
    id: string;
    title: string;
    preview: string;
    solution: string;
}
  
export interface MidnightMysteryState {
    gameState: MidnightMysteryPhase;
    stories: Story[];
    playedStoryIds: string[];
    currentStory: Story | null;
    scores: { [key: number]: number };
}