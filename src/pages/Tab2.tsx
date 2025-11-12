import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { useGame } from '../context/GameContext';
import './Tab2.css';

const Tab2: React.FC = () => {
  const { players, socialLadderState } = useGame();

  const totalPlayers = players.filter(p => p.name.trim() !== '').length;
  const validPlayers = players.filter(p => p.name.trim() !== '');

  // Calcola statistiche dal gioco attuale
  const getRoundCount = () => socialLadderState?.rounds.length || 0;
  const getTotalScores = () => {
    if (!socialLadderState) return {};
    return socialLadderState.totalScores;
  };
  const getTopPlayer = () => {
    const scores = getTotalScores();
    if (Object.keys(scores).length === 0) return null;
    const topId = Object.keys(scores).reduce((a, b) =>
      (scores[parseInt(b)] || 0) > (scores[parseInt(a)] || 0) ? b : a
    );
    return { id: parseInt(topId), score: scores[parseInt(topId)] || 0 };
  };

  const topPlayer = getTopPlayer();
  const totalScoresSum = Object.values(getTotalScores()).reduce((a, b) => a + b, 0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>📊 Statistiche</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="stats-content" fullscreen>
        <div className="stats-container">
          {/* Intestazione */}
          <div className="stats-header">
            <h1>Statistiche Globali</h1>
            <p>Visualizza i dati di gioco</p>
          </div>

          {/* Statistiche Generali */}
          <IonCard className="stats-card">
            <IonCardHeader>
              <IonCardTitle>Informazioni Generali</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="stat-row">
                <span className="stat-label">Giocatori Registrati:</span>
                <span className="stat-value">{totalPlayers}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Round Giocati:</span>
                <span className="stat-value">{getRoundCount()}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Punti Totali Assegnati:</span>
                <span className="stat-value">{totalScoresSum}</span>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Top Player */}
          {topPlayer && (
            <IonCard className="top-player-card">
              <IonCardHeader>
                <IonCardTitle>🏆 Top Player</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="top-player-info">
                  <div className="top-player-name">
                    {players.find(p => p.id === topPlayer.id)?.name || 'Sconosciuto'}
                  </div>
                  <div className="top-player-score">{topPlayer.score} VP</div>
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* Classifica Giocatori */}
          {validPlayers.length > 0 && (
            <IonCard className="ranking-card">
              <IonCardHeader>
                <IonCardTitle>📋 Classifica Giocatori</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="player-ranking-list">
                  {validPlayers
                    .map(p => ({
                      ...p,
                      score: getTotalScores()[p.id] || 0,
                    }))
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => (
                      <div key={player.id} className="ranking-row">
                        <div className="rank-number">{index + 1}</div>
                        <div className="rank-name">{player.name}</div>
                        <div className="rank-score">{player.score} VP</div>
                      </div>
                    ))}
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* Info vuota */}
          {validPlayers.length === 0 && (
            <IonCard className="empty-card">
              <IonCardContent>
                <p className="empty-message">
                  📭 Nessuna statistica disponibile al momento.
                  <br />
                  Completa una partita per visualizzare i dati!
                </p>
              </IonCardContent>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
