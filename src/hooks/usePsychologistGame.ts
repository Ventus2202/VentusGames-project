import { useState, useCallback } from 'react';
import { PsychologistState, PsychologistRound } from '../types/Psychologist';
import { Player } from '../types/Player';

const PSYCHOLOGIST_STORAGE_KEY = 'psychologistState';

export const usePsychologistGame = (players: Player[]) => {
  const [psychologistState, setPsychologistStateInternal] = useState<PsychologistState | null>(() => {
    try {
      const saved = sessionStorage.getItem(PSYCHOLOGIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to parse psychologist state from sessionStorage", error);
      return null;
    }
  });

  const setPsychologistState = useCallback((state: PsychologistState | null) => {
    try {
      if (state) {
        sessionStorage.setItem(PSYCHOLOGIST_STORAGE_KEY, JSON.stringify(state));
      } else {
        sessionStorage.removeItem(PSYCHOLOGIST_STORAGE_KEY);
      }
      setPsychologistStateInternal(state);
    } catch (error) {
        console.error("Failed to save psychologist state to sessionStorage", error);
    }
  }, []);

  const initializePsychologistGame = useCallback((symptom: string) => {
    const validPlayers = players.filter(p => p.name.trim() !== '');
    
    if (validPlayers.length < 3) {
      setPsychologistState(null);
      return;
    }

    const firstRound: PsychologistRound = {
      roundNumber: 1,
      symptom,
      psychologistId: validPlayers[0].id,
      symptomRevealed: false,
      guesses: [],
      psychologistGuess: null,
      psychologistCorrect: null,
      completed: false,
    };

    const newState: PsychologistState = {
      gameState: 'symptom_display',
      players: validPlayers,
      currentRound: 1,
      rounds: [firstRound],
      totalScores: {},
      psychologistId: validPlayers[0].id,
      currentPhase: 'symptom_display',
      currentQuestionCount: 0,
    };
    
    validPlayers.forEach(p => {
      newState.totalScores[p.id] = 0;
    });
    
    setPsychologistState(newState);
  }, [players, setPsychologistState]);

  const setPsychologistGuess = useCallback((guess: string) => {
    const state = psychologistState;
    if (!state || state.rounds.length === 0) return;

    const currentRound = state.rounds[state.rounds.length - 1];
    currentRound.psychologistGuess = guess;
    
    setPsychologistState({ ...state });
  }, [psychologistState, setPsychologistState]);

  const completePsychologistRound = useCallback((psychologistCorrect: boolean) => {
    const state = psychologistState;
    if (!state || state.rounds.length === 0) return;

    const currentRound = state.rounds[state.rounds.length - 1];
    const psychologistId = currentRound.psychologistId;
    
    currentRound.psychologistCorrect = psychologistCorrect;
    
    if (psychologistCorrect) {
      state.totalScores[psychologistId] = (state.totalScores[psychologistId] || 0) + 1;
    } else {
      const patients = state.players.filter(p => p.id !== psychologistId);
      patients.forEach(patient => {
        state.totalScores[patient.id] = (state.totalScores[patient.id] || 0) + 1;
      });
    }
    
    currentRound.completed = true;
    state.gameState = 'results';
    
    setPsychologistState({ ...state });
  }, [psychologistState, setPsychologistState]);

  const startNextPsychologistRound = useCallback((symptom: string) => {
    const state = psychologistState;
    if (!state) return;

    const currentPsychologistIndex = state.players.findIndex(p => p.id === state.psychologistId);
    const nextPsychologistIndex = (currentPsychologistIndex + 1) % state.players.length;
    const nextPsychologistId = state.players[nextPsychologistIndex].id;

    const nextRoundNumber = state.currentRound + 1;
    
    const newRound: PsychologistRound = {
      roundNumber: nextRoundNumber,
      symptom,
      psychologistId: nextPsychologistId,
      symptomRevealed: false,
      guesses: [],
      psychologistGuess: null,
      psychologistCorrect: null,
      completed: false,
    };
    
    state.currentRound = nextRoundNumber;
    state.psychologistId = nextPsychologistId;
    state.rounds.push(newRound);
    state.gameState = 'symptom_display';
    state.currentPhase = 'symptom_display';
    state.currentQuestionCount = 0;
    
    setPsychologistState({ ...state });
  }, [psychologistState, setPsychologistState]);

  const endPsychologistGame = useCallback(() => {
    const state = psychologistState;
    if (!state) return;

    state.gameState = 'game_over';
    setPsychologistState({ ...state });
  }, [psychologistState, setPsychologistState]);

  const resetPsychologistState = useCallback(() => {
    setPsychologistState(null);
  }, [setPsychologistState]);

  const startPsychologistQuestioning = useCallback(() => {
    const state = psychologistState;
    if (!state) return;
    
    state.gameState = 'questioning';
    setPsychologistState({ ...state });
  }, [psychologistState, setPsychologistState]);

  const skipSymptom = useCallback((allQuestions: string[]) => {
    const state = psychologistState;
    if (!state || allQuestions.length <= 1) return;

    const currentRound = state.rounds[state.rounds.length - 1];
    const currentSymptom = currentRound.symptom;
    
    let newSymptom = currentSymptom;
    while (newSymptom === currentSymptom) {
      newSymptom = allQuestions[Math.floor(Math.random() * allQuestions.length)];
    }

    currentRound.symptom = newSymptom;
    setPsychologistState({ ...state });
  }, [psychologistState, setPsychologistState]);

  return {
    psychologistState,
    initializePsychologistGame,
    resetPsychologistState,
    startPsychologistQuestioning,
    setPsychologistGuess,
    completePsychologistRound,
    startNextPsychologistRound,
    endPsychologistGame,
    skipSymptom,
  };
};
