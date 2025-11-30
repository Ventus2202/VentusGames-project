import { Redirect, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import {
  IonApp,
  IonRouterOutlet,
  IonSpinner,
  setupIonicReact,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { gameController, settings, people } from 'ionicons/icons';
import { PlayerProvider } from './context/PlayerContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const GamesList = lazy(() => import('./pages/GamesList'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SocialLadderLobby = lazy(() => import('./pages/SocialLadderLobby'));
const SocialLadderGame = lazy(() => import('./pages/SocialLadderGame'));
const PsychologistLobby = lazy(() => import('./pages/PsychologistLobby'));
const PsychologistGame = lazy(() => import('./pages/PsychologistGame'));
const ImpostorLobby = lazy(() => import('./pages/ImpostorLobby'));
const ImpostorConfig = lazy(() => import('./pages/ImpostorConfig'));
const ImpostorGame = lazy(() => import('./pages/ImpostorGame'));
const MidnightMysteryLobby = lazy(() => import('./pages/MidnightMysteryLobby'));
const MidnightMysteryGame = lazy(() => import('./pages/MidnightMysteryGame'));


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <PlayerProvider>
      <ErrorBoundary>
        <IonReactRouter>
          <Suspense fallback={<IonSpinner name="bubbles" />}>
            <IonRouterOutlet>
              {/* Routes that are not part of the main tabs */}
              <Route exact path="/social-ladder-lobby" component={SocialLadderLobby} />
              <Route exact path="/social-ladder-game" component={SocialLadderGame} />
              <Route exact path="/psychologist-lobby" component={PsychologistLobby} />
              <Route exact path="/psychologist-game" component={PsychologistGame} />
              <Route exact path="/impostor-lobby" component={ImpostorLobby} />
              <Route exact path="/impostor-config" component={ImpostorConfig} />
              <Route exact path="/impostor-game" component={ImpostorGame} />
              <Route exact path="/midnight-mystery-lobby" component={MidnightMysteryLobby} />
              <Route exact path="/midnight-mystery-game" component={MidnightMysteryGame} />
              
              {/* Main app with tabs */}
              <Route path="/:tab(players|games|settings)" render={() => <Tabs />} />
              <Route exact path="/" render={() => <Redirect to="/players" />} />
            </IonRouterOutlet>
          </Suspense>
        </IonReactRouter>
      </ErrorBoundary>
    </PlayerProvider>
  </IonApp>
);

const Tabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/players" component={Home} />
      <Route exact path="/games" component={GamesList} />
      <Route exact path="/settings" component={SettingsPage} />
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="players" href="/players">
        <IonIcon icon={people} />
        <IonLabel>Giocatori</IonLabel>
      </IonTabButton>
      <IonTabButton tab="games" href="/games">
        <IonIcon icon={gameController} />
        <IonLabel>Giochi</IonLabel>
      </IonTabButton>
      <IonTabButton tab="settings" href="/settings">
        <IonIcon icon={settings} />
        <IonLabel>Impostazioni</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default App;

