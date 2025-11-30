import { renderHook, act } from '@testing-library/react';
import { usePsychologistGameFlow } from './usePsychologistGameFlow';
import { usePlayers } from '../hooks/usePlayers';
import { usePsychologistGame } from '../hooks/usePsychologistGame';
import usePsychologistQuestions from '../hooks/usePsychologistQuestions';
import { useHistory } from 'react-router-dom';
import { vi } from 'vitest';


vi.mock('../hooks/usePlayers');
vi.mock('../hooks/usePsychologistGame');
vi.mock('../hooks/usePsychologistQuestions');
vi.mock('react-router-dom', () => ({
  useHistory: vi.fn(),
}));

const mockUsePlayers = usePlayers as jest.Mock;
const mockUsePsychologistGame = usePsychologistGame as jest.Mock;
const mockUsePsychologistQuestions = usePsychologistQuestions as jest.Mock;
const mockUseHistory = useHistory as jest.Mock;

const mockInitialize = vi.fn();
const mockCompleteRound = vi.fn();
const mockStartNextRound = vi.fn();
const mockEndGame = vi.fn();
const mockStartQuestioning = vi.fn();
const mockSkipSymptom = vi.fn();

describe('usePsychologistGameFlow', () => {
  beforeEach(() => {
    mockUsePlayers.mockReturnValue({
      players: [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' },
      ],
      totalRounds: 2,
    });
    mockUsePsychologistGame.mockReturnValue({
      psychologistState: null,
      initializePsychologistGame: mockInitialize,
      completePsychologistRound: mockCompleteRound,
      startNextPsychologistRound: mockStartNextRound,
      endPsychologistGame: mockEndGame,
      startPsychologistQuestioning: mockStartQuestioning,
      skipSymptom: mockSkipSymptom,
    });
    mockUsePsychologistQuestions.mockReturnValue({
      questions: [{ id: '1', name: 'Symptom 1' }],
    });
    mockUseHistory.mockReturnValue({
      push: vi.fn(),
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('dovrebbe inizializzare correttamente', () => {
    const { result } = renderHook(() => usePsychologistGameFlow());
    expect(result.current.psychologistState).toBeNull();
    expect(result.current.showSymptomsPhase).toBe(false);
  });

  it('dovrebbe inizializzare il gioco', () => {
    renderHook(() => usePsychologistGameFlow());
    expect(mockInitialize).toHaveBeenCalledWith({ id: '1', name: 'Symptom 1' });
  });

  it('dovrebbe gestire il completamento di un round', () => {
    const { result } = renderHook(() => usePsychologistGameFlow());
    act(() => {
      result.current.handleRoundComplete(true);
    });
    expect(mockCompleteRound).toHaveBeenCalledWith(true);
  });

  it('dovrebbe gestire l\'inizio del round successivo', () => {
    const { result } = renderHook(() => usePsychologistGameFlow());
    act(() => {
      result.current.handleNextRound();
    });
    expect(mockStartNextRound).toHaveBeenCalledWith({ id: '1', name: 'Symptom 1' });
  });

  it('dovrebbe gestire la fine del gioco', () => {
    const { result } = renderHook(() => usePsychologistGameFlow());
    act(() => {
      result.current.handleEndGame();
    });
    expect(mockEndGame).toHaveBeenCalled();
  });

  it('dovrebbe gestire il salto del sintomo', () => {
    const { result } = renderHook(() => usePsychologistGameFlow());
    act(() => {
      result.current.handleSkipSymptom();
    });
    expect(mockSkipSymptom).toHaveBeenCalledWith([{ id: '1', name: 'Symptom 1' }]);
  });

  it('dovrebbe gestire la fase dei sintomi', () => {
    const { result } = renderHook(() => usePsychologistGameFlow());
    act(() => {
      result.current.handleSymptomsReady();
    });
    expect(mockStartQuestioning).toHaveBeenCalled();
  });
});
