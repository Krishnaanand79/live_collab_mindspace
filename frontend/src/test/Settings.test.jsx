import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Settings from '../pages/Settings';
import { ThemeContext } from '../App';

describe('Settings Component Tests', () => {
  const mockThemeContext = {
    theme: 'dark',
    toggleTheme: vi.fn()
  };

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({
      name: 'Krishna Anand',
      email: 'krishnaanand1207@gmail.com'
    }));
  });

  it('renders settings layout with tabs and loads current user profile', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Krishna Anand')).toBeInTheDocument();
    expect(screen.getByDisplayValue('krishnaanand1207@gmail.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Audio & Video' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'AI Preferences' })).toBeInTheDocument();
  });

  it('updates display name, saves to localStorage and shows feedback toast', async () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    const nameInput = screen.getByDisplayValue('Krishna Anand');
    fireEvent.change(nameInput, { target: { value: 'Krishna Lead Architect' } });

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);

    const savedUser = JSON.parse(localStorage.getItem('user'));
    expect(savedUser.name).toBe('Krishna Lead Architect');

    await waitFor(() => {
      expect(screen.getByText(/Settings saved successfully!/i)).toBeInTheDocument();
    });
  });

  it('switches to AI Preferences tab and displays agentic settings', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </ThemeContext.Provider>
    );

    const aiTab = screen.getByRole('button', { name: 'AI Preferences' });
    fireEvent.click(aiTab);

    expect(screen.getByText('Auto-Summarize Meetings')).toBeInTheDocument();
    expect(screen.getByText('Action Items Extraction')).toBeInTheDocument();
  });
});
