import { useError } from './useError';

// Chiavi per LocalStorage
export const STORAGE_KEYS = {
  GAME_SESSIONS: 'ventus_game_sessions',
  PLAYER_STATS: 'ventus_player_stats',
  LAST_GAME: 'ventus_last_game',
} as const;

export interface GameSession {
  id: string;
  date: string;
  players: string[];
  rounds: number;
  winner: string;
  totalScore: number;
}

export interface PlayerStats {
  name: string;
  totalGamesWon: number;
  totalGamesPlayed: number;
  totalVentusPoints: number;
  averageScore: number;
}

/**
 * Hook per gestire il salvataggio e il recupero dai dati dal localStorage
 */
export const useLocalStorage = () => {
  const { setError } = useError();

  const saveGameSession = (session: GameSession) => {
    try {
      const sessions = getGameSessions();
      sessions.push(session);
      localStorage.setItem(STORAGE_KEYS.GAME_SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      setError('Errore nel salvataggio della sessione.');
    }
  };

  const getGameSessions = (): GameSession[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAME_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      setError('Errore nel recupero delle sessioni.');
      return [];
    }
  };

  const savePlayerStats = (playerName: string, stats: PlayerStats) => {
    try {
      const allStats = getAllPlayerStats();
      const index = allStats.findIndex(s => s.name === playerName);
      if (index >= 0) {
        allStats[index] = stats;
      } else {
        allStats.push(stats);
      }
      localStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(allStats));
    } catch (error) {
      setError('Errore nel salvataggio delle statistiche.');
    }
  };

  const getAllPlayerStats = (): PlayerStats[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      setError('Errore nel recupero delle statistiche.');
      return [];
    }
  };

  const clearAllData = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.GAME_SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.PLAYER_STATS);
      localStorage.removeItem(STORAGE_KEYS.LAST_GAME);
    } catch (error) {
      setError('Errore nella cancellazione dei dati.');
    }
  };

  const getTotalGamesCount = (): number => {
    return getGameSessions().length;
  };

  const getTopPlayers = (limit: number = 5): PlayerStats[] => {
    return getAllPlayerStats()
      .sort((a, b) => b.totalVentusPoints - a.totalVentusPoints)
      .slice(0, limit);
  };

  return {
    saveGameSession,
    getGameSessions,
    savePlayerStats,
    getAllPlayerStats,
    clearAllData,
    getTotalGamesCount,
    getTopPlayers,
  };
};

export default useLocalStorage;
