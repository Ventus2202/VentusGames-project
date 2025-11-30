import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem } from '@ionic/react';
import './Tab3.css';

const Tab3: React.FC = () => {


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>⚙️ Impostazioni</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="settings-content" fullscreen>
                  <IonCard className="settings-card">
                    <IonCardHeader>
                      <IonCardTitle>Informazioni e Supporto</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonList lines="none">
                        <IonItem button detail>
                          Contatta il supporto
                        </IonItem>
                        <IonItem button detail>
                          Privacy Policy
                        </IonItem>
                        <IonItem button detail>
                          Termini e condizioni
                        </IonItem>
                        <IonItem button detail>
                          Gestione del consenso
                        </IonItem>
                      </IonList>
                    </IonCardContent>
                  </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Tab3;
