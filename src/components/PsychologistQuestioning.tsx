import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonCard, IonCardContent } from '@ionic/react';
import { checkmarkCircle, closeCircle, time, add, remove } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import './PsychologistQuestioning.css';

interface PsychologistQuestioningProps {
  symptom: string;
  psychologistName: string;
  onRoundComplete: (isCorrect: boolean) => void;
}

const PsychologistQuestioning: React.FC<PsychologistQuestioningProps> = ({
  symptom,
  psychologistName,
  onRoundComplete,
}) => {
  // 300 secondi = 5 minuti di default
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const adjustTime = (amount: number) => {
    setTimeLeft(prev => Math.max(0, prev + amount));
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inchiesta in corso...</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="psychologist-questioning-content">
        <div className="questioning-container">

          {/* Istruzioni */}
          <div className="instructions-box">
            <h2>Lo Psicologo sta indagando</h2>
            <p>Rispondete alle domande di <strong>{psychologistName}</strong> manifestando il sintomo.</p>
          </div>

          {/* Card Promemoria Sintomo */}
          <IonCard className="symptom-reminder-card">
             <IonCardContent>
               <div className="symptom-label">Il vostro sintomo:</div>
               <div className="symptom-text">{symptom}</div>
             </IonCardContent>
          </IonCard>

          {/* Timer Section */}
            <div className={`timer-box ${timeLeft <= 60 ? 'urgent' : ''} ${timeLeft === 0 ? 'finished' : ''}`}>
              <div className="timer-display" onClick={toggleTimer}>
                <IonIcon icon={time} className="timer-icon" />
                <span className="time-value">{formatTime(timeLeft)}</span>
              </div>
              <div className="timer-controls">
                <button className="timer-adj-btn" onClick={() => adjustTime(-30)}>
                  <IonIcon icon={remove} /> 30s
                </button>
                <button className="timer-adj-btn" onClick={() => adjustTime(30)}>
                  <IonIcon icon={add} /> 30s
                </button>
              </div>
            </div>
            
          <div className="actions-section">
            <p className="judge-label">Lo Psicologo ha capito?</p>
            
            <div className="decision-buttons">
              <IonButton
                expand="block"
                color="success"
                className="outcome-button correct"
                onClick={() => onRoundComplete(true)}
              >
                <IonIcon icon={checkmarkCircle} slot="start" />
                Sì, ha indovinato!
              </IonButton>

              <IonButton
                expand="block"
                color="danger"
                className="outcome-button wrong"
                onClick={() => onRoundComplete(false)}
              >
                <IonIcon icon={closeCircle} slot="start" />
                No, tempo scaduto / Resa
              </IonButton>
            </div>
            <p className="hint-text">Premete solo quando il round è concluso.</p>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default PsychologistQuestioning;
