import React, { useState, useCallback, ReactNode } from 'react';
import { ErrorContext } from './ErrorContextObject';
import { IonToast } from '@ionic/react';

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
      <IonToast
        isOpen={!!error}
        message={error || ''}
        onDidDismiss={clearError}
        duration={5000}
        color="danger"
        position="top"
      />
    </ErrorContext.Provider>
  );
};
