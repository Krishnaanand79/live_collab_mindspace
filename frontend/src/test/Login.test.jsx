import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

// Mock react-oauth/google
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div data-testid="google-login-mock">Google Login</div>
}));

describe('Login Component Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders login form with email and password inputs', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('switches between Sign In and Sign Up views smoothly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const switchBtn = screen.getByRole('button', { name: /Create one/i });
    fireEvent.click(switchBtn);

    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();

    const switchBackBtn = screen.getByRole('button', { name: /Sign in/i });
    fireEvent.click(switchBackBtn);

    expect(screen.queryByPlaceholderText('Your name')).not.toBeInTheDocument();
  });

  it('displays error banner when logging in with unregistered credentials without window.alert', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('name@company.com');
    const passInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'unknown@example.com' } });
    fireEvent.change(passInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('registers a new user and saves to localStorage without blocking alerts', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Switch to sign up
    fireEvent.click(screen.getByRole('button', { name: /Create one/i }));

    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Krishna Anand' } });
    fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'krishna@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    const savedUser = JSON.parse(localStorage.getItem('user'));
    expect(savedUser).not.toBeNull();
    expect(savedUser.name).toBe('Krishna Anand');
    expect(savedUser.email).toBe('krishna@example.com');
  });

  it('displays error banner if attempting to sign up with existing email', async () => {
    localStorage.setItem('livecollab_accounts', JSON.stringify([
      { name: 'Existing User', email: 'existing@example.com', password: '123' }
    ]));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Create one/i }));
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByPlaceholderText('name@company.com'), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'secret' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/already exists/i)).toBeInTheDocument();
    });
  });
});
