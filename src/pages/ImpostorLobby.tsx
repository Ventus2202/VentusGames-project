import { IonContent, IonPage, IonButton, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { usePlayers } from '../hooks/usePlayers';
import './ImpostorLobby.css';
import '../styles/LobbyCommon.css';

import RulesCard from '../components/RulesCard';

const ImpostorLobby: React.FC = () => {
  const history = useHistory();
  const { players } = usePlayers();
  const validPlayers = players.filter(p => p.name.trim() !== '');
  const playerCount = validPlayers.length;

  const handleStartGame = () => {
    history.push('/impostor-config');
  };

  const handleBack = () => {
    history.push('/games');
  };

  const impostorRules = [
    "I Civili ricevono la stessa parola.",
    "Le Spie ricevono una parola simile.",
    "Gli Impostori non ricevono nessuna parola.",
    "A turno, ognuno dice una parola per descrivere la propria.",
    "Discutete e votate per eliminare un sospettato."
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={handleBack}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Impostor</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="lobby-content">
        <div className="lobby-container">
          <div className="lobby-header">
            <h1>Benvenuti a Impostor!</h1>
            <p>Scopri chi è l'Impostore, o inganna tutti!</p>
          </div>

          <IonCard className="players-card">
            <IonCardHeader>
              <IonCardTitle>Giocatori ({playerCount})</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                {validPlayers.map((player, index) => (
                  <IonItem key={player.id}>
                    <IonLabel>
                      <div className="player-item">
                        <span className="player-badge">{index + 1}</span>
                        <span className="player-name">{player.name}</span>
                      </div>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>

          <RulesCard rules={impostorRules} />

          <div className="button-container">
            <IonButton
              expand="block"
              className="start-game-button"
              onClick={handleStartGame}
              disabled={playerCount < 4}
            >
              Inizia il Gioco
            </IonButton>
            {playerCount < 4 && (
              <p className="warning-text">Servono almeno 4 giocatori per giocare</p>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ImpostorLobby;
