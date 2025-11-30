import { IonContent, IonPage, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { usePlayers } from '../hooks/usePlayers';
import { usePsychologistGame } from '../hooks/usePsychologistGame';
import './PsychologistFinalResults.css';

const PsychologistFinalResults: React.FC = () => {
  const history = useHistory();
  const { players } = usePlayers();
  const { psychologistState, resetPsychologistState } = usePsychologistGame(players);

  const handlePlayAgain = () => {
    resetPsychologistState();
    history.push('/psychologist-lobby');
  };

  const handleBackToMenu = () => {
    resetPsychologistState();
    history.push('/games');
  };

  if (!psychologistState) {
    return null;
  }

  // Ordina i giocatori per punteggio
  const sortedPlayers = [...psychologistState.players].sort((a, b) => {
    return (psychologistState.totalScores[b.id] || 0) - (psychologistState.totalScores[a.id] || 0);
  });

  const winner = sortedPlayers[0];
  const winnerScore = psychologistState.totalScores[winner.id] || 0;

  return (
    <IonPage>
      <IonContent className="psychologist-final-content">
        <div className="final-container">
          {/* Titolo */}
          <div className="final-header">
            <h1>Partita Terminata!</h1>
            <p>Ecco i risultati finali</p>
          </div>

          {/* Vincitore */}
          <div className="winner-section">
            <div className="winner-badge">🏆</div>
            <h2 className="winner-name">{winner.name}</h2>
            <p className="winner-score">{winnerScore} Punti</p>
          </div>

          {/* Classifica */}
          <div className="leaderboard">
            <h3 className="leaderboard-title">Classifica Finale</h3>
            <div className="leaderboard-list">
              {sortedPlayers.map((player, index) => (
                <div key={player.id} className={`leaderboard-item rank-${index + 1}`}>
                  <div className="rank-position">#{index + 1}</div>
                  <div className="player-info">
                    <div className="player-name">{player.name}</div>
                  </div>
                  <div className="player-score">{psychologistState.totalScores[player.id] || 0} pts</div>
                </div>
              ))}
            </div>
          </div>

          {/* Info partita */}
          <div className="game-stats">
            <div className="stat-box">
              <div className="stat-label">Giocatori</div>
              <div className="stat-value">{psychologistState.players.length}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Rounds</div>
              <div className="stat-value">{psychologistState.rounds.length}</div>
            </div>
          </div>

          {/* Bottoni azione */}
          <div className="button-actions">
            <IonButton
              expand="block"
              className="play-again-button"
              onClick={handlePlayAgain}
            >
              Gioca Ancora
            </IonButton>
            <IonButton
              expand="block"
              fill="outline"
              className="back-to-menu-button"
              onClick={handleBackToMenu}
            >
              Torna al menu
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PsychologistFinalResults;
