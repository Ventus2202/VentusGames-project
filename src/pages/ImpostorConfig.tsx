import { IonContent, IonPage, IonButton, IonHeader, IonToolbar, IonTitle, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { usePlayers } from '../hooks/usePlayers';
import { useState, useEffect } from 'react';
import './ImpostorConfig.css';
import '../styles/LobbyCommon.css';

const ImpostorConfig: React.FC = () => {
  const history = useHistory();
  const { players } = usePlayers();
  const validPlayers = players.filter(p => p.name.trim() !== '');
  const playerCount = validPlayers.length;

  const [impostorCount, setImpostorCount] = useState(1);
  const [spyCount, setSpyCount] = useState(1);

  // Adjust counts based on player number
  useEffect(() => {
    if (playerCount < 4) {
      setImpostorCount(1);
      setSpyCount(0);
    } else if (playerCount < 6) {
      setImpostorCount(1);
      setSpyCount(1);
    } else {
      setImpostorCount(1);
      setSpyCount(2);
    }
  }, [playerCount]);
  
  const handleStartGame = () => {
    history.push({
      pathname: '/impostor-game',
      state: { impostorCount, spyCount }
    });
  };

  const handleBack = () => {
    history.push('/impostor-lobby');
  };

  const handleImpostorChange = (delta: number) => {
    const newCount = impostorCount + delta;
    if (newCount >= 1 && newCount + spyCount < playerCount) {
      setImpostorCount(newCount);
    }
  };

  const handleSpyChange = (delta: number) => {
    const newCount = spyCount + delta;
    if (newCount >= 0 && impostorCount + newCount < playerCount) {
      setSpyCount(newCount);
    }
  };
  
  const civilianCount = playerCount - impostorCount - spyCount;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={handleBack}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Configura Ruoli</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="lobby-content">
        <div className="lobby-container">
          <div className="lobby-header">
            <h1>Impostor</h1>
            <p>Imposta il numero di Impostori e Spie per questa partita.</p>
          </div>

          {/* Role Configuration */}
          <IonCard className="players-card">
            <IonCardHeader>
              <IonCardTitle>Ruoli per {playerCount} Giocatori</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="role-selector">
                <div className="role-label">{impostorCount === 1 ? 'Impostore' : 'Impostori'}</div>
                <div className="role-stepper">
                  <button onClick={() => handleImpostorChange(-1)} disabled={impostorCount <= 1}>-</button>
                  <span>{impostorCount}</span>
                  <button onClick={() => handleImpostorChange(1)} disabled={impostorCount + spyCount >= playerCount - 1}>+</button>
                </div>
              </div>
              <div className="role-selector">
                <div className="role-label">{spyCount === 1 ? 'Spia' : 'Spie'}</div>
                <div className="role-stepper">
                  <button onClick={() => handleSpyChange(-1)} disabled={spyCount <= 0}>-</button>
                  <span>{spyCount}</span>
                  <button onClick={() => handleSpyChange(1)} disabled={impostorCount + spyCount >= playerCount - 1}>+</button>
                </div>
              </div>
              <div className="role-summary">
                <span>{civilianCount === 1 ? 'Civile' : 'Civili'}: {civilianCount}</span>
              </div>
            </IonCardContent>
          </IonCard>

          <div className="button-container">
            <IonButton
              expand="block"
              className="start-game-button"
              onClick={handleStartGame}
            >
              Conferma e Inizia
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ImpostorConfig;
