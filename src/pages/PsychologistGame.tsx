import { IonContent, IonPage } from '@ionic/react';
import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { usePlayers } from '../hooks/usePlayers';
import { usePsychologistGame } from '../hooks/usePsychologistGame';
import usePsychologistQuestions from '../hooks/usePsychologistQuestions';
import SymptomsDisplay from '../components/SymptomsDisplay';
import PsychologistQuestioning from '../components/PsychologistQuestioning';
import PsychologistResults from '../components/PsychologistResults';
import PsychologistFinalResults from './PsychologistFinalResults';
import './PsychologistGame.css';

const PsychologistGame: React.FC = () => {
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

  // Inizializza il gioco al mount se non esiste uno stato
  useEffect(() => {
    if (!psychologistState && questions.length > 0 && !initRef.current) {
      initRef.current = true;
      const randomSymptom = questions[Math.floor(Math.random() * questions.length)];
      initializePsychologistGame(randomSymptom);
    }
  }, [psychologistState, questions, initializePsychologistGame]);

  // Reset stato quando inizia un nuovo round
  useEffect(() => {
    if (psychologistState?.gameState === 'symptom_display') {
      setShowSymptomsPhase(true);
    } else {
      setShowSymptomsPhase(false);
    }
  }, [psychologistState?.gameState, psychologistState?.currentRound]);

  // Redirect alla lobby se non c'è stato
  useEffect(() => {
    if (!psychologistState && questions.length > 0) {
      const timeout = setTimeout(() => {
        history.push('/psychologist-lobby');
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [psychologistState, questions, history]);

  if (!psychologistState) {
    return (
      <IonPage>
        <IonContent className="loading-content">
          <div className="loading-container">
            <p>Caricamento del gioco...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // Fase: Fine gioco
  if (psychologistState.gameState === 'game_over') {
    return <PsychologistFinalResults />;
  }

  // Fase: Risultati del round
  if (psychologistState.gameState === 'results') {
    const currentRound = psychologistState.rounds[psychologistState.rounds.length - 1];
    const isLastRound = psychologistState.currentRound >= totalRounds;

    const handleNextRound = () => {
      if (questions.length > 0) {
        const randomSymptom = questions[Math.floor(Math.random() * questions.length)];
        startNextPsychologistRound(randomSymptom);
      }
    };

    const handleEndGame = () => {
      endPsychologistGame();
    };

    return (
      <PsychologistResults
        roundData={currentRound}
        onNextRound={isLastRound ? undefined : handleNextRound}
        onEndGame={handleEndGame}
      />
    );
  }
  
  const handleSkipSymptom = () => {
    if (questions.length > 0) {
      skipSymptom(questions);
    }
  };

  // Fase: Mostra sintomo ai pazienti (psicologo è fuori)
  if (showSymptomsPhase) {
    const currentRound = psychologistState.rounds[psychologistState.rounds.length - 1];
    const psychologistPlayer = psychologistState.players.find(p => p.id === psychologistState.psychologistId);
    
    if (!currentRound || !psychologistPlayer) return null;

    return (
      <SymptomsDisplay
        symptom={currentRound.symptom}
        psychologistName={psychologistPlayer.name}
        onReady={() => {
          setShowSymptomsPhase(false);
          startPsychologistQuestioning();
        }}
        onSkipSymptom={handleSkipSymptom}
      />
    );
  }

  // Fase: Psicologo fa domande (Ora: Pazienti giudicano)
  if (psychologistState.gameState === 'questioning') {
    const currentRound = psychologistState.rounds[psychologistState.rounds.length - 1];
    const psychologistPlayer = psychologistState.players.find(p => p.id === psychologistState.psychologistId);
    
    if (!currentRound || !psychologistPlayer) return null;

    return (
      <PsychologistQuestioning
        symptom={currentRound.symptom}
        psychologistName={psychologistPlayer.name}
        // Modifica qui: passiamo direttamente il booleano a completePsychologistRound
        onRoundComplete={(isCorrect) => {
          completePsychologistRound(isCorrect);
        }}
      />
    );
  }
  
  // ... (resto del file)

  // Fallback
  return (
    <IonPage>
      <IonContent className="loading-content">
        <div className="loading-container">
          <p>Preparazione...</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PsychologistGame;
