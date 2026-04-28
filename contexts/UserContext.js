import { createContext, useContext, useEffect, useState } from 'react';

import { clearSession, getSession } from '../services/authService';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-login: verifica sessão persistida ao abrir o app
  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      try {
        const session = await getSession();
        if (mounted && session) {
          setUser(session);
        }
      } catch (err) {
        console.error('Erro ao restaurar sessão:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();
    return () => { mounted = false; };
  }, []);

  async function logout() {
    await clearSession();
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
