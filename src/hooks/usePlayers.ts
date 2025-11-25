import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContextObject';

export const usePlayers = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayers must be used within PlayerProvider');
  }
  return context;
};
