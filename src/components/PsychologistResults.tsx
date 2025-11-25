import { IonContent, IonPage, IonButton, IonCard, IonCardContent } from '@ionic/react';
import { PsychologistRound } from '../types/Psychologist';
import './PsychologistResults.css';

interface PsychologistResultsProps {
  roundData: PsychologistRound;
  onNextRound?: () => void;
  onEndGame: () => void;
}

const PsychologistResults: React.FC<PsychologistResultsProps> = ({
  roundData,
  onNextRound,
  onEndGame,
}) => {
  const psychologistGuessed = roundData.psychologistCorrect === true;

  return (
    <IonPage>
      <IonContent className="psychologist-results-content">
        <div className="results-container">
          {/* Titolo */}
          <div className={`results-header ${psychologistGuessed ? 'correct' : 'wrong'}`}>
            <h1>{psychologistGuessed ? '✓ Indovinato!' : '✗ Sbagliato!'}</h1>
            <p className="result-subtitle">
              {psychologistGuessed ? 'Lo Psicologo ha indovinato il sintomo' : 'I Pazienti vincono il round'}
            </p>
          </div>

          {/* Risposta corretta */}
          <IonCard className="answer-card">
            <IonCardContent>
              <div className="answer-label">Il sintomo era:</div>
              <div className="answer-text">{roundData.symptom}</div>
            </IonCardContent>
          </IonCard>


          {/* Punteggi */}
          <div className="round-info">
            <div className="info-box">
              <div className="info-label">Round:</div>
              <div className="info-value">{roundData.roundNumber}</div>
            </div>
          </div>

          {/* Bottoni */}
          <div className="buttons-container">
            {onNextRound && (
              <IonButton
                expand="block"
                className="next-button"
                onClick={onNextRound}
              >
                Prossimo Round
              </IonButton>
            )}
            <IonButton
              expand="block"
              className="end-button"
              onClick={onEndGame}
            >
              {onNextRound ? 'Termina Gioco' : 'Vedi Risultati'}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PsychologistResults;
