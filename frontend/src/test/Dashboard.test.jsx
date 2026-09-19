import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { ThemeContext } from '../App';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Dashboard Component Tests', () => {
  const mockThemeContext = {
    theme: 'dark',
    toggleTheme: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({ name: 'Krishna Test' }));

    // Mock fetch for dashboard & history
    global.fetch = vi.fn((url, options) => {
      if (url.includes('/api/dashboard')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            recentRooms: [
              { id: 'ROOM01', title: 'Sprint Planning', participants: 3, lastActive: '10m ago' }
            ]
          })
        });
      }
      if (url.includes('/api/history')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            sessions: [
              { id: 'sess-1', roomId: 'ROOM01', title: 'Design Review', date: new Date().toISOString() }
            ]
          })
        });
      }
      if (url.includes('/api/room/VALID1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, roomId: 'VALID1' })
        });
      }
      if (url.includes('/api/room/NONEXIST')) {
        return Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ error: 'Room not found' })
        });
      }
      if (url.includes('/api/room') && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, roomId: 'NEW123' })
        });
      }
      return Promise.reject(new Error('Unknown URL: ' + url));
    });
  });

  it('renders dashboard with personalized welcome and action buttons', async () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    expect(screen.getByText(/Welcome back, Krishna Test/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Join Room/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Room/i })).toBeInTheDocument();
  });

  it('opens glassmorphic modal when clicking Join Room button', async () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    const joinBtn = screen.getByRole('button', { name: /Join Room/i });
    fireEvent.click(joinBtn);

    expect(screen.getByText('Join Collaboration Room')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 60JAZK')).toBeInTheDocument();
  });

  it('validates empty room code input inside modal', async () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Join Room/i }));

    const submitBtn = screen.getByRole('button', { name: /Join Space/i });
    expect(submitBtn).toBeDisabled();
  });

  it('handles invalid room code submission inside modal without window.alert', async () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Join Room/i }));
    const input = screen.getByPlaceholderText('e.g. 60JAZK');
    fireEvent.change(input, { target: { value: 'NONEXIST' } });

    const submitBtn = screen.getByRole('button', { name: /Join Space/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Room not found/i)).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to room on valid room code submission in modal', async () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Join Room/i }));
    const input = screen.getByPlaceholderText('e.g. 60JAZK');
    fireEvent.change(input, { target: { value: 'VALID1' } });

    const submitBtn = screen.getByRole('button', { name: /Join Space/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/room/VALID1');
    });
  });

  it('creates new room and navigates to it', async () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    const createBtn = screen.getByRole('button', { name: /New Room/i });
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/room/NEW123');
    });
  });
});
