import { useState, useEffect } from 'react';
import questionsData from '../game_data/social_ladder_questions.json';

const useSocialLadderQuestions = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Importa il JSON direttamente
      setQuestions(questionsData.questions);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { questions, loading, error };
};

export default useSocialLadderQuestions;
