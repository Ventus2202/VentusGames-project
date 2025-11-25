import { useState, useEffect } from 'react';
import impostorWords from '../game_data/impostor_words.json';

interface WordPair {
  civilian: string;
  spy: string;
}

const useImpostorWords = () => {
  const [words, setWords] = useState<WordPair[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setWords(impostorWords);
    } catch (error) {
      console.error('Error loading impostor words:', error);
      setWords([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { words, isLoading };
};

export default useImpostorWords;
