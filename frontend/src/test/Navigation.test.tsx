import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock context hooks
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isLoggedIn: false, isAdmin: false, logout: vi.fn(), login: vi.fn() }),
}));

vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false, toggleTheme: vi.fn() }),
}));

import Navigation from '../components/Navigation';

describe('Navigation accessibility', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
  });

  it('has a nav element with aria-label', () => {
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
  });

  it('theme toggle button has a descriptive aria-label', () => {
    const themeButton = screen.getByRole('button', { name: /switch to (dark|light) mode/i });
    expect(themeButton).toBeInTheDocument();
  });

  it('logo image has meaningful alt text', () => {
    const logo = screen.getByAltText('OctoCAT Supply home');
    expect(logo).toBeInTheDocument();
  });

  it('login link is present and accessible', () => {
    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toBeInTheDocument();
  });
});
