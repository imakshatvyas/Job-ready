import React, { createContext, useContext, useState, useEffect } from 'react';


export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session exists in localStorage
    const savedUser = localStorage.getItem('optijob_auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    // Simulate google authentication
    const googleUser: User = {
      uid: 'google-user-101',
      email: 'm.university.student@gmail.com',
      displayName: 'MBM Scholar',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80'
    };
    
    localStorage.setItem('optijob_auth_user', JSON.stringify(googleUser));
    setUser(googleUser);
    setLoading(false);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    // Basic verification simulation
    if (email && pass.length >= 6) {
      const emailUser: User = {
        uid: `email-user-${Date.now()}`,
        email: email,
        displayName: email.split('@')[0],
      };
      localStorage.setItem('optijob_auth_user', JSON.stringify(emailUser));
      setUser(emailUser);
    } else {
      setLoading(false);
      throw new Error("Invalid credentials or password too short (min 6 characters).");
    }
    setLoading(false);
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    if (email && pass.length >= 6 && name) {
      const emailUser: User = {
        uid: `email-user-${Date.now()}`,
        email: email,
        displayName: name,
      };
      localStorage.setItem('optijob_auth_user', JSON.stringify(emailUser));
      setUser(emailUser);
    } else {
      setLoading(false);
      throw new Error("Sign up parameters missing or password too short.");
    }
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    if (!email) throw new Error("Please specify email address.");
    alert(`Reset password email has been sent successfully to: ${email}`);
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('optijob_auth_user');
    // Also clear session-specific profile data if desired
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, signupWithEmail, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
