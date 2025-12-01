import React, { useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonButtons, IonActionSheet, IonToast, IonModal, IonList, IonItem, IonLabel, IonCheckbox } from '@ionic/react';
import { skull, home, eye, eyeOff, heart, moon, sunny, link } from 'ionicons/icons';
import { useHistory, Redirect } from 'react-router-dom';
import { useLupusGame } from '../hooks/useLupusGame';
import LupusRoleReveal from '../components/LupusRoleReveal';
import './LupusGame.css';
import { DeathCause } from '../types/Lupus';

const LupusGame: React.FC = () => {
  const history = useHistory();
  const { gameState, nextReveal, killPlayer, revivePlayer, setLovers, resetGame } = useLupusGame([]);
  const [showRoles, setShowRoles] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showLoversModal, setShowLoversModal] = useState(false);
  const [tempLovers, setTempLovers] = useState<number[]>([]);

  if (!gameState) {
    return <Redirect to="/games" />;
  }

  if (gameState.phase === 'ROLE_REVEAL') {
    const currentPlayer = gameState.players[gameState.currentRevealIndex];
    return <LupusRoleReveal player={currentPlayer} onNext={nextReveal} />;
  }

  if (gameState.phase === 'GAME_OVER') {
     const players = gameState.players;
     const aliveWolves = players.filter(p => p.isAlive && p.role === 'Lupo').length;
     const deadGiullare = players.find(p => !p.isAlive && p.role === 'Giullare' && p.deathCause === 'VOTE');
     
     let winnerTitle = "";
     let winnerClass = "";

     if (deadGiullare) {
         winnerTitle = "Vince il Giullare!";
         winnerClass = "winner-giullare"; // Need to add css
     } else if (aliveWolves === 0) {
         winnerTitle = "Vincono i Civili!";
         winnerClass = "winner-civilians";
     } else {
         winnerTitle = "Vincono i Lupi!";
         winnerClass = "winner-wolves";
     }
     
     return (
         <IonPage>
             <IonContent className="lupus-game-content">
                 <div className="game-over-container">
                     <h2>Partita Terminata!</h2>
                     <h1 className={`winner-title ${winnerClass}`}>
                         {winnerTitle}
                     </h1>
                     {winnerClass === 'winner-wolves' && players.some(p => p.role === 'Indemoniato') && (
                         <p className="sub-winner">Vince anche l'Indemoniato!</p>
                     )}
                     <IonButton expand="block" onClick={() => { resetGame(); history.push('/games'); }}>
                         Torna al Menu
                     </IonButton>
                 </div>
             </IonContent>
         </IonPage>
     )
  }

  const handlePlayerClick = (playerId: number, isAlive: boolean) => {
      if (isAlive) {
          setSelectedPlayerId(playerId);
          setShowActionSheet(true);
      } else {
          revivePlayer(playerId);
      }
  };

  const handleKill = (cause: DeathCause) => {
      if (selectedPlayerId !== null) {
          killPlayer(selectedPlayerId, cause);
          setSelectedPlayerId(null);
      }
  };

  const handleToggleLover = (id: number) => {
      if (tempLovers.includes(id)) {
          setTempLovers(tempLovers.filter(l => l !== id));
      } else {
          if (tempLovers.length < 2) {
              setTempLovers([...tempLovers, id]);
          }
      }
  };

  const confirmLovers = () => {
      setLovers(tempLovers);
      setShowLoversModal(false);
  };

  const hasCupido = gameState.players.some(p => p.role === 'Cupido');
  const loversSet = gameState.lovers && gameState.lovers.length === 2;

  // GAME Phase (Narrator View)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Narratore</IonTitle>
          <IonButtons slot="end">
             <IonButton onClick={() => setShowRoles(!showRoles)}>
                 <IonIcon icon={showRoles ? eyeOff : eye} />
             </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="lupus-game-content">
        <div className="narrator-header">
            <h2>Gestione Partita</h2>
            <p>Tocca un giocatore per ucciderlo/resuscitarlo.</p>
            
            {hasCupido && !loversSet && (
                <IonButton size="small" color="tertiary" onClick={() => setShowLoversModal(true)}>
                    <IonIcon icon={link} slot="start" />
                    Imposta Innamorati (Cupido)
                </IonButton>
            )}
        </div>

        <div className="player-list">
            {gameState.players.map(player => (
                <div key={player.id} className={`player-card ${!player.isAlive ? 'dead' : ''}`}>
                    <div className="player-info">
                        <span className="player-name">
                            {player.name}
                            {showRoles && <span className={`role-badge role-${player.role.toLowerCase()}`}>{player.role}</span>}
                        </span>
                        <div className="status-row">
                            <span className={`player-status ${player.isAlive ? 'status-alive' : 'status-dead'}`}>
                                {player.isAlive ? 'VIVO' : 'MORTO'}
                            </span>
                            {player.isLover && <IonIcon icon={heart} color="danger" style={{marginLeft: '8px'}} />}
                            {!player.isAlive && player.deathCause !== 'NONE' && (
                                <span className="death-cause">
                                    ({player.deathCause === 'VOTE' ? 'VOTO' : player.deathCause === 'NIGHT_KILL' ? 'NOTTE' : 'CUORE'})
                                </span>
                            )}
                        </div>
                    </div>
                    <IonButton 
                        fill="clear" 
                        color={player.isAlive ? "danger" : "success"}
                        onClick={() => handlePlayerClick(player.id, player.isAlive)}
                    >
                        <IonIcon icon={player.isAlive ? skull : heart} slot="icon-only" />
                    </IonButton>
                </div>
            ))}
        </div>
        
        <div style={{padding: '20px'}}>
             <IonButton expand="block" color="medium" fill="outline" onClick={() => { resetGame(); history.push('/games'); }}>
                 <IonIcon icon={home} slot="start" />
                 Interrompi Partita
             </IonButton>
        </div>

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header="Seleziona causa della morte"
          buttons={[
            {
              text: 'Votazione (Giorno)',
              icon: sunny,
              handler: () => handleKill('VOTE')
            },
            {
              text: 'Lupi (Notte)',
              icon: moon,
              handler: () => handleKill('NIGHT_KILL')
            },
            {
              text: 'Annulla',
              role: 'cancel'
            }
          ]}
        />

        <IonModal isOpen={showLoversModal} onDidDismiss={() => setShowLoversModal(false)}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Scegli due Innamorati</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setShowLoversModal(false)}>Chiudi</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {gameState.players.map(player => (
                        <IonItem key={player.id}>
                            <IonLabel>{player.name} ({player.role})</IonLabel>
                            <IonCheckbox 
                                slot="end" 
                                checked={tempLovers.includes(player.id)}
                                onIonChange={() => handleToggleLover(player.id)}
                                disabled={!tempLovers.includes(player.id) && tempLovers.length >= 2}
                            />
                        </IonItem>
                    ))}
                </IonList>
                <div style={{padding: '20px'}}>
                    <IonButton expand="block" disabled={tempLovers.length !== 2} onClick={confirmLovers}>
                        Conferma Innamorati
                    </IonButton>
                </div>
            </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default LupusGame;
