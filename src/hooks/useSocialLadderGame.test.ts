import { renderHook, act } from '@testing-library/react';
import { useSocialLadderGame } from './useSocialLadderGame';
import { Player } from '../types/Player';
import { RankPosition } from '../types/SocialLadder';
import { ErrorProvider } from '../context/ErrorContext';

const mockPlayers: Player[] = [
  { id: 1, name: 'Player 1' },
  { id: 2, name: 'Player 2' },
  { id: 3, name: 'Player 3' },
];

describe('useSocialLadderGame', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('dovrebbe inizializzare con uno stato nullo', () => {
    const { result } = renderHook(() => useSocialLadderGame(mockPlayers), {
      wrapper: ErrorProvider,
    });
    expect(result.current.socialLadderState).toBeNull();
  });

  it('dovrebbe inizializzare il gioco correttamente', () => {
    const { result } = renderHook(() => useSocialLadderGame(mockPlayers), {
      wrapper: ErrorProvider,
    });

    act(() => {
      result.current.initializeGame('Test question');
    });

    const state = result.current.socialLadderState;
    expect(state).not.toBeNull();
    expect(state?.gameState).toBe('voting');
    expect(state?.players).toEqual(mockPlayers);
    expect(state?.currentRound).toBe(1);
    expect(state?.rounds.length).toBe(1);
    expect(state?.rounds[0].question).toBe('Test question');
    expect(state?.rounds[0].masterId).toBe(1);
    expect(Object.keys(state?.totalScores ?? {}).length).toBe(3);
  });

  it('dovrebbe impostare la posizione scelta dal giocatore', () => {
    const { result } = renderHook(() => useSocialLadderGame(mockPlayers), {
      wrapper: ErrorProvider,
    });
    act(() => {
      result.current.initializeGame('Test question');
    });

    act(() => {
      result.current.setPlayerSelfPosition(2, 1);
    });

    const state = result.current.socialLadderState;
    expect(state?.rounds[0].playerSelfPositions[2]).toBe(1);
  });

  it('dovrebbe impostare la classifica del master', () => {
    const { result } = renderHook(() => useSocialLadderGame(mockPlayers), {
      wrapper: ErrorProvider,
    });
    act(() => {
      result.current.initializeGame('Test question');
    });

    const ranking: RankPosition[] = [
      { playerId: 2, position: 1 },
      { playerId: 3, position: 2 },
    ];

    act(() => {
      result.current.setMasterRanking(ranking);
    });

    const state = result.current.socialLadderState;
    expect(state?.rounds[0].masterPositions).toEqual(ranking);
  });

  it('dovrebbe completare il round e calcolare i punteggi', () => {
    const { result } = renderHook(() => useSocialLadderGame(mockPlayers), {
      wrapper: ErrorProvider,
    });
    act(() => {
      result.current.initializeGame('Test question');
    });

    act(() => {
      result.current.setPlayerSelfPosition(2, 1);
      result.current.setPlayerSelfPosition(3, 2);
    });

    const ranking: RankPosition[] = [
      { playerId: 2, position: 1 },
      { playerId: 3, position: 2 },
    ];

    act(() => {
      result.current.setMasterRanking(ranking);
    });

    act(() => {
      result.current.completeRound();
    });

    const state = result.current.socialLadderState;
    expect(state?.gameState).toBe('results');
    expect(state?.rounds[0].completed).toBe(true);
    expect(state?.totalScores[1]).toBe(2); // Master score
    expect(state?.totalScores[2]).toBe(1); // Player 2 score
    expect(state?.totalScores[3]).toBe(1); // Player 3 score
  });

  it('dovrebbe iniziare un nuovo round', () => {
    const { result } = renderHook(() => useSocialLadderGame(mockPlayers), {
      wrapper: ErrorProvider,
    });
    act(() => {
      result.current.initializeGame('Test question');
    });

    act(() => {
      result.current.startNextRound('New test question');
    });
    
    const state = result.current.socialLadderState;
    expect(state?.currentRound).toBe(2);
    expect(state?.rounds.length).toBe(2);
    expect(state?.masterId).toBe(2);
    expect(state?.rounds[1].question).toBe('New test question');
    expect(state?.gameState).toBe('voting');
  });

  it('dovrebbe terminare il gioco', () => {
    const { result } = renderHook(() => useSocialLadderGame(mockPlayers), {
      wrapper: ErrorProvider,
    });
    act(() => {
      result.current.initializeGame('Test question');
    });

    act(() => {
      result.current.endGame();
    });

    const state = result.current.socialLadderState;
    expect(state?.gameState).toBe('game_over');
  });

  it('dovrebbe resettare lo stato del gioco', () => {
    const { result } = renderHook(() => useSocialLadderGame(mockPlayers), {
      wrapper: ErrorProvider,
    });
    act(() => {
      result.current.initializeGame('Test question');
    });

    act(() => {
      result.current.resetSocialLadderState();
    });

    expect(result.current.socialLadderState).toBeNull();
  });
});
