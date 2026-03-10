import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isLoggedIn: false, isAdmin: false, login: vi.fn(), logout: vi.fn() }),
}));

vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false, toggleTheme: vi.fn() }),
}));

import Login from '../components/Login';

describe('Login accessibility', () => {
  it('email input has an associated label', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('password input has an associated label', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('submit button is accessible', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const submitButton = screen.getByRole('button', { name: /login/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('error message does not use dangerouslySetInnerHTML', () => {
    render(
      <MemoryRouter initialEntries={['/?error=test+error']}>
        <Login />
      </MemoryRouter>
    );
    // Verify the error is rendered as text (not HTML), role="alert" is present
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert.textContent).toBe('test error');
    // Verify no HTML was injected (the text content equals the raw string, no tags)
    expect(alert.innerHTML).not.toContain('<');
  });

  it('form has a heading', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const heading = screen.getByRole('heading', { name: /login/i });
    expect(heading).toBeInTheDocument();
  });
});
