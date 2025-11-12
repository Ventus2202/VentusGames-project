import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SocialLadderState, SocialLadderRound, RankPosition } from '../types/SocialLadder';

export interface Player {
  id: number;
  name: string;
}

interface GameContextType {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: number) => void;
  updatePlayerName: (id: number, name: string) => void;
  resetGame: () => void;
  socialLadderState: SocialLadderState | null;
  initializeGame: (question: string) => void;
  setPlayerSelfPosition: (playerId: number, position: number) => void;
  setMasterRanking: (ranking: RankPosition[]) => void;
  completeRound: () => void;
  startNextRound: (question: string) => void;
  endGame: () => void;
  resetSocialLadderState: () => void;
  totalRounds: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'socialLadderState';

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: '' },
    { id: 2, name: '' },
  ]);
  
  // Inizializza lo stato da sessionStorage
  const [socialLadderState, setSocialLadderStateInternal] = useState<SocialLadderState | null>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  // Helper per leggere da sessionStorage (usato dalle funzioni di mutazione)
  const getSocialLadderState = useCallback((): SocialLadderState | null => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }, []);

  // Aggiorna sia sessionStorage che lo stato React
  const setSocialLadderState = useCallback((state: SocialLadderState | null) => {
    if (state) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    setSocialLadderStateInternal(state);
  }, []);

  const addPlayer = useCallback((name: string) => {
    setPlayers(prev => {
      const newId = Math.max(...prev.map(p => p.id), 0) + 1;
      return [...prev, { id: newId, name }];
    });
  }, []);

  const removePlayer = useCallback((id: number) => {
    setPlayers(prev => {
      if (prev.length > 2) {
        return prev.filter(p => p.id !== id);
      }
      return prev;
    });
  }, []);

  const updatePlayerName = useCallback((id: number, name: string) => {
    setPlayers(prev => prev.map(p => (p.id === id ? { ...p, name } : p)));
  }, []);

  const resetGame = useCallback(() => {
    setPlayers([
      { id: 1, name: '' },
      { id: 2, name: '' },
    ]);
  }, []);

  const initializeGame = useCallback((question: string) => {
    const validPlayers = players.filter(p => p.name.trim() !== '');
    
    if (validPlayers.length < 3) {
      setSocialLadderState(null);
      return;
    }

    const firstRound: SocialLadderRound = {
      roundNumber: 1,
      questionId: `q_${Date.now()}`,
      question,
      masterId: validPlayers[0].id,
      playerSelfPositions: {},
      playerPositions: [],
      masterPositions: [],
      roundScores: {},
      completed: false,
    };

    validPlayers.forEach(p => {
      firstRound.roundScores[p.id] = 0;
      firstRound.playerSelfPositions[p.id] = 0;
    });

    const newState: SocialLadderState = {
      gameState: 'voting',
      players: validPlayers,
      currentRound: 1,
      rounds: [firstRound],
      totalScores: {},
      masterId: validPlayers[0].id,
    };
    
    validPlayers.forEach(p => {
      newState.totalScores[p.id] = 0;
    });
    
    setSocialLadderState(newState);
  }, [players, setSocialLadderState]);

  const setPlayerSelfPosition = useCallback((playerId: number, position: number) => {
    const state = getSocialLadderState();
    if (!state || state.rounds.length === 0) return;

    const currentRound = state.rounds[state.rounds.length - 1];
    currentRound.playerSelfPositions[playerId] = position;
    
    setSocialLadderState(state);
  }, [getSocialLadderState, setSocialLadderState]);

  const setMasterRanking = useCallback((ranking: RankPosition[]) => {
    const state = getSocialLadderState();
    if (!state || state.rounds.length === 0) return;

    const currentRound = state.rounds[state.rounds.length - 1];
    currentRound.masterPositions = ranking;
    
    setSocialLadderState(state);
  }, [getSocialLadderState, setSocialLadderState]);

  const completeRound = useCallback(() => {
    const state = getSocialLadderState();
    if (!state || state.rounds.length === 0) return;

    const currentRound = state.rounds[state.rounds.length - 1];
    const masterId = currentRound.masterId;
    
    // Calcola punti per ogni giocatore NON-Master
    const nonMasterPlayers = state.players.filter(p => p.id !== masterId);
    let allPlayersCorrect = true;
    
    nonMasterPlayers.forEach(player => {
      const playerPosition = currentRound.playerSelfPositions[player.id];
      const masterPosition = currentRound.masterPositions.find(p => p.playerId === player.id)?.position;
      
      if (playerPosition === masterPosition) {
        currentRound.roundScores[player.id] = 1;
        state.totalScores[player.id] += 1;
      } else {
        currentRound.roundScores[player.id] = 0;
        allPlayersCorrect = false;
      }
    });

    // Inizializza punteggio Master a 0
    currentRound.roundScores[masterId] = 0;

    // Bonus Master: se tutti i giocatori non-Master hanno indovinato, il Master guadagna 2 punti
    if (allPlayersCorrect && nonMasterPlayers.length > 0) {
      currentRound.roundScores[masterId] = 2;
      state.totalScores[masterId] = (state.totalScores[masterId] || 0) + 2;
    }

    currentRound.completed = true;
    state.gameState = 'results';
    
    setSocialLadderState(state);
  }, [getSocialLadderState, setSocialLadderState]);

  const startNextRound = useCallback((question: string) => {
    const state = getSocialLadderState();
    if (!state) return;

    const currentMasterIndex = state.players.findIndex(p => p.id === state.masterId);
    const nextMasterIndex = (currentMasterIndex + 1) % state.players.length;
    const nextMasterId = state.players[nextMasterIndex].id;

    const nextRoundNumber = state.currentRound + 1;
    
    const newRound: SocialLadderRound = {
      roundNumber: nextRoundNumber,
      questionId: `q_${Date.now()}`,
      question,
      masterId: nextMasterId,
      playerSelfPositions: {},
      playerPositions: [],
      masterPositions: [],
      roundScores: {},
      completed: false,
    };

    state.players.forEach(p => {
      newRound.roundScores[p.id] = 0;
      newRound.playerSelfPositions[p.id] = 0;
    });
    
    state.currentRound = nextRoundNumber;
    state.masterId = nextMasterId;
    state.rounds.push(newRound);
    state.gameState = 'voting';
    
    setSocialLadderState(state);
  }, [getSocialLadderState, setSocialLadderState]);

  const endGame = useCallback(() => {
    const state = getSocialLadderState();
    if (!state) return;

    state.gameState = 'game_over';
    setSocialLadderState(state);
  }, [getSocialLadderState, setSocialLadderState]);

  const resetSocialLadderState = useCallback(() => {
    setSocialLadderState(null);
  }, [setSocialLadderState]);

  return (
    <GameContext.Provider
      value={{
        players,
        setPlayers,
        addPlayer,
        removePlayer,
        updatePlayerName,
        resetGame,
        socialLadderState,
        initializeGame,
        setPlayerSelfPosition,
        setMasterRanking,
        completeRound,
        startNextRound,
        endGame,
        resetSocialLadderState,
        totalRounds: 5,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
