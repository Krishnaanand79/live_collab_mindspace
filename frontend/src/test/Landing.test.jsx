import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from '../pages/Landing';
import { ThemeContext } from '../App';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Landing Page Component Tests', () => {
  const mockThemeContext = {
    theme: 'dark',
    toggleTheme: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders landing page with headline, brand logo and telemetry metrics', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Landing />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    expect(screen.getByText(/The Infinite Canvas Where/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Performing Teams Co-Create/i)).toBeInTheDocument();
    expect(screen.getByText(/MINDSPACE 2.0 • AUTONOMOUS AGENTIC COLLABORATION OS/i)).toBeInTheDocument();
    expect(screen.getByText(/WebSocket Latency/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-Time Sync SLA/i)).toBeInTheDocument();
  });

  it('navigates to login when clicking Sign In button', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Landing />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    const signInBtns = screen.getAllByRole('button', { name: /Sign In/i });
    fireEvent.click(signInBtns[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to dashboard when user is logged in and clicks Launch Free Workspace', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Krishna' }));

    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Landing />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    const ctaButtons = screen.getAllByRole('button', { name: /Launch Free Workspace/i });
    fireEvent.click(ctaButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('switches between agile suite feature tabs', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Landing />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    // Click Agile Kanban Boards tab
    const kanbanTab = screen.getByRole('button', { name: /Agile Kanban Boards/i });
    fireEvent.click(kanbanTab);

    expect(screen.getByText('High-Velocity Sprint Planning')).toBeInTheDocument();
    expect(screen.getByText('3-Stage Kanban (To-Do, In-Progress, Completed)')).toBeInTheDocument();

    // Click Studio Audio & Video tab
    const studioTab = screen.getByRole('button', { name: /Studio Audio & Video/i });
    fireEvent.click(studioTab);

    expect(screen.getByText('Zero-Friction Peer Collaboration')).toBeInTheDocument();
  });

  it('renders all pricing tiers with transparent costs', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Landing />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('Team Pro')).toBeInTheDocument();
    expect(screen.getByText('$19')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
    expect(screen.getByText('$49')).toBeInTheDocument();
  });

  it('invokes theme toggle when theme button is clicked', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Landing />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    const themeToggleBtn = screen.getByRole('button', { name: /Toggle theme/i });
    fireEvent.click(themeToggleBtn);

    expect(mockThemeContext.toggleTheme).toHaveBeenCalled();
  });
});
