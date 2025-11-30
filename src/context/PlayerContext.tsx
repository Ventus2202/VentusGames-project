import React, { useState, useCallback, ReactNode } from 'react';
import { Player } from '../types/Player';
import { PlayerContext } from './PlayerContextObject';

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: '' },
    { id: 2, name: '' },
    { id: 3, name: '' },
  ]);

  const addPlayer = useCallback(() => {
    setPlayers(prev => {
      if (prev.length >= 20) return prev;
      const newId = Math.max(...prev.map(p => p.id), 0) + 1;
      return [...prev, { id: newId, name: '' }];
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

  const resetPlayers = useCallback(() => {
    setPlayers([
      { id: 1, name: '' },
      { id: 2, name: '' },
      { id: 3, name: '' },
    ]);
  }, []);

  const validPlayers = players.filter(p => p.name.trim() !== '').length;
  const totalRounds = validPlayers;

  return (
    <PlayerContext.Provider
      value={{
        players,
        addPlayer,
        removePlayer,
        updatePlayerName,
        resetPlayers,
        totalRounds,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};



