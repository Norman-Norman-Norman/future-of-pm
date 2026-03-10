import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navigation from './Navigation';

// ─── Mock contexts ────────────────────────────────────────────────────────────

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    isLoggedIn: false,
    isAdmin: false,
    logout: vi.fn(),
  })),
}));

vi.mock('../context/ThemeContext', () => ({
  useTheme: vi.fn(() => ({
    darkMode: false,
    toggleTheme: vi.fn(),
  })),
}));

vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(() => ({
    totalItems: 0,
  })),
}));

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const mockAuthHook = useAuth as ReturnType<typeof vi.fn>;
const mockThemeHook = useTheme as ReturnType<typeof vi.fn>;
const mockCartHook = useCart as ReturnType<typeof vi.fn>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderNav() {
  return render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Navigation — hamburger menu', () => {
  beforeEach(() => {
    mockAuthHook.mockReturnValue({ isLoggedIn: false, isAdmin: false, logout: vi.fn() });
    mockThemeHook.mockReturnValue({ darkMode: false, toggleTheme: vi.fn() });
    mockCartHook.mockReturnValue({ totalItems: 0 });
  });

  it('renders the hamburger button', () => {
    renderNav();
    expect(screen.getByTestId('hamburger-button')).toBeInTheDocument();
  });

  it('hamburger button has correct aria-label when closed', () => {
    renderNav();
    expect(screen.getByTestId('hamburger-button')).toHaveAttribute(
      'aria-label',
      'Open navigation menu'
    );
  });

  it('hamburger button has aria-expanded=false when nav is closed', () => {
    renderNav();
    expect(screen.getByTestId('hamburger-button')).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('opens mobile nav panel when hamburger is clicked', async () => {
    renderNav();
    const btn = screen.getByTestId('hamburger-button');
    await userEvent.click(btn);
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    expect(dialog.className).toContain('translate-x-0');
    expect(dialog.className).not.toContain('translate-x-full');
  });

  it('hamburger button aria-expanded becomes true when nav is open', async () => {
    renderNav();
    const btn = screen.getByTestId('hamburger-button');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('hamburger button aria-label changes to "Close" when open', async () => {
    renderNav();
    const btn = screen.getByTestId('hamburger-button');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-label', 'Close navigation menu');
  });

  it('mobile nav panel contains all main nav links', async () => {
    renderNav();
    await userEvent.click(screen.getByTestId('hamburger-button'));
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    expect(dialog.querySelector('a[href="/"]')).toBeInTheDocument();
    expect(dialog.querySelector('a[href="/products"]')).toBeInTheDocument();
    expect(dialog.querySelector('a[href="/about"]')).toBeInTheDocument();
  });

  it('clicking a nav link in mobile panel closes the panel', async () => {
    renderNav();
    await userEvent.click(screen.getByTestId('hamburger-button'));
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    const homeLink = dialog.querySelector('a[href="/"]') as HTMLAnchorElement;
    await userEvent.click(homeLink);
    expect(dialog.className).toContain('translate-x-full');
  });

  it('pressing Escape closes the mobile nav', async () => {
    renderNav();
    await userEvent.click(screen.getByTestId('hamburger-button'));
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    expect(dialog.className).toContain('translate-x-0');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(dialog.className).toContain('translate-x-full');
  });

  it('clicking the overlay closes the mobile nav', async () => {
    renderNav();
    await userEvent.click(screen.getByTestId('hamburger-button'));
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    expect(dialog.className).toContain('translate-x-0');
    const overlay = document.querySelector('[aria-hidden="true"].fixed.inset-0') as HTMLElement;
    expect(overlay).not.toBeNull();
    await userEvent.click(overlay);
    expect(dialog.className).toContain('translate-x-full');
  });
});

describe('Navigation — cart icon always visible', () => {
  beforeEach(() => {
    mockAuthHook.mockReturnValue({ isLoggedIn: false, isAdmin: false, logout: vi.fn() });
    mockThemeHook.mockReturnValue({ darkMode: false, toggleTheme: vi.fn() });
    mockCartHook.mockReturnValue({ totalItems: 0 });
  });

  it('renders the cart link in the navbar (outside hamburger)', () => {
    renderNav();
    // Cart link is in the nav bar, not inside the mobile dialog
    const cartLink = screen.getByRole('link', { name: /cart/i });
    expect(cartLink).toBeInTheDocument();
  });

  it('cart link shows badge when totalItems > 0', () => {
    mockCartHook.mockReturnValue({ totalItems: 3 });
    renderNav();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('cart link does not show badge when totalItems is 0', () => {
    mockCartHook.mockReturnValue({ totalItems: 0 });
    renderNav();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('cart link has correct aria-label with item count', () => {
    mockCartHook.mockReturnValue({ totalItems: 5 });
    renderNav();
    expect(screen.getByRole('link', { name: /cart, 5 items/i })).toBeInTheDocument();
  });

  it('cart link is accessible even without hamburger being open', () => {
    renderNav();
    // The hamburger should NOT contain the cart link
    const cartLink = screen.getByRole('link', { name: /cart/i });
    const hamburger = screen.getByTestId('hamburger-button');
    expect(hamburger).not.toContainElement(cartLink);
  });
});

describe('Navigation — admin section in mobile nav', () => {
  beforeEach(() => {
    mockAuthHook.mockReturnValue({ isLoggedIn: true, isAdmin: true, logout: vi.fn() });
    mockThemeHook.mockReturnValue({ darkMode: false, toggleTheme: vi.fn() });
    mockCartHook.mockReturnValue({ totalItems: 0 });
  });

  it('shows Admin button in mobile nav for admin users', async () => {
    renderNav();
    await userEvent.click(screen.getByTestId('hamburger-button'));
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    expect(dialog.querySelector('button[aria-controls="mobile-admin-menu"]')).toBeInTheDocument();
  });

  it('admin accordion expands to show Manage Products link', async () => {
    renderNav();
    await userEvent.click(screen.getByTestId('hamburger-button'));
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    const adminBtn = dialog.querySelector('button[aria-controls="mobile-admin-menu"]') as HTMLButtonElement;
    await userEvent.click(adminBtn);
    expect(screen.getByRole('link', { name: /manage products/i })).toBeInTheDocument();
  });
});

describe('Navigation — dark mode', () => {
  beforeEach(() => {
    mockAuthHook.mockReturnValue({ isLoggedIn: false, isAdmin: false, logout: vi.fn() });
    mockThemeHook.mockReturnValue({ darkMode: true, toggleTheme: vi.fn() });
    mockCartHook.mockReturnValue({ totalItems: 0 });
  });

  it('renders the navigation in dark mode', () => {
    renderNav();
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('bg-dark');
  });

  it('mobile nav panel has dark background in dark mode', async () => {
    renderNav();
    await userEvent.click(screen.getByTestId('hamburger-button'));
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    expect(dialog.className).toContain('bg-dark');
  });
});
