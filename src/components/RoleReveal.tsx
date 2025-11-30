import { IonContent, IonPage, IonButton, IonIcon } from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { useState } from 'react';
import { ImpostorPlayer } from '../types/Impostor';
import './RoleReveal.css';

interface RoleRevealProps {
  player: ImpostorPlayer;
  onNext: () => void;
}

const RoleReveal: React.FC<RoleRevealProps> = ({ player, onNext }) => {
  const [step, setStep] = useState<'ready' | 'reveal'>('ready');

  const handleReveal = () => {
    setStep('reveal');
  };

  const handleNext = () => {
    onNext(); // This will proceed to the next player's reveal or game phase
  };

  return (
    <IonPage>
      <IonContent className="role-reveal-content">
        {step === 'ready' && (
          <div className="reveal-container">
            <h1>Tocca a te, {player.name}</h1>
            <p>Assicurati che nessun altro stia guardando.</p>
            <IonButton onClick={handleReveal} expand="block" size="large">
              <IonIcon icon={eye} slot="start" />
              Mostra il mio ruolo
            </IonButton>
          </div>
        )}

        {step === 'reveal' && (
          <div className="reveal-container">
            <p>Tu sei...</p>
            <h1 className={`role-title role-${player.role.toLowerCase()}`}>{player.role}</h1>
            
            <div className="word-card">
              {player.role === 'Impostor' ? (
                <p className="impostor-instruction">Non hai nessuna parola. Improvvisa!</p>
              ) : (
                <>
                  <div className="word-label">La tua parola è:</div>
                  <div className="word-text">{player.word}</div>
                </>
              )}
            </div>

            <IonButton onClick={handleNext} expand="block">
              <IonIcon icon={eyeOff} slot="start" />
              Nascondi e Passa
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RoleReveal;
