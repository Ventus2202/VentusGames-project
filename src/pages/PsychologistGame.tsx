import { IonContent, IonPage } from '@ionic/react';
import { usePsychologistGameFlow } from '../hooks/usePsychologistGameFlow';
import SymptomsDisplay from '../components/SymptomsDisplay';
import PsychologistQuestioning from '../components/PsychologistQuestioning';
import PsychologistResults from '../components/PsychologistResults';
import PsychologistFinalResults from './PsychologistFinalResults';
import './PsychologistGame.css';

const PsychologistGame: React.FC = () => {
  const {
    psychologistState,
    showSymptomsPhase,
    totalRounds,
    handleNextRound,
    handleEndGame,
    handleSkipSymptom,
    handleRoundComplete,
    handleSymptomsReady,
  } = usePsychologistGameFlow();

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

  if (psychologistState.gameState === 'game_over') {
    return <PsychologistFinalResults />;
  }

  if (psychologistState.gameState === 'results') {
    const currentRound = psychologistState.rounds[psychologistState.rounds.length - 1];
    const isLastRound = psychologistState.currentRound >= totalRounds;

    return (
      <PsychologistResults
        roundData={currentRound}
        onNextRound={isLastRound ? undefined : handleNextRound}
        onEndGame={handleEndGame}
      />
    );
  }

  if (showSymptomsPhase) {
    const currentRound = psychologistState.rounds[psychologistState.rounds.length - 1];
    const psychologistPlayer = psychologistState.players.find(p => p.id === psychologistState.psychologistId);
    
    if (!currentRound || !psychologistPlayer) return null;

    return (
      <SymptomsDisplay
        symptom={currentRound.symptom}
        psychologistName={psychologistPlayer.name}
        onReady={handleSymptomsReady}
        onSkipSymptom={handleSkipSymptom}
      />
    );
  }

  if (psychologistState.gameState === 'questioning') {
    const currentRound = psychologistState.rounds[psychologistState.rounds.length - 1];
    const psychologistPlayer = psychologistState.players.find(p => p.id === psychologistState.psychologistId);
    
    if (!currentRound || !psychologistPlayer) return null;

    return (
      <PsychologistQuestioning
        symptom={currentRound.symptom}
        psychologistName={psychologistPlayer.name}
        onRoundComplete={handleRoundComplete}
      />
    );
  }

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

