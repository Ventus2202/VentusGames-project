import { IonContent, IonPage, IonButton } from '@ionic/react';
import { useState, useEffect } from 'react';
import './ReadyScreen.css';

interface ReadyScreenProps {
  playerName: string;
  isMaster?: boolean;
  onReady: () => void;
}

const ReadyScreen: React.FC<ReadyScreenProps> = ({ playerName, isMaster = false, onReady }) => {
  const [countdown, setCountdown] = useState(3);
  const [autoStart, setAutoStart] = useState(false);

  useEffect(() => {
    if (!autoStart) return;

    if (countdown <= 0) {
      onReady();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, autoStart, onReady]);

  const handleReady = () => {
    setAutoStart(true);
  };

  return (
    <IonPage>
      <IonContent className="ready-screen-content">
        <div className="ready-container">
          {/* Header */}
          <div className="ready-header">
            <h1>Pronto?</h1>
            <p className="ready-subtitle">
              {isMaster ? `👑 ${playerName} - Sei il Master` : `Giocatore: ${playerName}`}
            </p>
          </div>

          {/* Contenuto principale */}
          <div className="ready-main">
            {!autoStart ? (
              <>
                <div className="ready-emoji">🎮</div>
                <p className="ready-text">Preparati a ordinare i giocatori</p>
                <IonButton
                  expand="block"
                  className="ready-button"
                  onClick={handleReady}
                >
                  Sono Pronto!
                </IonButton>
              </>
            ) : (
              <>
                <div className={`countdown-circle ${countdown <= 1 ? 'last' : ''}`}>
                  <span className="countdown-number">{countdown > 0 ? countdown : '✓'}</span>
                </div>
                <p className="countdown-text">
                  {countdown > 0 ? 'Iniziamo tra...' : 'Andiamo!'}
                </p>
              </>
            )}
          </div>

          {/* Footer info */}
          <div className="ready-footer">
            <p className="footer-hint">
              {isMaster
                ? 'Ordinerai tutti i giocatori secondo la tua opinione'
                : 'Posizionati dove credi di stare nella classifica'}
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ReadyScreen;
