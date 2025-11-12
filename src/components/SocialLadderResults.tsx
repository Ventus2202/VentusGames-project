import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { checkmark, close } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { SocialLadderRound } from '../types/SocialLadder';
import './SocialLadderResults.css';

interface SocialLadderResultsProps {
  roundData: SocialLadderRound;
  onNextRound?: () => void;
  onEndGame?: () => void;
}

const SocialLadderResults: React.FC<SocialLadderResultsProps> = ({ roundData, onNextRound, onEndGame }) => {
  const { socialLadderState, totalRounds } = useGame();
  const history = useHistory();

  if (!socialLadderState) {
    return null;
  }

  // Crea la classifica del Master (ordinata)
  const masterRanking = roundData.masterPositions
    .sort((a, b) => a.position - b.position)
    .map(mp => {
      const player = socialLadderState.players.find(p => p.id === mp.playerId);
      const playerSelfPosition = roundData.playerSelfPositions[mp.playerId];
      const correct = playerSelfPosition === mp.position;
      const points = roundData.roundScores[mp.playerId] || 0;
      
      return {
        playerId: mp.playerId,
        playerName: player?.name || 'Unknown',
        position: mp.position,
        playerSelfPosition,
        correct,
        points,
      };
    });

  // Chi ha indovinato (guadagnato punti)
  const correctGuesses = masterRanking.filter(r => r.correct && r.points > 0);
  
  // Controlla se il Master ha guadagnato il bonus (2 punti)
  const masterBonus = roundData.roundScores[roundData.masterId] === 2;

  const masterName = socialLadderState.players.find(p => p.id === roundData.masterId)?.name;
  const isLastRound = socialLadderState && roundData.roundNumber >= totalRounds;
  const canContinue = socialLadderState && roundData.roundNumber < totalRounds;

  const handleNextRound = () => {
    if (onNextRound) {
      onNextRound();
    }
  };

  const handleEndGame = () => {
    if (onEndGame) {
      onEndGame();
    } else {
      history.push('/');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Risultati Round {roundData.roundNumber}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="results-content">
        <div className="results-container">
          {/* Info Master */}
          <div className="master-info">
            <p className="master-label">Master: <span>{masterName}</span></p>
          </div>

          {/* Classifica del Master */}
          <IonCard className="results-card">
            <IonCardContent>
              <h3 className="section-title">🏆 Classifica del Master</h3>
              <div className="ranking-list">
                {masterRanking.map((item) => (
                  <div key={item.playerId} className="ranking-item">
                    <div className="position-badge">{item.position}</div>
                    <div className="player-name">{item.playerName}</div>
                  </div>
                ))}
              </div>
            </IonCardContent>
          </IonCard>

          {/* Chi ha indovinato */}
          <IonCard className="correct-guesses-card">
            <IonCardContent>
              <h3 className="section-title">✅ Chi ha indovinato</h3>
              {correctGuesses.length > 0 || masterBonus ? (
                <div className="correct-list">
                  {correctGuesses.map((item) => (
                    <div key={item.playerId} className="correct-item">
                      <IonIcon icon={checkmark} className="check-icon" />
                      <span className="player-name">{item.playerName}</span>
                      <span className="points-earned">+{item.points} VP</span>
                    </div>
                  ))}
                  {masterBonus && (
                    <div className="correct-item master-bonus">
                      <span className="crown-icon">👑</span>
                      <span className="player-name">{masterName} (Master Bonus!)</span>
                      <span className="points-earned">+2 VP</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="no-correct">Nessuno ha indovinato questa volta!</p>
              )}
            </IonCardContent>
          </IonCard>

          {/* Punteggi totali */}
          <IonCard className="totals-card">
            <IonCardContent>
              <h3>Punteggi Totali</h3>
              <div className="totals-list">
                {socialLadderState.players
                  .map(p => ({
                    ...p,
                    totalScore: socialLadderState.totalScores[p.id] || 0,
                  }))
                  .sort((a, b) => b.totalScore - a.totalScore)
                  .map((player, index) => (
                    <div key={player.id} className="total-item">
                      <div className="rank-badge">{index + 1}</div>
                      <span className="player-name">{player.name}</span>
                      <span className="total-score">{player.totalScore} VP</span>
                    </div>
                  ))}
              </div>
            </IonCardContent>
          </IonCard>

          {/* Info Round */}
          <div className="round-info">
            <p>Round {roundData.roundNumber} di {totalRounds}</p>
          </div>

          {/* Bottoni azioni */}
          <div className="button-section">
            {canContinue ? (
              <>
                <IonButton expand="block" className="next-button" onClick={handleNextRound}>
                  Prossimo Round
                </IonButton>
                <IonButton expand="block" fill="outline" className="end-button" onClick={handleEndGame}>
                  Termina Gioco
                </IonButton>
              </>
            ) : (
              <IonButton expand="block" className="finish-button" onClick={handleEndGame}>
                Vedi Risultati Finali
              </IonButton>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SocialLadderResults;
