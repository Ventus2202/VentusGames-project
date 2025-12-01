import { useState, useCallback } from 'react';
import { Player } from '../types/Player';
import { LupusGameState, LupusPlayer, LupusRole, LupusGamePhase, DeathCause } from '../types/Lupus';
import { shuffle } from '../utils/array';

const LUPUS_STORAGE_KEY = 'lupusState';

export const useLupusGame = (initialPlayers: Player[]) => {
  const [gameState, setGameStateInternal] = useState<LupusGameState | null>(() => {
    try {
      const saved = sessionStorage.getItem(LUPUS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to parse lupus state from sessionStorage", error);
      return null;
    }
  });

  const setGameState = useCallback((state: LupusGameState | null) => {
    try {
      if (state) {
        sessionStorage.setItem(LUPUS_STORAGE_KEY, JSON.stringify(state));
      } else {
        sessionStorage.removeItem(LUPUS_STORAGE_KEY);
      }
      setGameStateInternal(state);
    } catch (error) {
      console.error("Failed to save lupus state to sessionStorage", error);
    }
  }, []);

  const startLupusGame = useCallback((specialRoles: LupusRole[] = []) => {
    if (initialPlayers.length < 5) return;

    const playerCount = initialPlayers.length;
    let wolfCount = 1;
    if (playerCount >= 8 && playerCount <= 11) wolfCount = 2;
    if (playerCount >= 12) wolfCount = 3;

    const roles: LupusRole[] = [];
    
    // Add mandatory roles
    roles.push('Veggente');
    roles.push('Guardia');

    // Add wolves
    for (let i = 0; i < wolfCount; i++) {
      roles.push('Lupo');
    }

    // Add special roles
    roles.push(...specialRoles);

    // Fill rest with Civilians
    while (roles.length < playerCount) {
      roles.push('Civile');
    }
    
    if (roles.length > playerCount) {
        console.warn("More roles than players! Trimming roles.");
        roles.length = playerCount;
    }

    const shuffledRoles = shuffle(roles);
    const shuffledPlayers = shuffle([...initialPlayers]);

    const gamePlayers: LupusPlayer[] = shuffledPlayers.map((player, index) => ({
      ...player,
      role: shuffledRoles[index],
      isAlive: true,
      deathCause: 'NONE',
      isLover: false
    }));

    setGameState({
      phase: 'ROLE_REVEAL',
      players: gamePlayers,
      currentRevealIndex: 0,
      lovers: []
    });
  }, [initialPlayers, setGameState]);

  const nextReveal = useCallback(() => {
    if (!gameState) return;
    
    if (gameState.currentRevealIndex < gameState.players.length - 1) {
      setGameState({
        ...gameState,
        currentRevealIndex: gameState.currentRevealIndex + 1,
      });
    } else {
      setGameState({
        ...gameState,
        phase: 'GAME',
      });
    }
  }, [gameState, setGameState]);

  const checkForWin = (players: LupusPlayer[]): LupusGamePhase => {
      const aliveWolves = players.filter(p => p.isAlive && p.role === 'Lupo').length;
      const aliveGood = players.filter(p => p.isAlive && p.role !== 'Lupo').length;
      const deadGiullareByVote = players.find(p => !p.isAlive && p.role === 'Giullare' && p.deathCause === 'VOTE');

      if (deadGiullareByVote) return 'GAME_OVER';
      if (aliveWolves === 0) return 'GAME_OVER';
      if (aliveWolves >= aliveGood) return 'GAME_OVER';
      
      return 'GAME';
  };

  const killPlayer = useCallback((playerId: number, cause: DeathCause) => {
    if (!gameState) return;

    let updatedPlayers = gameState.players.map(p => 
      p.id === playerId ? { ...p, isAlive: false, deathCause: cause } : p
    );

    // Handle Lovers (Cupido)
    const killedPlayer = updatedPlayers.find(p => p.id === playerId);
    if (killedPlayer && killedPlayer.isLover) {
        // Find the other lover
        const otherLover = updatedPlayers.find(p => p.isLover && p.id !== playerId && p.isAlive);
        if (otherLover) {
            updatedPlayers = updatedPlayers.map(p => 
                p.id === otherLover.id ? { ...p, isAlive: false, deathCause: 'HEARTBREAK' as DeathCause } : p
            );
        }
    }

    const nextPhase = checkForWin(updatedPlayers);

    setGameState({
      ...gameState,
      players: updatedPlayers,
      phase: nextPhase,
    });
  }, [gameState, setGameState]);

  const revivePlayer = useCallback((playerId: number) => {
    if (!gameState) return;

    const updatedPlayers = gameState.players.map(p => 
      p.id === playerId ? { ...p, isAlive: true, deathCause: 'NONE' as DeathCause } : p
    );

    const nextPhase = checkForWin(updatedPlayers);

    setGameState({
      ...gameState,
      players: updatedPlayers,
      phase: nextPhase,
    });
  }, [gameState, setGameState]);

  const setLovers = useCallback((playerIds: number[]) => {
      if (!gameState) return;
      const updatedPlayers = gameState.players.map(p => ({
          ...p,
          isLover: playerIds.includes(p.id)
      }));
      
      setGameState({
          ...gameState,
          lovers: playerIds,
          players: updatedPlayers
      });
  }, [gameState, setGameState]);

  const resetGame = useCallback(() => {
    setGameState(null);
  }, [setGameState]);

  return {
    gameState,
    startLupusGame,
    nextReveal,
    killPlayer,
    revivePlayer,
    setLovers,
    resetGame
  };
};
