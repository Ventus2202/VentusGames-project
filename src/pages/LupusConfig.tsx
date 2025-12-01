import React, { useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonList, IonItem, IonLabel, IonToggle, IonButtons, IonNote } from '@ionic/react';
import { arrowBack, play, informationCircle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { usePlayers } from '../hooks/usePlayers';
import { useLupusGame } from '../hooks/useLupusGame';
import { LupusRole } from '../types/Lupus';
import './LupusConfig.css';

const SPECIAL_ROLES: { role: LupusRole; label: string; description: string }[] = [
  { role: 'Strega', label: 'La Strega', description: 'Ha una pozione per salvare e una per uccidere. Vince con i Civili.' },
  { role: 'Indemoniato', label: "L'Indemoniato", description: 'Vince se vincono i Lupi, ma non li conosce.' },
  { role: 'Giullare', label: 'Il Giullare', description: 'Vince se viene votato per l\'eliminazione.' },
  { role: 'Cupido', label: 'Cupido', description: 'Lega due innamorati: se uno muore, muore anche l\'altro.' },
  { role: 'Gufo', label: 'Il Gufo', description: 'Sceglie un giocatore da marchiare, che partirà con un voto.' },
];

const LupusConfig: React.FC = () => {
  const history = useHistory();
  const { players } = usePlayers();
  const validPlayers = players.filter(p => p.name.trim() !== '');
  const { startLupusGame } = useLupusGame(validPlayers);
  const [selectedRoles, setSelectedRoles] = useState<LupusRole[]>([]);

  const playerCount = validPlayers.length;
  
  // Calculate limits (Logic duplicated from useLupusGame to ensure consistency in UI)
  let wolfCount = 1;
  if (playerCount >= 8 && playerCount <= 11) wolfCount = 2;
  if (playerCount >= 12) wolfCount = 3;
  
  const mandatoryCount = wolfCount + 2; // Wolves + Veggente + Guardia
  const maxSpecials = Math.max(0, playerCount - mandatoryCount);
  const currentSpecialsCount = selectedRoles.length;
  const remainingSlots = maxSpecials - currentSpecialsCount;

  const handleToggleRole = (role: LupusRole) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      if (remainingSlots > 0) {
        setSelectedRoles([...selectedRoles, role]);
      }
    }
  };

  const handleStart = () => {
    startLupusGame(selectedRoles);
    history.push('/lupus-game');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.push('/lupus-lobby')}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Configurazione Ruoli</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="role-config-content">
        <div className="config-container">
          <div className="config-header">
            <h1>Personaggi Speciali</h1>
            <p>Aggiungi ruoli speciali alla partita.</p>
            <IonNote color={remainingSlots === 0 ? "warning" : "primary"}>
              <IonIcon icon={informationCircle} style={{verticalAlign: 'middle', marginRight: '5px'}}/>
              Puoi aggiungere ancora {remainingSlots} personaggi speciali.
            </IonNote>
          </div>

          <IonList className="roles-list">
            {SPECIAL_ROLES.map((roleData) => {
              const isSelected = selectedRoles.includes(roleData.role);
              const isDisabled = !isSelected && remainingSlots === 0;

              return (
                <IonItem key={roleData.role} className="role-item" lines="full">
                  <IonLabel className="ion-text-wrap">
                    <h2>{roleData.label}</h2>
                    <span className="role-description">{roleData.description}</span>
                  </IonLabel>
                  <IonToggle 
                    slot="end" 
                    checked={isSelected} 
                    disabled={isDisabled}
                    onIonChange={() => handleToggleRole(roleData.role)}
                  />
                </IonItem>
              );
            })}
          </IonList>

          <div className="start-button-container">
            <IonButton 
              expand="block" 
              size="large"
              onClick={handleStart}
              disabled={playerCount < 5}
            >
              <IonIcon icon={play} slot="start" />
              Inizia Partita
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LupusConfig;
