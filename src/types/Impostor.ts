import { Player } from "./Player";

export type Role = 'Civilian' | 'Spy' | 'Impostor';

export interface ImpostorPlayer extends Player {
  role: Role;
  word: string | null;
  isEliminated: boolean;
}

export type GamePhase =
  | 'role_reveal'
  | 'voting'
  | 'elimination_result'
  | 'game_over';

export interface ImpostorState {
  players: ImpostorPlayer[];
  gameState: GamePhase;
  wordPair: {
    civilian: string;
    spy: string;
  };
  currentPlayerIndex: number;
  eliminatedPlayerId: number | null;
  gameWinner: Role | 'Civilians' | null;
}
