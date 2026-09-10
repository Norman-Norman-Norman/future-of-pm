import { createContext, useContext, useState, ReactNode } from 'react';
import { frontendLogger } from '../logger';

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  frontendLogger.debug('AuthProvider', 'AuthProvider rendering', { isLoggedIn, isAdmin });

  const login = async (email: string, password: string) => {
    frontendLogger.userAction('Login attempt', { email });
    // In a real app, you would validate credentials with an API
    // For now, we'll just check the email domain
    if (email && password) {
      const adminStatus = email.endsWith('@github.com');
      setIsLoggedIn(true);
      setIsAdmin(adminStatus);
      frontendLogger.info('Auth', `Login successful`, { email, isAdmin: adminStatus });
    } else {
      frontendLogger.warn('Auth', 'Login failed — missing email or password');
    }
  };

  const logout = () => {
    frontendLogger.userAction('Logout');
    setIsLoggedIn(false);
    setIsAdmin(false);
    frontendLogger.info('Auth', 'User logged out');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}