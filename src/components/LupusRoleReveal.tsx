import { IonContent, IonPage, IonButton, IonIcon } from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { useState } from 'react';
import { LupusPlayer } from '../types/Lupus';
import './RoleReveal.css'; // Reusing existing CSS for consistency

interface LupusRoleRevealProps {
  player: LupusPlayer;
  onNext: () => void;
}

const LupusRoleReveal: React.FC<LupusRoleRevealProps> = ({ player, onNext }) => {
  const [step, setStep] = useState<'ready' | 'reveal'>('ready');

  const handleReveal = () => {
    setStep('reveal');
  };

  const handleNext = () => {
    setStep('ready'); // Reset for next player logic if needed, though component might unmount
    onNext(); 
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
                <p>
                    {player.role === 'Lupo' && "Il tuo obiettivo è eliminare i Civili. Riconosci gli altri lupi se ci sono."}
                    {player.role === 'Civile' && "Il tuo obiettivo è scoprire i Lupi."}
                    {player.role === 'Veggente' && "Ogni notte puoi scoprire il ruolo di un giocatore."}
                    {player.role === 'Guardia' && "Ogni notte puoi proteggere un giocatore."}
                    {player.role === 'Strega' && "Hai una pozione per salvare e una per uccidere."}
                    {player.role === 'Indemoniato' && "Vinci con i Lupi, ma non sai chi sono."}
                    {player.role === 'Giullare' && "Fatti votare per essere eliminato e vincere."}
                    {player.role === 'Cupido' && "Scegli due innamorati che condivideranno il destino."}
                    {player.role === 'Gufo' && "Scegli qualcuno da marchiare per la votazione."}
                </p>
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

export default LupusRoleReveal;
