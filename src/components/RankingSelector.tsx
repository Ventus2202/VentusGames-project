import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonCard, IonCardContent } from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { Player } from '../types/Player';
import './RankingSelector.css';

export interface RankItem extends Player {
  tempPosition?: number;
}

interface RankingSelectorProps {
  question: string;
  players: Player[];
  onConfirm: (ranking: Array<{ playerId: number; position: number }>) => void;
  isMaster?: boolean;
  masterName?: string;
  masterPlayerId?: number;
  currentPlayerName?: string; // Nome del giocatore corrente (per non-master)
}

const RankingSelector: React.FC<RankingSelectorProps> = ({
  question,
  players,
  onConfirm,
  isMaster = false,
  masterName,
  masterPlayerId,
  currentPlayerName,
}) => {
  const [rankingList, setRankingList] = useState<RankItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<RankItem | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    if (isMaster) {
      // Master vede tutti i giocatori da ordinare
      const shuffled = [...players].sort(() => Math.random() - 0.5);
      setRankingList(shuffled);
    }
  }, [players, isMaster]);

  const handleDragStart = (item: RankItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetItem: RankItem) => {
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const draggedIndex = rankingList.findIndex(p => p.id === draggedItem.id);
    const targetIndex = rankingList.findIndex(p => p.id === targetItem.id);

    const newList = [...rankingList];
    [newList[draggedIndex], newList[targetIndex]] = [newList[targetIndex], newList[draggedIndex]];

    setRankingList(newList);
    setDraggedItem(null);
  };

  // Touch handlers per mobile drag and drop
  const handleTouchStart = (e: React.TouchEvent, item: RankItem) => {
    setTouchStartY(e.touches[0].clientY);
    setDraggedItem(item);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !draggedItem) return;
    const touchCurrentY = e.touches[0].clientY;
    setDragOffset(touchCurrentY - touchStartY);
  };

  const handleTouchEnd = (targetItem: RankItem) => {
    if (!draggedItem || draggedItem.id === targetItem.id || dragOffset === 0) {
      setDraggedItem(null);
      setTouchStartY(0);
      setDragOffset(0);
      setIsDragging(false);
      return;
    }

    const draggedIndex = rankingList.findIndex(p => p.id === draggedItem.id);
    const targetIndex = rankingList.findIndex(p => p.id === targetItem.id);

    const newList = [...rankingList];
    [newList[draggedIndex], newList[targetIndex]] = [newList[targetIndex], newList[draggedIndex]];

    setRankingList(newList);
    setDraggedItem(null);
    setTouchStartY(0);
    setDragOffset(0);
    setIsDragging(false);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...rankingList];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setRankingList(newList);
  };

  const moveDown = (index: number) => {
    if (index === rankingList.length - 1) return;
    const newList = [...rankingList];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setRankingList(newList);
  };

  const handleConfirm = () => {
    if (isMaster) {
      // Master invia tutta la classifica
      const ranking = rankingList.map((player, index) => ({
        playerId: player.id,
        position: index + 1,
      }));
      onConfirm(ranking);
    } else {
      // Giocatore normale invia solo la sua posizione
      if (selectedPosition && masterPlayerId) {
        onConfirm([{
          playerId: masterPlayerId,
          position: selectedPosition,
        }]);
      }
    }
  };

  const isAllRanked = isMaster ? rankingList.length > 0 : selectedPosition !== null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isMaster ? `👑 Master - ${masterName}` : currentPlayerName || 'Posizionati'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ranking-selector-content">
        <div className="ranking-container">
          {/* Domanda */}
          <div className="question-section">
            <h2 className="question-text">{question}</h2>
            <p className="subtitle">
              {isMaster ? 'Ordina tutti i giocatori (incluso te stesso) secondo la tua opinione' : 'Scegli la tua posizione nella classifica'}
            </p>
          </div>

          {/* Card con ranking */}
          <IonCard className="ranking-card">
            <IonCardContent>
              {isMaster ? (
                <div className="ranking-list">
                  {rankingList.map((player, index) => (
                    <div
                      key={player.id}
                      className={`ranking-item ${draggedItem?.id === player.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={() => handleDragStart(player)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(player)}
                      onTouchStart={(e) => handleTouchStart(e, player)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={() => handleTouchEnd(player)}
                      style={{
                        transform: draggedItem?.id === player.id && isDragging ? `translateY(${dragOffset}px)` : 'translateY(0)',
                        opacity: draggedItem?.id === player.id && isDragging ? 0.7 : 1,
                      }}
                    >
                      <div className="position-badge">{index + 1}</div>
                      <div className="player-info">
                        <span className="player-name">{player.name}</span>
                      </div>
                      <div className="controls">
                        <button
                          className="move-button up"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          title="Sposta su"
                        >
                          ↑
                        </button>
                        <button
                          className="move-button down"
                          onClick={() => moveDown(index)}
                          disabled={index === rankingList.length - 1}
                          title="Sposta giù"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="position-grid">
                  {Array.from({ length: players.length }, (_, index) => (
                    <button
                      key={index + 1}
                      className={`position-slot ${selectedPosition === index + 1 ? 'selected' : ''}`}
                      onClick={() => setSelectedPosition(index + 1)}
                    >
                      <div className="slot-number">{index + 1}</div>
                      <div className="slot-label">
                        {selectedPosition === index + 1 ? 'La mia posizione' : 'Vuoto'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </IonCardContent>
          </IonCard>

          {/* Bottone conferma */}
          <div className="confirm-section">
            <IonButton
              expand="block"
              className="confirm-button"
              onClick={handleConfirm}
              disabled={!isAllRanked}
            >
              <IonIcon icon={checkmark} slot="start" />
              Conferma Posizionamento
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RankingSelector;
