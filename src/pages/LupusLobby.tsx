import React from 'react';
import { IonContent, IonPage, IonButton, IonHeader, IonToolbar, IonTitle, IonIcon, IonList, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { arrowBack, arrowForward } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { usePlayers } from '../hooks/usePlayers';
import RulesCard from '../components/RulesCard';
import '../styles/LobbyCommon.css';

const LupusLobby: React.FC = () => {
  const history = useHistory();
  const { players } = usePlayers();
  const validPlayers = players.filter(p => p.name.trim() !== '');
  
  const playerCount = validPlayers.length;

  const handleNext = () => {
    history.push('/lupus-config');
  };

  const handleBack = () => {
    history.push('/games');
  };

  const lupusRules = [
    "Ogni giocatore riceve un ruolo segreto (Civile, Lupo, Veggente, Guardia).",
    "I Lupi eliminano i Civili di notte.",
    "Il Veggente scopre i ruoli, la Guardia protegge.",
    "Di giorno si discute e si vota per eliminare i sospetti Lupi.",
    "I Civili vincono eliminando i Lupi, i Lupi vincono pareggiando i Civili."
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={handleBack}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Lupus in Fabula</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="lobby-content">
        <div className="lobby-container">
          <div className="lobby-header">
            <h1>Lupus in Fabula</h1>
            <p>Smaschera i Lupi o inganna il villaggio!</p>
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

          <RulesCard rules={lupusRules} />

          <div className="button-container">
            <IonButton
              expand="block"
              className="start-game-button"
              onClick={handleNext}
              disabled={playerCount < 5}
            >
              Avanti
              <IonIcon icon={arrowForward} slot="end" />
            </IonButton>
            {playerCount < 5 && (
              <p className="warning-text">Servono almeno 5 giocatori per giocare</p>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LupusLobby;
