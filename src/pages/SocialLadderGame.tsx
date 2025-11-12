import { IonContent, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import useSocialLadderQuestions from '../hooks/useSocialLadderQuestions';
import ReadyScreen from '../components/ReadyScreen';
import RankingSelector from '../components/RankingSelector';
import SocialLadderResults from '../components/SocialLadderResults';
import SocialLadderFinalResults from './SocialLadderFinalResults';
import './SocialLadderGame.css';

const SocialLadderGame: React.FC = () => {
  const { socialLadderState, setPlayerSelfPosition, setMasterRanking, completeRound, startNextRound, endGame, totalRounds } = useGame();
  const { questions } = useSocialLadderQuestions();
  const history = useHistory();
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showReadyScreen, setShowReadyScreen] = useState(true);
  const [allPlayersVoted, setAllPlayersVoted] = useState(false);

  // Reset stato quando inizia un nuovo round
  useEffect(() => {
    if (socialLadderState?.gameState === 'voting') {
      setCurrentPlayerIndex(0);
      setShowReadyScreen(true);
      setAllPlayersVoted(false);
    }
  }, [socialLadderState?.gameState, socialLadderState?.currentRound]);

  // Redirect alla lobby se non c'è stato
  useEffect(() => {
    if (!socialLadderState) {
      const timeout = setTimeout(() => {
        history.push('/social-ladder-lobby');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [socialLadderState, history]);

  if (!socialLadderState) {
    return (
      <IonPage>
        <IonContent className="loading-content">
          <div className="loading-container">
            <p>Caricamento del gioco...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // Fase: Fine gioco
  if (socialLadderState.gameState === 'game_over') {
    return <SocialLadderFinalResults />;
  }

  // Fase: Risultati del round
  if (socialLadderState.gameState === 'results') {
    const currentRound = socialLadderState.rounds[socialLadderState.rounds.length - 1];
    const isLastRound = socialLadderState.currentRound >= totalRounds;

    const handleNextRound = () => {
      if (questions.length > 0) {
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        startNextRound(randomQuestion);
      }
    };

    const handleEndGame = () => {
      endGame();
    };

    return (
      <SocialLadderResults
        roundData={currentRound}
        onNextRound={isLastRound ? undefined : handleNextRound}
        onEndGame={handleEndGame}
      />
    );
  }

  // Fase: Voting (giocatori si posizionano uno per uno)
  if (socialLadderState.gameState === 'voting') {
    const currentRound = socialLadderState.rounds[socialLadderState.rounds.length - 1];
    
    if (!currentRound) {
      return null;
    }

    // Tutti i giocatori normali hanno votato, ora tocca al Master
    if (allPlayersVoted) {
      const masterPlayer = socialLadderState.players.find(p => p.id === socialLadderState.masterId);
      
      if (!masterPlayer) return null;

      // Mostra ReadyScreen per il Master
      if (showReadyScreen) {
        return (
          <ReadyScreen
            playerName={masterPlayer.name}
            isMaster={true}
            onReady={() => setShowReadyScreen(false)}
          />
        );
      }

      // Il Master crea la classifica COMPLETA
      return (
        <IonPage>
          <IonContent className="ranking-turn-content">
            <div className="turn-header">
              <div className="turn-name">👑 {masterPlayer.name} (Master)</div>
              <p className="master-instruction">Crea la classifica ufficiale di tutti i giocatori</p>
            </div>
            <RankingSelector
              question={currentRound.question}
              players={socialLadderState.players}
              onConfirm={(ranking) => {
                setMasterRanking(ranking);
                completeRound();
              }}
              isMaster={true}
              masterName={masterPlayer.name}
            />
          </IonContent>
        </IonPage>
      );
    }

    // Giocatori normali votano uno alla volta (non il Master)
    const playersToVote = socialLadderState.players.filter(p => p.id !== socialLadderState.masterId);
    
    if (currentPlayerIndex >= playersToVote.length) {
      // Tutti i giocatori normali hanno votato
      setAllPlayersVoted(true);
      setShowReadyScreen(true);
      return null;
    }

    const currentPlayer = playersToVote[currentPlayerIndex];

    // Mostra ReadyScreen per il giocatore corrente
    if (showReadyScreen) {
      return (
        <ReadyScreen
          playerName={currentPlayer.name}
          isMaster={false}
          onReady={() => setShowReadyScreen(false)}
        />
      );
    }

    // Il giocatore si posiziona (sceglie solo la SUA posizione)
    return (
      <IonPage>
        <IonContent className="ranking-turn-content">
          <div className="turn-header">
            <div className="turn-counter">Giocatore {currentPlayerIndex + 1} di {playersToVote.length}</div>
            <div className="turn-name">{currentPlayer.name}</div>
            <p className="player-instruction">Dove ti posizioni in questa classifica?</p>
          </div>
          <RankingSelector
            question={currentRound.question}
            players={socialLadderState.players}
            onConfirm={(ranking) => {
              // Il giocatore ha scelto la sua posizione
              const myPosition = ranking.find(r => r.playerId === currentPlayer.id)?.position;
              if (myPosition) {
                setPlayerSelfPosition(currentPlayer.id, myPosition);
                setCurrentPlayerIndex(currentPlayerIndex + 1);
                setShowReadyScreen(true);
              }
            }}
            isMaster={false}
            masterName={socialLadderState.players.find(p => p.id === socialLadderState.masterId)?.name}
            masterPlayerId={currentPlayer.id}
            currentPlayerName={currentPlayer.name}
          />
        </IonContent>
      </IonPage>
    );
  }

  // Fallback
  return (
    <IonPage>
      <IonContent className="loading-content">
        <div className="loading-container">
          <p>Preparazione...</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SocialLadderGame;
