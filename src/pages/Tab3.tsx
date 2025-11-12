import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonList, IonItem, IonLabel, IonToggle } from '@ionic/react';
import { useState } from 'react';
import { useGame } from '../context/GameContext';
import './Tab3.css';

const Tab3: React.FC = () => {
  const { resetGame, resetSocialLadderState } = useGame();
  const [totalRounds, setTotalRounds] = useState(5);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleResetAll = () => {
    if (confirmReset) {
      resetGame();
      resetSocialLadderState();
      setConfirmReset(false);
      alert('✓ Dati azzerati completamente!');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>⚙️ Impostazioni</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="settings-content" fullscreen>
        <div className="settings-container">
          {/* Header */}
          <div className="settings-header">
            <h1>Impostazioni</h1>
            <p>Personalizza l'esperienza di gioco</p>
          </div>

          {/* Impostazioni di Gioco */}
          <IonCard className="settings-card">
            <IonCardHeader>
              <IonCardTitle>🎮 Impostazioni di Gioco</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel>
                    <div className="setting-label">
                      <span className="label-name">Round per Partita</span>
                      <span className="label-hint">Numero di turni in una partita</span>
                    </div>
                  </IonLabel>
                  <IonLabel slot="end" className="setting-value">{totalRounds}</IonLabel>
                </IonItem>
              </IonList>
              <p className="setting-hint">Attualmente: ogni partita dura {totalRounds} round</p>
            </IonCardContent>
          </IonCard>

          {/* Informazioni App */}
          <IonCard className="settings-card">
            <IonCardHeader>
              <IonCardTitle>ℹ️ Informazioni</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="info-row">
                <span className="info-label">App Name</span>
                <span className="info-value">Ventus Games</span>
              </div>
              <div className="info-row">
                <span className="info-label">Versione</span>
                <span className="info-value">1.0.0</span>
              </div>
              <div className="info-row">
                <span className="info-label">Gioco Principale</span>
                <span className="info-value">Social Ladder</span>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Dati */}
          <IonCard className="settings-card">
            <IonCardHeader>
              <IonCardTitle>💾 Dati</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p className="data-description">
                Questa sezione ti permette di gestire i dati dell'app.
              </p>
              {!confirmReset ? (
                <IonButton
                  expand="block"
                  color="danger"
                  className="reset-button"
                  onClick={() => setConfirmReset(true)}
                >
                  🗑️ Cancella Tutti i Dati
                </IonButton>
              ) : (
                <div className="confirmation-section">
                  <p className="confirmation-text">
                    ⚠️ Sei sicuro? Questa azione eliminerà tutti i dati e non può essere annullata.
                  </p>
                  <div className="confirmation-buttons">
                    <IonButton
                      expand="block"
                      color="danger"
                      onClick={handleResetAll}
                    >
                      ✓ Sì, Cancella Tutto
                    </IonButton>
                    <IonButton
                      expand="block"
                      fill="outline"
                      onClick={() => setConfirmReset(false)}
                    >
                      ✕ Annulla
                    </IonButton>
                  </div>
                </div>
              )}
            </IonCardContent>
          </IonCard>

          {/* Crediti */}
          <IonCard className="settings-card credits-card">
            <IonCardHeader>
              <IonCardTitle>👨‍💻 Crediti</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p className="credits-text">
                <strong>Ventus Games</strong> è un'applicazione di gioco per party.
              </p>
              <p className="credits-text">
                Creato con ❤️ per divertirsi con gli amici.
              </p>
              <p className="credits-tech">
                Sviluppato con React, Ionic e TypeScript.
              </p>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
