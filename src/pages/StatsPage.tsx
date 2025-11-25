import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { usePlayers } from '../hooks/usePlayers';
import { useSocialLadderGame } from '../hooks/useSocialLadderGame';
import './Tab2.css';

const Tab2: React.FC = () => {
  const { players } = usePlayers();
  const { socialLadderState } = useSocialLadderGame(players);

  const totalPlayers = players.filter(p => p.name.trim() !== '').length;
  const validPlayers = players.filter(p => p.name.trim() !== '');

  // Calcola statistiche dal gioco attuale
  const roundCount = socialLadderState?.rounds.length || 0;
  const totalScores = socialLadderState?.totalScores || {};

  const topPlayer = Object.keys(totalScores).length > 0 
    ? Object.entries(totalScores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)[0]
    : null;

  const topPlayerName = topPlayer ? players.find(p => p.id === parseInt(topPlayer[0]))?.name : 'N/A';

  const totalScoresSum = Object.values(totalScores).reduce((a: number, b: number) => a + b, 0);

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
                <span className="stat-value">{roundCount}</span>
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
                    {topPlayerName}
                  </div>
                  <div className="top-player-score">{topPlayer[1]} VP</div>
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* Classifica Giocatori */}
          {validPlayers.length > 0 && socialLadderState && (
            <IonCard className="ranking-card">
              <IonCardHeader>
                <IonCardTitle>📋 Classifica Giocatori</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="player-ranking-list">
                  {validPlayers
                    .map(p => ({
                      ...p,
                      score: totalScores[p.id] || 0,
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
          {!socialLadderState && (
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
