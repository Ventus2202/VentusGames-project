import React, { Component, ErrorInfo, ReactNode } from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <IonPage>
          <IonContent className="ion-padding">
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h2>Oops! Qualcosa è andato storto.</h2>
              <p>Si è verificato un errore inaspettato nell'applicazione.</p>
              <pre style={{ textAlign: 'left', background: '#f4f4f4', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {this.state.error?.toString()}
              </pre>
              <IonButton onClick={this.handleReload} expand="block" style={{ marginTop: '20px' }}>
                Ricarica l'App
              </IonButton>
            </div>
          </IonContent>
        </IonPage>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
