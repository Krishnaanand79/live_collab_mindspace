import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import History from '../pages/History';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('History Component Tests', () => {
  const sampleSessions = [
    {
      id: 'sess-1',
      roomId: 'ROOM01',
      title: 'Sprint Retrospective',
      date: '2026-09-18T10:00:00.000Z',
      duration: '45m',
      participants: 4,
      aiSummary: 'Discussed sprint velocity and optimized frontend performance.'
    },
    {
      id: 'sess-2',
      roomId: 'ROOM02',
      title: 'AI Architecture Review',
      date: '2026-09-19T14:30:00.000Z',
      duration: '30m',
      participants: 2,
      aiSummary: 'Reviewed Gemini Agentic Whiteboard workflow and formula cleanup.'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ sessions: sampleSessions })
      })
    );
  });

  it('renders history page and displays fetched session list', async () => {
    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sprint Retrospective')).toBeInTheDocument();
      expect(screen.getByText('AI Architecture Review')).toBeInTheDocument();
    });
  });

  it('filters sessions live when typing into search input', async () => {
    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sprint Retrospective')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search sessions...');
    fireEvent.change(searchInput, { target: { value: 'Architecture' } });

    expect(screen.getByText('AI Architecture Review')).toBeInTheDocument();
    expect(screen.queryByText('Sprint Retrospective')).not.toBeInTheDocument();
  });

  it('displays empty state message when search returns zero results', async () => {
    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sprint Retrospective')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search sessions...');
    fireEvent.change(searchInput, { target: { value: 'NonexistentSearchTerm' } });

    expect(screen.getByText('No Matching Sessions')).toBeInTheDocument();
    expect(screen.getByText(/No collaboration sessions matched "NonexistentSearchTerm"/i)).toBeInTheDocument();
  });

  it('navigates to room space when clicking Reopen Space button', async () => {
    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sprint Retrospective')).toBeInTheDocument();
    });

    const reopenButtons = screen.getAllByRole('button', { name: /Reopen Space/i });
    fireEvent.click(reopenButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/room/ROOM01');
  });
});
