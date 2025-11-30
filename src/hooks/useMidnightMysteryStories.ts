import { useState, useEffect } from 'react';
import storiesData from '../game_data/midnight_mystery_stories.json';

interface Story {
  id: string;
  title: string;
  preview: string;
  solution: string;
}

export const useMidnightMysteryStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this might be an API call.
    // Here, we're just loading a local JSON.
    setStories(storiesData);
    setIsLoading(false);
  }, []);

  return { stories, isLoading };
};

export default useMidnightMysteryStories;
