import { useState, useEffect } from 'react';
import psychologistQuestions from '../game_data/psychologist_questions.json';

const usePsychologistQuestions = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setQuestions(psychologistQuestions);
    } catch (error) {
      console.error('Error loading psychologist questions:', error);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { questions, isLoading };
};

export default usePsychologistQuestions;
