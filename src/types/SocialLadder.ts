// Stato del gioco Social Ladder
export type GameState = 'lobby' | 'question' | 'voting' | 'master_voting' | 'results' | 'game_over';

// Rappresenta la posizione di un giocatore in una classifica
export interface RankPosition {
  playerId: number;
  position: number; // 1 = primo, 2 = secondo, etc.
}

// Stato di un turno di Social Ladder
export interface SocialLadderRound {
  roundNumber: number;
  questionId: string;
  question: string;
  masterId: number; // ID del giocatore Master
  // Mappa: playerId -> posizione scelta da quel giocatore per se stesso
  playerSelfPositions: Record<number, number>;
  // Manteniamo opzionalmente la vecchia struttura se servisse altrove
  playerPositions: RankPosition[]; // (deprecated) Posizioni aggregate giocatori
  masterPositions: RankPosition[]; // Posizioni indicate dal Master
  roundScores: Record<number, number>; // playerId -> punti ottenuti in questo round
  completed: boolean;
}

// Stato generale del gioco Social Ladder
export interface SocialLadderState {
  gameState: GameState;
  players: Array<{ id: number; name: string }>;
  currentRound: number;
  rounds: SocialLadderRound[];
  totalScores: Record<number, number>; // playerId -> Ventus Points totali
  masterId: number; // Master del turno corrente
}

// Domande predefinite (banco dati di domande)
export const SOCIAL_LADDER_QUESTIONS = [
  'Chi è il più capace di affrontare una situazione di crisi senza farsi prendere dal panico?',
  'Chi è il più simpatico del gruppo?',
  'Chi è il più affidabile e puntuale?',
  'Chi avrebbe più successo come influencer?',
  'Chi è il più creativo?',
  'Chi è il più avventuroso?',
  'Chi è il più intelligente?',
  'Chi darebbe i migliori consigli?',
  'Chi è il più divertente?',
  'Chi è il più leale?',
  'Chi è il più ambizioso?',
  'Chi è il più comprensivo?',
  'Chi sarebbe il miglior leader?',
  'Chi ha il miglior senso dell\'umorismo?',
  'Chi è il più introspettivo?',
];
