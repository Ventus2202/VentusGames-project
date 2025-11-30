import { useState, useCallback } from 'react';
import { SocialLadderState, SocialLadderRound, RankPosition } from '../types/SocialLadder';
import { Player } from '../types/Player';
import { useError } from './useError';

const STORAGE_KEY = 'socialLadderState';

export const useSocialLadderGame = (players: Player[]) => {
  const { setError } = useError();
  // Inizializza lo stato da sessionStorage
  const [socialLadderState, setSocialLadderStateInternal] = useState<SocialLadderState | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      setError("Impossibile caricare lo stato del gioco.");
      return null;
    }
  });

  // Aggiorna sia sessionStorage che lo stato React
  const setSocialLadderState = useCallback((state: SocialLadderState | null) => {
    try {
      if (state) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
      setSocialLadderStateInternal(state);
    } catch (error) {
        setError("Impossibile salvare lo stato del gioco.");
    }
  }, [setError]);

  const initializeGame = useCallback((question: string) => {
    const validPlayers = players.filter(p => p.name.trim() !== '');
    
    if (validPlayers.length < 3) {
      setError("Sono necessari almeno 3 giocatori per iniziare.");
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
  }, [players, setSocialLadderState, setError]);
  
  // ... (rest of the file is unchanged)
  

  const setPlayerSelfPosition = useCallback((playerId: number, position: number) => {
    const state = socialLadderState;
    if (!state || state.rounds.length === 0) return;

    const currentRound = state.rounds[state.rounds.length - 1];
    currentRound.playerSelfPositions[playerId] = position;
    
    setSocialLadderState({ ...state });
  }, [socialLadderState, setSocialLadderState]);

  const setMasterRanking = useCallback((ranking: RankPosition[]) => {
    const state = socialLadderState;
    if (!state || state.rounds.length === 0) return;

    const currentRound = state.rounds[state.rounds.length - 1];
    currentRound.masterPositions = ranking;
    
    setSocialLadderState({ ...state });
  }, [socialLadderState, setSocialLadderState]);

  const completeRound = useCallback(() => {
    const state = socialLadderState;
    if (!state || state.rounds.length === 0) return;

    const currentRound = state.rounds[state.rounds.length - 1];
    const masterId = currentRound.masterId;
    
    const nonMasterPlayers = state.players.filter(p => p.id !== masterId);
    let allPlayersCorrect = true;
    
    nonMasterPlayers.forEach(player => {
      const playerPosition = currentRound.playerSelfPositions[player.id];
      const masterPosition = currentRound.masterPositions.find(p => p.playerId === player.id)?.position;
      
      if (playerPosition === masterPosition) {
        currentRound.roundScores[player.id] = 1;
        state.totalScores[player.id] = (state.totalScores[player.id] || 0) + 1;
      } else {
        currentRound.roundScores[player.id] = 0;
        allPlayersCorrect = false;
      }
    });

    currentRound.roundScores[masterId] = 0;

    if (allPlayersCorrect && nonMasterPlayers.length > 0) {
      currentRound.roundScores[masterId] = 2;
      state.totalScores[masterId] = (state.totalScores[masterId] || 0) + 2;
    }

    currentRound.completed = true;
    state.gameState = 'results';
    
    setSocialLadderState({ ...state });
  }, [socialLadderState, setSocialLadderState]);

  const startNextRound = useCallback((question: string) => {
    const state = socialLadderState;
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
    
    setSocialLadderState({ ...state });
  }, [socialLadderState, setSocialLadderState]);

  const endGame = useCallback(() => {
    const state = socialLadderState;
    if (!state) return;

    state.gameState = 'game_over';
    setSocialLadderState({ ...state });
  }, [socialLadderState, setSocialLadderState]);

  const resetSocialLadderState = useCallback(() => {
    setSocialLadderState(null);
  }, [setSocialLadderState]);

  return {
    socialLadderState,
    initializeGame,
    setPlayerSelfPosition,
    setMasterRanking,
    completeRound,
    startNextRound,
    endGame,
    resetSocialLadderState,
  };
};
