import { IonContent, IonPage, IonButton, IonHeader, IonToolbar, IonTitle, IonIcon, IonList, IonItem, IonLabel, IonSpinner, IonCard, IonCardContent } from '@ionic/react';
import { arrowBack, checkmark } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePlayers } from '../hooks/usePlayers';
import useMidnightMysteryStories from '../hooks/useMidnightMysteryStories';
import { useMidnightMysteryGame } from '../hooks/useMidnightMysteryGame';
import './MidnightMysteryGame.css';

const MidnightMysteryGame: React.FC = () => {
  const history = useHistory();
  const { players } = usePlayers();
  const { stories, isLoading } = useMidnightMysteryStories();
  const { gameState, initializeGame, startNewStory, setGamePhase, assignPoint, resetGame } = useMidnightMysteryGame(players, stories);

  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<number | null>(null);

  useEffect(() => {
    if (!gameState && !isLoading) {
      initializeGame();
    }
  }, [gameState, isLoading, initializeGame]);

  const handleEndGame = () => {
    resetGame();
    history.push('/games');
  };

  if (!gameState || isLoading) {
    return (
      <IonPage>
        <IonContent>
          <IonSpinner name="bubbles" />
        </IonContent>
      </IonPage>
    );
  }

  // Phase 1: Ready to start a new story
  if (gameState.gameState === 'story_selection') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton fill="clear" slot="start" onClick={handleEndGame}>
              <IonIcon icon={arrowBack} />
            </IonButton>
            <IonTitle>Midnight Mystery</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="mystery-game-content">
          <div className="story-selection-container">
            <h1>Pronti per un nuovo mistero?</h1>
            <p>Il Master può pescare una nuova storia.</p>
            <IonButton onClick={startNewStory} size="large">
              Pesca una Storia
            </IonButton>
            

          </div>
        </IonContent>
      </IonPage>
    );
  }
  
  // Phase 2: Show the mystery preview and flippable solution
  if (gameState.gameState === 'story_preview' && gameState.currentStory) {
    const { title, preview, solution } = gameState.currentStory;
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton fill="clear" slot="start" onClick={() => setGamePhase('story_selection')}>
              <IonIcon icon={arrowBack} />
            </IonButton>
            <IonTitle>{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="mystery-game-content">
          <div className="mystery-container">
            <p className="master-instruction">Leggi l'anteprima ad alta voce. Gira la carta per leggere la soluzione solo per te.</p>
            
            <div className={`flip-card ${isFlipped ? 'is-flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h2>{title}</h2>
                  <p>{preview}</p>
                </div>
                <div className="flip-card-back">
                  <h3>Soluzione</h3>
                  <p>{solution}</p>
                  <small className="master-reminder">Ricorda: puoi rispondere solo "Sì", "No", o "Irrilevante".</small>
                </div>
              </div>
            </div>

            <IonButton onClick={() => setGamePhase('winner_selection')}>
              Qualcuno ha risolto il mistero?
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // Phase 3: Select the winner
  if (gameState.gameState === 'winner_selection') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButton fill="clear" slot="start" onClick={() => setGamePhase('story_preview')}>
              <IonIcon icon={arrowBack} />
            </IonButton>
            <IonTitle>Chi ha indovinato?</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="mystery-game-content">
          <div className="winner-selection-container">
            <IonList>
              {players.map(player => (
                <IonItem 
                  key={player.id} 
                  button 
                  onClick={() => setSelectedWinner(player.id)}
                  color={selectedWinner === player.id ? 'primary' : ''}
                >
                  <IonLabel>{player.name}</IonLabel>
                </IonItem>
              ))}
            </IonList>
            <IonButton 
              disabled={!selectedWinner}
              onClick={() => {
                if (selectedWinner) {
                  assignPoint(selectedWinner);
                }
                setIsFlipped(false);
                setSelectedWinner(null);
              }}
            >
              <IonIcon icon={checkmark} slot="start" />
              Assegna Punto e Continua
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // Phase 4: All stories have been played
  if (gameState.gameState === 'all_stories_played') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Fine del Gioco</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="mystery-game-content">
          <div className="story-selection-container">
            <h1>Avete risolto tutti i misteri!</h1>
            <p>Grazie per aver giocato.</p>
            
            <IonCard className="scores-card">
              <IonCardContent>
                <h3>Punteggio Finale</h3>
                <IonList lines="none">
                  {players.map(player => (
                    <IonItem key={player.id}>
                      <IonLabel>{player.name}</IonLabel>
                      <div slot="end" className="player-score">{gameState.scores[player.id] || 0}</div>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>

            <IonButton onClick={handleEndGame}>
              Torna al Menu Principale
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return null; // Fallback
};
export default MidnightMysteryGame;
