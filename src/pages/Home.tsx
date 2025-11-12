
import { useState, useEffect } from 'react';
import { IonContent, IonPage, IonButton, IonInput, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { trash } from 'ionicons/icons';
import { useGame } from '../context/GameContext';
import logo from '../assets/logo.png';
import './Home.css';

const Home: React.FC = () => {
  const { players, updatePlayerName, addPlayer, removePlayer, resetSocialLadderState } = useGame();
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  // Resetta lo stato del gioco quando si torna alla home
  useEffect(() => {
    resetSocialLadderState();
  }, [resetSocialLadderState]);

  const handlePlayerCountChange = (delta: number) => {
    const newCount = players.length + delta;
    if (newCount >= 2 && newCount <= 8) {
      if (delta > 0) {
        addPlayer('');
      } else if (delta < 0 && players.length > 2) {
        removePlayer(players[players.length - 1].id);
      }
      setError(null);
    }
  };

  const handlePlayerNameChange = (id: number, name: string) => {
    updatePlayerName(id, name);
    if (name.trim() !== '') {
      setError(null);
    }
  };

  const handleStart = () => {
    // Valida che tutti i nomi siano compilati
    const emptyPlayers = players.filter(p => p.name.trim() === '');
    if (emptyPlayers.length > 0) {
      setError(`Inserisci i nomi di tutti i ${players.length} giocatori`);
      return;
    }
    // Salva i giocatori nel context e naviga
    history.push('/games');
  };

  return (
    <IonPage>
      <IonContent className="home-content">
        <div className="home-container">
          {/* Logo */}
          <div className="logo-container">
            <div className="logo">
              <img src={logo} alt="Ventus Games Logo" className="logo-image" />
            </div>
          </div>

          {/* Card */}
          <div className="config-card">
            <div className="card-header">
              <h1>Configura la Partita</h1>
              <p className="subtitle">Seleziona i giocatori per iniziare</p>
            </div>

            {/* Player count selector */}
            <div className="player-count">
              <button 
                className="count-button" 
                onClick={() => handlePlayerCountChange(-1)}
                disabled={players.length <= 2}
              >
                -
              </button>
              <span className="count-text">Giocatori: {players.length}</span>
              <button 
                className="count-button" 
                onClick={() => handlePlayerCountChange(1)}
                disabled={players.length >= 8}
              >
                +
              </button>
            </div>

            {/* Player name inputs */}
            <div className="player-inputs">
              {players.map((player, index) => (
                <div key={player.id} className="player-input-wrapper">
                  <IonInput
                    value={player.name}
                    placeholder={`Nome Giocatore ${index + 1}`}
                    onIonInput={(e) => handlePlayerNameChange(player.id, e.detail.value!)}
                    className={`player-input ${player.name.trim() === '' && error ? 'input-error' : ''}`}
                  />
                  {players.length > 2 && (
                    <button
                      className="delete-button"
                      onClick={() => removePlayer(player.id)}
                      title="Rimuovi giocatore"
                    >
                      <IonIcon icon={trash} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Error message */}
            {error && <div className="error-message">{error}</div>}

            {/* Start button */}
            <IonButton 
              expand="block" 
              className="start-button"
              onClick={handleStart}
            >
              Avanti
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
