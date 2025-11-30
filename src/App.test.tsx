import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { vi } from 'vitest';

// Mock Ionic components and icons to prevent errors in test environment
vi.mock('@ionic/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ionic/react')>();
  const MockIonComponent = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;

  return {
    ...actual,
    IonApp: MockIonComponent,
    IonRouterOutlet: MockIonComponent,
    IonTabs: MockIonComponent,
    IonTabBar: MockIonComponent,
    IonTabButton: MockIonComponent,
    IonIcon: MockIonComponent,
    IonLabel: MockIonComponent,
    IonSpinner: () => <div>Loading...</div>,
    setupIonicReact: vi.fn(),
  };
});

vi.mock('ionicons/icons', () => ({
  ellipse: '',
  square: '',
  triangle: '',
  trash: '',
  checkmark: '',
  arrowBack: '',
  home: '',
  refresh: '',
  gameController: '',
  statsChart: '',
  settings: '',
  people: '',
}));

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});

