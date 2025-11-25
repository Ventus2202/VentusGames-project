import { createContext } from 'react';
import { Player } from '../types/Player';

export interface PlayerContextType {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  addPlayer: () => void;
  removePlayer: (id: number) => void;
  updatePlayerName: (id: number, name: string) => void;
  resetPlayers: () => void;
  totalRounds: number;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);
