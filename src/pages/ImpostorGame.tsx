import { IonContent, IonPage, IonSpinner, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonButton, IonIcon, useIonAlert, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { personRemove, checkmarkCircle, closeCircle, skull, person } from 'ionicons/icons';
import { usePlayers } from '../hooks/usePlayers';
import useImpostorWords from '../hooks/useImpostorWords';
import { useImpostorGame } from '../hooks/useImpostorGame';
import RoleReveal from '../components/RoleReveal';
import './ImpostorGame.css';

interface ImpostorLocationState {
  impostorCount: number;
  spyCount: number;
}

const ImpostorGame: React.FC = () => {
  const { players: initialPlayers } = usePlayers();
  const { words, isLoading: wordsLoading } = useImpostorWords();
  const { impostorState, initializeImpostorGame, setPhase, eliminatePlayer, nextRound, resetImpostorGame } = useImpostorGame(initialPlayers, words);

  const [revealIndex, setRevealIndex] = useState(0);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [presentAlert] = useIonAlert();
  const history = useHistory();
  const location = useLocation<ImpostorLocationState | undefined>();

  useEffect(() => {
    // Only initialize a game if we have navigation state from the config screen
    if (!impostorState && location.state && !wordsLoading && words.length > 0 && initialPlayers.length > 0) {
      const { impostorCount, spyCount } = location.state;
      initializeImpostorGame(impostorCount, spyCount);
    }
  }, [impostorState, words, wordsLoading, initializeImpostorGame, initialPlayers, location.state]);

  const handleNextPlayerReveal = () => {
    const nextIndex = revealIndex + 1;
    if (nextIndex >= initialPlayers.length) {
      setPhase('voting');
    } else {
      setRevealIndex(nextIndex);
    }
  };

  const handleElimination = () => {
    if (selectedPlayerId === null) return;

    const playerToEliminate = impostorState?.players.find(p => p.id === selectedPlayerId);
    if (!playerToEliminate) return;

    presentAlert({
      header: 'Conferma Eliminazione',
      message: `Sei sicuro di voler eliminare ${playerToEliminate.name}?`,
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Elimina',
          handler: () => {
            eliminatePlayer(selectedPlayerId);
          },
        },
      ],
    });
  };

  const handlePlayAgain = () => {
    resetImpostorGame();
    history.push('/impostor-lobby');
  };

  const handleBackToMenu = () => {
    resetImpostorGame();
    history.push('/games');
  };

  if (!impostorState) {
    return (
      <IonPage>
        <IonContent className="impostor-game-loading">
          <IonSpinner name="bubbles" />
          <p>Caricamento gioco...</p>
        </IonContent>
      </IonPage>
    );
  }

  // Phase 1: Role Reveal
  if (impostorState.gameState === 'role_reveal') {
    const currentPlayer = impostorState.players[revealIndex];
    return (
      <RoleReveal
        key={currentPlayer.id}
        player={currentPlayer}
        onNext={handleNextPlayerReveal}
      />
    );
  }

  // Phase 2: Voting
  if (impostorState.gameState === 'voting') {
    const activePlayers = impostorState.players.filter(p => !p.isEliminated);
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Votazione</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Chi è l'Impostore?</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Discutete e scegliete chi eliminare.</p>
              <IonList>
                {activePlayers.map(player => (
                  <IonItem 
                    key={player.id}
                    button
                    onClick={() => setSelectedPlayerId(player.id)}
                    color={selectedPlayerId === player.id ? 'primary' : ''}
                  >
                    <IonLabel>{player.name}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
              <IonButton
                expand="block"
                onClick={handleElimination}
                disabled={selectedPlayerId === null}
                className="ion-margin-top"
              >
                <IonIcon slot="start" icon={personRemove} />
                Vota per Eliminare
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  // Phase 3: Elimination Result
  if (impostorState.gameState === 'elimination_result') {
    const eliminatedPlayer = impostorState.players.find(p => p.id === impostorState.eliminatedPlayerId);
    const wasImpostor = eliminatedPlayer?.role === 'Impostor';

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Risultato dell'eliminazione</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonCard className="elimination-card">
            <IonCardHeader>
              <IonCardTitle>{eliminatedPlayer?.name} è stato eliminato</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonIcon icon={wasImpostor ? skull : person} className={`role-icon ${wasImpostor ? 'impostor' : 'civilian'}`} />
              <p>Il suo ruolo era: <strong>{eliminatedPlayer?.role}</strong></p>
              
              {wasImpostor ? (
                <p className="elimination-reveal-text impostor-text">Avete scoperto un impostore!</p>
              ) : (
                <p className="elimination-reveal-text civilian-text">Avete eliminato un civile innocente...</p>
              )}

              <IonButton onClick={nextRound} className="ion-margin-top">
                Prossimo Turno
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  // Phase 4: Game Over
  if (impostorState.gameState === 'game_over') {
    const winner = impostorState.gameWinner;
    const impostors = impostorState.players.filter(p => p.role === 'Impostor');
    const impostorNames = impostors.map(i => i.name).join(', ');

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Fine del Gioco</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <div className="game-over-container">
            {winner === 'Civilians' ? (
                <>
                    <IonIcon icon={checkmarkCircle} className="winner-icon civilians" />
                    <h1>I Civili vincono!</h1>
                    <p>
                        {impostors.length > 1 ? 'Gli impostori' : "L'impostore"} <strong>{impostorNames}</strong> {impostors.length > 1 ? 'sono stati scoperti' : 'è stato scoperto'}!
                    </p>
                </>
            ) : (
                <>
                    <IonIcon icon={closeCircle} className="winner-icon impostor" />
                    <h1>{impostors.length > 1 ? 'Gli Impostori vincono!' : "L'Impostore vince!"}</h1>
                    <p>
                        {impostors.length > 1 ? 'Gli impostori erano' : "L'impostore era"} <strong>{impostorNames}</strong>.
                    </p>
                </>
            )}
            <IonButton onClick={handlePlayAgain} className="ion-margin-top">
              Gioca Ancora
            </IonButton>
            <IonButton onClick={handleBackToMenu} fill="outline" className="ion-margin-top">
              Torna al menu
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent>
        <p>Stato del gioco non valido: {impostorState.gameState}</p>
      </IonContent>
    </IonPage>
  );
};

export default ImpostorGame;