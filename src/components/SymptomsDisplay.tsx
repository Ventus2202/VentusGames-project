import { IonContent, IonPage, IonButton } from '@ionic/react';
import { useState } from 'react';
import './SymptomsDisplay.css';

interface SymptomsDisplayProps {
  symptom: string;
  psychologistName: string;
  onReady: () => void;
  onSkipSymptom: () => void;
}

const SymptomsDisplay: React.FC<SymptomsDisplayProps> = ({
  symptom,
  psychologistName,
  onReady,
  onSkipSymptom,
}) => {
  const [isReady, setIsReady] = useState(false);

  const handleReady = () => {
    setIsReady(true);
    setTimeout(() => {
      onReady();
    }, 1500);
  };

  return (
    <IonPage>
      <IonContent className="symptoms-display-content">
        <div className="symptoms-container">
          <div className="psychologist-away-notice">
            <h2>{psychologistName} è fuori dalla stanza!</h2>
            <p>Organizzatevi e memorizzate il sintomo</p>
          </div>

          <div className="symptom-card">
            <div className="symptom-label">Il vostro sintomo:</div>
            <div className="symptom-text">{symptom}</div>
            <div className="symptom-instruction">
              Ricorda: quando lo Psicologo vi farà domande, dovete manifestare QUESTO sintomo
            </div>
          </div>

          <div className="instructions">
            <div className="instruction-box">
              <h3>Cosa fare:</h3>
              <ul>
                <li>Organizzatevi per manifestare il sintomo nelle vostre risposte</li>
                <li>Ogni giocatore risponderà con il suo comportamento legato al sintomo</li>
                <li>Lo Psicologo deve indovinare quale sia il sintomo</li>
              </ul>
            </div>
          </div>

          <div className="ready-section">
            {!isReady ? (
              <>
                <IonButton
                  expand="block"
                  className="ready-button"
                  onClick={handleReady}
                >
                  Pronti! Fai rientrare lo Psicologo
                </IonButton>
                <IonButton
                  expand="block"
                  fill="outline"
                  className="skip-button"
                  onClick={onSkipSymptom}
                >
                  Cambia Sintomo
                </IonButton>
              </>
            ) : (
              <div className="readiness-message">
                <p className="success-text">✓ Lo Psicologo sta rientrando...</p>
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SymptomsDisplay;
