export interface PsychologistRound {
  roundNumber: number;
  symptom: string;
  psychologistId: number;
  symptomRevealed: boolean;
  guesses: { playerId: number; guess: string }[];
  psychologistGuess: string | null;
  psychologistCorrect: boolean | null;
  completed: boolean;
}

export interface PsychologistState {
  gameState: 'lobby' | 'symptom_display' | 'psychologist_away' | 'questioning' | 'guessing' | 'results' | 'game_over';
  players: Array<{ id: number; name: string }>;
  currentRound: number;
  rounds: PsychologistRound[];
  totalScores: { [playerId: number]: number };
  psychologistId: number;
  currentPhase: 'symptom_display' | 'questioning' | 'guessing' | 'results';
  currentQuestionCount: number;
}
