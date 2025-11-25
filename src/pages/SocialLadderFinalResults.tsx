import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { home, refresh } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { usePlayers } from '../hooks/usePlayers';
import { useSocialLadderGame } from '../hooks/useSocialLadderGame';
import useLocalStorage, { GameSession } from '../hooks/useLocalStorage';
import './SocialLadderFinalResults.css';

const SocialLadderFinalResults: React.FC = () => {
  const history = useHistory();
  const { players } = usePlayers();
  const { socialLadderState, resetSocialLadderState } = useSocialLadderGame(players);
  const { saveGameSession } = useLocalStorage();

  // Salva la partita quando la pagina si monta
  useEffect(() => {
    if (socialLadderState && socialLadderState.rounds.length > 0) {
      const finalRanking = socialLadderState.players
        .map(p => ({
          ...p,
          totalScore: socialLadderState.totalScores[p.id] || 0,
        }))
        .sort((a, b) => b.totalScore - a.totalScore);

      const winner = finalRanking[0];
      const session: GameSession = {
        id: `game_${Date.now()}`,
        date: new Date().toISOString(),
        players: socialLadderState.players.map(p => p.name),
        rounds: socialLadderState.rounds.length,
        winner: winner.name,
        totalScore: winner.totalScore,
      };

      saveGameSession(session);
    }
  }, [socialLadderState, saveGameSession]);

  if (!socialLadderState) {
    return null;
  }

  // Ordina i giocatori per punteggio totale
  const finalRanking = socialLadderState.players
    .map(p => ({
      ...p,
      totalScore: socialLadderState.totalScores[p.id] || 0,
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  const winner = finalRanking[0];
  const secondPlace = finalRanking[1];
  const thirdPlace = finalRanking[2];

  const handlePlayAgain = () => {
    resetSocialLadderState();
    history.push('/social-ladder-lobby');
  };

  const handleBackToMenu = () => {
    resetSocialLadderState();
    history.push('/games');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Risultati Finali</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="final-results-content">
        <div className="final-results-container">
          {/* Celebrazione */}
          <div className="celebration">
            <h1>🎉 Gioco Terminato! 🎉</h1>
            <p>Grazie per aver giocato a Social Ladder</p>
          </div>

          {/* Podio */}
          <div className="podium-container">
            {/* Secondo posto */}
            {secondPlace && (
              <div className="podium-item second">
                <div className="medal">🥈</div>
                <div className="position">2°</div>
                <div className="name">{secondPlace.name}</div>
                <div className="score">{secondPlace.totalScore} VP</div>
              </div>
            )}

            {/* Primo posto */}
            <div className="podium-item first">
              <div className="medal">🥇</div>
              <div className="position">1°</div>
              <div className="name">{winner.name}</div>
              <div className="score">{winner.totalScore} VP</div>
            </div>

            {/* Terzo posto */}
            {thirdPlace && (
              <div className="podium-item third">
                <div className="medal">🥉</div>
                <div className="position">3°</div>
                <div className="name">{thirdPlace.name}</div>
                <div className="score">{thirdPlace.totalScore} VP</div>
              </div>
            )}
          </div>

          {/* Classifica Completa */}
          <IonCard className="final-ranking-card">
            <IonCardContent>
              <h3>Classifica Finale</h3>
              <div className="final-ranking-list">
                {finalRanking.map((player, index) => (
                  <div key={player.id} className="final-ranking-item">
                    <div className="rank-number">{index + 1}</div>
                    <div className="rank-info">
                      <span className="rank-name">{player.name}</span>
                      <span className="rank-detail">{socialLadderState.rounds.length} round giocati</span>
                    </div>
                    <div className="rank-score">{player.totalScore}</div>
                  </div>
                ))}
              </div>
            </IonCardContent>
          </IonCard>

          {/* Statistiche */}
          <IonCard className="stats-card">
            <IonCardContent>
              <h3>Statistiche Partita</h3>
              <div className="stats-list">
                <div className="stat-item">
                  <span className="stat-label">Round Giocati:</span>
                  <span className="stat-value">{socialLadderState.rounds.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Giocatori:</span>
                  <span className="stat-value">{socialLadderState.players.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Punteggi Totali:</span>
                  <span className="stat-value">
                    {Object.values(socialLadderState.totalScores).reduce((a, b) => a + b, 0)}
                  </span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Azioni */}
          <div className="action-buttons">
            <IonButton expand="block" className="play-again-button" onClick={handlePlayAgain}>
              <IonIcon icon={refresh} slot="start" />
              Gioca Ancora
            </IonButton>
            <IonButton expand="block" fill="outline" className="back-to-menu-button" onClick={handleBackToMenu}>
              <IonIcon icon={home} slot="start" />
              Torna al menu
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SocialLadderFinalResults;
