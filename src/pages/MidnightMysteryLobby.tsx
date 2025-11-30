import { IonContent, IonPage, IonButton, IonHeader, IonToolbar, IonTitle, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import RulesCard from '../components/RulesCard';
import '../styles/LobbyCommon.css';

const MidnightMysteryLobby: React.FC = () => {
  const history = useHistory();

  const handleStartGame = () => {
    history.push('/midnight-mystery-game');
  };

  const handleBack = () => {
    history.push('/games');
  };

  const mysteryRules = [
    "Un giocatore (il Master) tiene il telefono e legge l'anteprima della storia a tutti.",
    "Il Master è l'unico che può leggere la soluzione completa della storia.",
    "Gli altri giocatori devono indovinare la storia facendo domande al Master.",
    "Il Master può rispondere solo 'Sì', 'No', o 'Irrilevante'.",
    "Quando un giocatore indovina, il Master lo seleziona per assegnargli il punto."
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={handleBack}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Midnight Mystery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="lobby-content">
        <div className="lobby-container">
          <div className="lobby-header">
            <h1>Benvenuti a Midnight Mystery!</h1>
            <p>Risolvete l'enigma, una domanda alla volta.</p>
          </div>

          <RulesCard rules={mysteryRules} />

          <div className="button-container">
            <IonButton
              expand="block"
              className="start-game-button"
              onClick={handleStartGame}
            >
              Inizia il Gioco
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MidnightMysteryLobby;
