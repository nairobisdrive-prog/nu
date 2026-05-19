import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type FirebaseUser,
} from '../lib/firebase';
import { authApi } from '../lib/api';

interface User {
  id: number;
  firebase_uid: string;
  email: string;
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: 'user' | 'agent' | 'admin';
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to Firebase auth state
  useEffect(() => {
    // Safety timeout: if Firebase auth never fires, stop loading after 3s
    const timeoutId = setTimeout(() => {
      setLoading((current) => {
        if (current) {
          console.warn('Firebase auth state timeout - forcing loading complete');
          return false;
        }
        return current;
      });
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      clearTimeout(timeoutId);
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          const data = await authApi.verify(idToken);
          setUser(data.user);
        } catch (err: any) {
          console.error('Failed to sync user with backend:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();
      const data = await authApi.verify(idToken);
      setUser(data.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const data = await authApi.verify(idToken);
      setUser(data.user);
    } catch (err: any) {
      setError(err.message || 'Google login failed');
      throw err;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      const idToken = await result.user.getIdToken(true);
      const data = await authApi.verify(idToken);
      setUser(data.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Logout failed');
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user,
        loading,
        error,
        loginWithEmail,
        loginWithGoogle,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
