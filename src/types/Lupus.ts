import { Player } from './Player';

export type LupusRole = 'Civile' | 'Lupo' | 'Veggente' | 'Guardia' | 'Strega' | 'Indemoniato' | 'Giullare' | 'Cupido' | 'Gufo';

export type DeathCause = 'VOTE' | 'NIGHT_KILL' | 'HEARTBREAK' | 'NONE';

export interface LupusPlayer extends Player {
  role: LupusRole;
  isAlive: boolean;
  deathCause: DeathCause;
  isLover: boolean; // If true, linked to another lover
}

export type LupusGamePhase = 'LOBBY' | 'ROLE_REVEAL' | 'GAME' | 'GAME_OVER';

export interface LupusGameState {
  phase: LupusGamePhase;
  players: LupusPlayer[];
  currentRevealIndex: number;
  lovers: number[]; // IDs of the two lovers
}
