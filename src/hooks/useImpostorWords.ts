import { useState, useEffect } from 'react';
import impostorWords from '../game_data/impostor_words.json';
import { useError } from './useError';

interface WordPair {
  civilian: string;
  spy: string;
}

const useImpostorWords = () => {
  const [words, setWords] = useState<WordPair[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setError } = useError();

  useEffect(() => {
    try {
      setWords(impostorWords);
    } catch (error) {
      setError('Errore durante il caricamento delle parole Impostor.');
      setWords([]);
    } finally {
      setIsLoading(false);
    }
  }, [setError]);

  return { words, isLoading };
};

export default useImpostorWords;
