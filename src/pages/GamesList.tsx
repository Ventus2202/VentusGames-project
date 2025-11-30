import { IonContent, IonPage, IonButton, IonHeader, IonToolbar, IonTitle, IonIcon } from '@ionic/react';
import { arrowBack, people } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { usePlayers } from '../hooks/usePlayers';
import socialLadderBanner from '../assets/game_banners/social_ladder.png';
import psychologistBanner from '../assets/game_banners/psychologist.png';
import impostorBanner from '../assets/game_banners/impostor.png';
import midnightMysteryBanner from '../assets/game_banners/midnight_mystery.png';
import './GamesList.css';

interface Game {
  id: string;
  name: string;
  description: string;
  banner: string;
  route: string;
  minPlayers: number;
  maxPlayers: number;
}

const GamesList: React.FC = () => {
  const history = useHistory();
  const { players } = usePlayers();
  const validPlayers = players.filter(p => p.name.trim() !== '').length;

  const games: Game[] = [
    {
      id: 'social_ladder',
      name: 'Social Ladder',
      description: 'Scopri come i tuoi amici ti vedono',
      banner: socialLadderBanner,
      route: '/social-ladder-lobby',
      minPlayers: 3,
      maxPlayers: 20,
    },
    {
      id: 'psychologist',
      name: 'Psychologist',
      description: 'Indovina il sintomo manifestato dai pazienti',
      banner: psychologistBanner,
      route: '/psychologist-lobby',
      minPlayers: 3,
      maxPlayers: 20,
    },
    {
      id: 'impostor',
      name: 'Impostor',
      description: 'Scopri chi è l\'Impostore, o inganna tutti!',
      banner: impostorBanner,
      route: '/impostor-lobby',
      minPlayers: 4,
      maxPlayers: 20,
    },
    {
      id: 'midnight_mystery',
      name: 'Midnight Mystery',
      description: 'Risolvi enigmi intricati con solo "Sì" o "No".',
      banner: midnightMysteryBanner,
      route: '/midnight-mystery-lobby',
      minPlayers: 2,
      maxPlayers: 20,
    },
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
            {games.map(game => {
              const isCompatible = validPlayers >= game.minPlayers && validPlayers <= game.maxPlayers;
              return (
                <div 
                  key={game.id} 
                  className={`game-card ${!isCompatible ? 'disabled' : ''}`} 
                  onClick={() => handleGameSelect(game)}
                >
                  <div className="game-banner">
                    <img src={game.banner} alt={game.name} />
                    <div className="players-badge">
                      <IonIcon icon={people} />
                      <span>{game.minPlayers}+</span>
                    </div>
                    <div className="game-overlay">
                      <IonButton className="play-button">Gioca</IonButton>
                    </div>
                  </div>
                  <div className="game-info">
                    <h2>{game.name}</h2>
                    <p>{game.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GamesList;
