import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import './RulesCard.css';

interface RulesCardProps {
  title?: string;
  rules: React.ReactNode[];
}

const RulesCard: React.FC<RulesCardProps> = ({ title = "Come funziona", rules }) => {
  return (
    <IonCard className="rules-card-component">
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <ol className="rules-list-component">
          {rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ol>
      </IonCardContent>
    </IonCard>
  );
};

export default RulesCard;
