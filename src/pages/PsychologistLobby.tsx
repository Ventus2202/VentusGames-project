import { IonContent, IonPage, IonButton, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { usePlayers } from '../hooks/usePlayers';
import './PsychologistLobby.css';
import '../styles/LobbyCommon.css';

import RulesCard from '../components/RulesCard';

const PsychologistLobby: React.FC = () => {
  const history = useHistory();
  const { players } = usePlayers();
  const validPlayers = players.filter(p => p.name.trim() !== '');

  const handleStartGame = () => {
    history.push('/psychologist-game');
  };

  const handleBack = () => {
    history.push('/');
  };

  const psychologistRules = [
    "Uno dei giocatori diventa lo Psicologo e non guarda il telefono",
    "Gli altri (Pazienti) leggono il sintomo da manifestare",
    "Lo Psicologo rientra e fa domande a voce per indovinare",
    "I Pazienti segnano sull'app se lo Psicologo ha indovinato",
    "Se indovina guadagna 1 punto, altrimenti il punto va ai Pazienti"
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={handleBack}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Psychologist</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="lobby-content">
        <div className="lobby-container">
          {/* Titolo */}
          <div className="lobby-header">
            <h1>Benvenuti a Psychologist!</h1>
            <p>Indovinate il sintomo che state manifestando</p>
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
          <RulesCard rules={psychologistRules} />

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

export default PsychologistLobby;
