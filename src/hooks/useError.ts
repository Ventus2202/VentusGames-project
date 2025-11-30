import { useContext } from 'react';
import { ErrorContext, ErrorContextType } from '../context/ErrorContextObject';

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
