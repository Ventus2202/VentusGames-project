import { useState, useCallback } from 'react';
import { Player } from '../types/Player';
import { Story, MidnightMysteryPhase, MidnightMysteryState } from '../types/MidnightMystery';

const MYSTERY_STORAGE_KEY = 'midnightMysteryState';

export const useMidnightMysteryGame = (players: Player[], allStories: Story[]) => {
  const [gameState, setGameStateInternal] = useState<MidnightMysteryState | null>(() => {
    try {
      const saved = sessionStorage.getItem(MYSTERY_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      // Basic validation to ensure saved state is not wildly different
      if (parsed && parsed.scores) {
        return parsed;
      }
      return null;
    } catch (error) {
      console.error("Failed to parse midnight mystery state from sessionStorage", error);
      return null;
    }
  });

  const setGameState = useCallback((state: MidnightMysteryState | null) => {
    try {
      sessionStorage.setItem(MYSTERY_STORAGE_KEY, JSON.stringify(state));
      setGameStateInternal(state);
    } catch (error) {
      console.error("Failed to save midnight mystery state to sessionStorage", error);
    }
  }, []);

  const initializeGame = useCallback(() => {
    const initialScores: { [key: number]: number } = {};
    players.forEach(p => {
      initialScores[p.id] = 0;
    });

    const newState: MidnightMysteryState = {
      gameState: 'story_selection',
      stories: allStories,
      playedStoryIds: [],
      currentStory: null,
      scores: initialScores,
    };
    setGameState(newState);
  }, [allStories, players, setGameState]);

  const startNewStory = useCallback(() => {
    if (!gameState) return;

    const unplayedStories = gameState.stories.filter(
      (story) => !gameState.playedStoryIds.includes(story.id)
    );

    if (unplayedStories.length === 0) {
      setGameState({ ...gameState, gameState: 'all_stories_played' });
      return;
    }

    const randomStory = unplayedStories[Math.floor(Math.random() * unplayedStories.length)];
    
    setGameState({
      ...gameState,
      currentStory: randomStory,
      gameState: 'story_preview',
      playedStoryIds: [...gameState.playedStoryIds, randomStory.id],
    });
  }, [gameState, setGameState]);

  const assignPoint = useCallback((winnerId: number) => {
    if (!gameState) return;

    const newScores = { ...gameState.scores };
    newScores[winnerId] = (newScores[winnerId] || 0) + 1;

    setGameState({
        ...gameState,
        scores: newScores,
        gameState: 'story_selection',
    });
  }, [gameState, setGameState]);

  const setGamePhase = (phase: MidnightMysteryPhase) => {
    if (!gameState) return;
    setGameState({ ...gameState, gameState: phase });
  };

  const resetGame = useCallback(() => {
    sessionStorage.removeItem(MYSTERY_STORAGE_KEY);
    setGameStateInternal(null);
  }, [setGameStateInternal]);

  return {
    gameState,
    initializeGame,
    startNewStory,
    setGamePhase,
    assignPoint,
    resetGame,
  };
};