import { IonContent, IonPage, IonButton, IonHeader, IonToolbar, IonTitle, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import socialLadderBanner from '../assets/game_banners/social_ladder.png';
import './GamesList.css';

interface Game {
  id: string;
  name: string;
  description: string;
  banner: string;
  route: string;
}

const GamesList: React.FC = () => {
  const history = useHistory();

  const games: Game[] = [
    {
      id: 'social_ladder',
      name: 'Social Ladder',
      description: 'Scopri come i tuoi amici ti vedono',
      banner: socialLadderBanner,
      route: '/tab1',
    },
    // Aggiungi altri giochi qui in futuro
  ];

  const handleBack = () => {
    history.push('/');
  };

  const handleGameSelect = (game: Game) => {
    history.push(game.route);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={handleBack}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Scegli un Gioco</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="games-list-content">
        <div className="games-container">
          <div className="games-header">
            <h1>Scegli il tuo gioco</h1>
            <p>Divertiti con gli amici</p>
          </div>

          <div className="games-grid">
            {games.map(game => (
              <div key={game.id} className="game-card" onClick={() => handleGameSelect(game)}>
                <div className="game-banner">
                  <img src={game.banner} alt={game.name} />
                  <div className="game-overlay">
                    <IonButton className="play-button">Gioca</IonButton>
                  </div>
                </div>
                <div className="game-info">
                  <h2>{game.name}</h2>
                  <p>{game.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GamesList;
