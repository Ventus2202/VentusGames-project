import { useState, useCallback } from 'react';
import { Player } from '../types/Player';
import { ImpostorState, ImpostorPlayer, Role, GamePhase } from '../types/Impostor';
import { shuffle } from '../utils/array';

interface WordPair {
  civilian: string;
  spy: string;
}

const IMPOSTOR_STORAGE_KEY = 'impostorState';

export const useImpostorGame = (initialPlayers: Player[], wordPairs: WordPair[]) => {
  const [impostorState, setImpostorStateInternal] = useState<ImpostorState | null>(() => {
    try {
      const saved = sessionStorage.getItem(IMPOSTOR_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to parse impostor state from sessionStorage", error);
      return null;
    }
  });

  const setImpostorState = useCallback((state: ImpostorState | null) => {
    try {
      if (state) {
        sessionStorage.setItem(IMPOSTOR_STORAGE_KEY, JSON.stringify(state));
      } else {
        sessionStorage.removeItem(IMPOSTOR_STORAGE_KEY);
      }
      setImpostorStateInternal(state);
    } catch (error) {
        console.error("Failed to save impostor state to sessionStorage", error);
    }
  }, []);

  const initializeImpostorGame = useCallback((impostorCount: number, spyCount: number) => {
    if (initialPlayers.length < 4 || wordPairs.length === 0) { // Changed from 3 to 4
      return;
    }

    const shuffledPlayers = shuffle([...initialPlayers]);
    const wordPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
    
    const gamePlayers: ImpostorPlayer[] = [];

    // Assign roles
    for (let i = 0; i < shuffledPlayers.length; i++) {
      const player = shuffledPlayers[i];
      let role: Role;
      let word: string | null;

      if (i < impostorCount) {
        role = 'Impostor';
        word = null;
      } else if (i < impostorCount + spyCount) {
        role = 'Spy';
        word = wordPair.spy;
      } else {
        role = 'Civilian';
        word = wordPair.civilian;
      }

      gamePlayers.push({
        ...player,
        role,
        word,
        isEliminated: false,
      });
    }

    const finalPlayers = shuffle(gamePlayers);

    const newState: ImpostorState = {
      players: finalPlayers,
      gameState: 'role_reveal',
      wordPair,
      currentPlayerIndex: 0,
      eliminatedPlayerId: null,
      gameWinner: null,
    };

    setImpostorState(newState);

  }, [initialPlayers, wordPairs, setImpostorState]);

  const setPhase = (phase: GamePhase) => {
    if (!impostorState) return;
    setImpostorState({ ...impostorState, gameState: phase });
  };

  const eliminatePlayer = (playerId: number) => {
    if (!impostorState) return;

    const playerToEliminate = impostorState.players.find(p => p.id === playerId);
    if (!playerToEliminate) {
        console.error("Player to eliminate not found:", playerId);
        return;
    }

    const updatedPlayers = impostorState.players.map(p =>
      p.id === playerId ? { ...p, isEliminated: true } : p
    );

    const remainingImpostors = updatedPlayers.filter(p => !p.isEliminated && p.role === 'Impostor').length;
    const remainingNonImpostors = updatedPlayers.filter(p => !p.isEliminated && p.role !== 'Impostor').length;

    // Check for Civilian win (all impostors eliminated)
    if (remainingImpostors === 0) {
      setImpostorState({
        ...impostorState,
        players: updatedPlayers,
        eliminatedPlayerId: playerId,
        gameWinner: 'Civilians',
        gameState: 'game_over',
      });
      return;
    }

    // Check for Impostor win (impostors outnumber or equal non-impostors)
    if (remainingImpostors >= remainingNonImpostors) {
      setImpostorState({
        ...impostorState,
        players: updatedPlayers,
        eliminatedPlayerId: playerId,
        gameWinner: 'Impostor',
        gameState: 'game_over',
      });
      return;
    }

    // If game continues
    setImpostorState({
      ...impostorState,
      players: updatedPlayers,
      eliminatedPlayerId: playerId,
      gameState: 'elimination_result',
    });
  };

  const nextRound = () => {
    if (!impostorState) return;
    setImpostorState({
        ...impostorState,
        eliminatedPlayerId: null,
        gameState: 'voting',
    });
  };

  const resetImpostorGame = useCallback(() => {
    setImpostorState(null);
  }, [setImpostorState]);

  return {
    impostorState,
    initializeImpostorGame,
    resetImpostorGame,
    eliminatePlayer,
    nextRound,
    setPhase,
  };
};