import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { usePlayers } from '../hooks/usePlayers';
import { usePsychologistGame } from '../hooks/usePsychologistGame';
import usePsychologistQuestions from '../hooks/usePsychologistQuestions';


export const usePsychologistGameFlow = () => {
  const { players, totalRounds } = usePlayers();
  const { 
    psychologistState, 
    initializePsychologistGame, 
    completePsychologistRound, 
    startNextPsychologistRound, 
    endPsychologistGame, 
    startPsychologistQuestioning,
    skipSymptom
  } = usePsychologistGame(players);
  const { questions } = usePsychologistQuestions();
  const history = useHistory();
  
  const [showSymptomsPhase, setShowSymptomsPhase] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (!psychologistState && questions.length > 0 && !initRef.current) {
      initRef.current = true;
      const randomSymptom = questions[Math.floor(Math.random() * questions.length)];
      initializePsychologistGame(randomSymptom);
    }
  }, [psychologistState, questions, initializePsychologistGame]);

  useEffect(() => {
    if (psychologistState?.gameState === 'symptom_display') {
      setShowSymptomsPhase(true);
    } else {
      setShowSymptomsPhase(false);
    }
  }, [psychologistState?.gameState, psychologistState?.currentRound]);

  useEffect(() => {
    if (!psychologistState && questions.length > 0) {
      const timeout = setTimeout(() => {
        history.push('/psychologist-lobby');
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [psychologistState, questions, history]);

  const handleNextRound = () => {
    if (questions.length > 0) {
      const randomSymptom = questions[Math.floor(Math.random() * questions.length)];
      startNextPsychologistRound(randomSymptom);
    }
  };

  const handleEndGame = () => {
    endPsychologistGame();
  };

  const handleSkipSymptom = () => {
    if (questions.length > 0) {
      skipSymptom(questions);
    }
  };

  const handleRoundComplete = (isCorrect: boolean) => {
    completePsychologistRound(isCorrect);
  };

  const handleSymptomsReady = () => {
    setShowSymptomsPhase(false);
    startPsychologistQuestioning();
  };

  return {
    psychologistState,
    showSymptomsPhase,
    totalRounds,
    handleNextRound,
    handleEndGame,
    handleSkipSymptom,
    handleRoundComplete,
    handleSymptomsReady,
  };
};
