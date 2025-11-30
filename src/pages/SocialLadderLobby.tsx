import { IonContent, IonPage, IonButton, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { usePlayers } from '../hooks/usePlayers';
import './SocialLadderLobby.css';
import '../styles/LobbyCommon.css';

import RulesCard from '../components/RulesCard';

const SocialLadderLobby: React.FC = () => {
  const history = useHistory();
  const { players } = usePlayers();
  const validPlayers = players.filter(p => p.name.trim() !== '');

  const handleStartGame = () => {
    history.push('/social-ladder-game');
  };

  const handleBack = () => {
    history.push('/');
  };

  const socialLadderRules = [
    "Vi verrà posta una domanda",
    "Ognuno posiziona se stesso nella classifica",
    "Il Master crea la classifica ufficiale",
    "Chi indovina la posizione guadagna Ventus Points",
    "Il gioco continua con il prossimo Master"
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={handleBack}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Social Ladder</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="lobby-content">
        <div className="lobby-container">
          {/* Titolo */}
          <div className="lobby-header">
            <h1>Benvenuti a Social Ladder!</h1>
            <p>Preparati a scoprire come i tuoi amici ti vedono</p>
          </div>

          {/* Card con info giocatori */}
          <IonCard className="players-card">
            <IonCardHeader>
              <IonCardTitle>Giocatori ({validPlayers.length})</IonCardTitle>
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

          {/* Regole */}
          <RulesCard rules={socialLadderRules} />

          {/* Bottone start */}
          <div className="button-container">
            <IonButton
              expand="block"
              className="start-game-button"
              onClick={handleStartGame}
              disabled={validPlayers.length < 3}
            >
              Inizia il Gioco
            </IonButton>
            {validPlayers.length < 3 && (
              <p className="warning-text">Servono almeno 3 giocatori per giocare</p>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SocialLadderLobby;
