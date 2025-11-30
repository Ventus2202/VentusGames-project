import { useState, useEffect } from 'react';
import psychologistQuestions from '../game_data/psychologist_questions.json';
import { useError } from './useError';

const usePsychologistQuestions = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setError } = useError();

  useEffect(() => {
    try {
      setQuestions(psychologistQuestions);
    } catch (error) {
      setError('Errore durante il caricamento delle domande dello psicologo.');
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [setError]);

  return { questions, isLoading };
};

export default usePsychologistQuestions;
