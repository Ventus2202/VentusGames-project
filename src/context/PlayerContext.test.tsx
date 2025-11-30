import { render, screen, act } from '@testing-library/react';
import { PlayerProvider } from './PlayerContext';
import { usePlayers } from '../hooks/usePlayers';

// A test component to interact with the context
const TestComponent: React.FC = () => {
  const {
    players,
    addPlayer,
    updatePlayerName,
    removePlayer,
  } = usePlayers();

  return (
    <div>
      <div data-testid="players-count">{players.length}</div>
      <ul>
        {players.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      <button onClick={() => addPlayer()}>Add Player</button>
      <button onClick={() => players.length > 0 && updatePlayerName(players[0].id, 'New Name')}>Update</button>
      <button onClick={() => players.length > 0 && removePlayer(players[0].id)}>Remove</button>
    </div>
  );
};

// Helper to render the component within the provider
const renderWithProvider = () => {
  render(
    <PlayerProvider>
      <TestComponent />
    </PlayerProvider>
  );
};

describe('PlayerContext', () => {
  beforeEach(() => {
    // Mock any storage if needed in the future
  });

  it('should have correct initial state', () => {
    renderWithProvider();
    expect(screen.getByTestId('players-count').textContent).toBe('3');
  });

  it('should add a new player', () => {
    renderWithProvider();
    act(() => {
      screen.getByText('Add Player').click();
    });
    expect(screen.getByTestId('players-count').textContent).toBe('4');
  });

  it('should not add more than 20 players', () => {
    renderWithProvider();
    // The initial state is 3, we add 17 players to reach 20.
    for (let i = 0; i < 17; i++) {
      act(() => {
        screen.getByText('Add Player').click();
      });
    }
    expect(screen.getByTestId('players-count').textContent).toBe('20');
    // Try adding one more
    act(() => {
        screen.getByText('Add Player').click();
    });
    expect(screen.getByTestId('players-count').textContent).toBe('20');
  });

  it('should update a player name', () => {
    renderWithProvider();
    act(() => {
      screen.getByText('Update').click();
    });
    expect(screen.getByText('New Name')).toBeInTheDocument();
  });

  it('should remove a player', () => {
    renderWithProvider();
    act(() => {
      screen.getByText('Remove').click();
    });
    expect(screen.getByTestId('players-count').textContent).toBe('2');
  });
  
  it('should not remove if less than 3 players', () => {
    renderWithProvider();
    // Remove first player, leaving 2
    act(() => {
      screen.getByText('Remove').click();
    });
     // Try to remove again
    act(() => {
      screen.getByText('Remove').click();
    });
    // Should still be 2
    expect(screen.getByTestId('players-count').textContent).toBe('2');
  });
});

