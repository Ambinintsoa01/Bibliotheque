import { useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { apiService } from '../services/api';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      const user = JSON.parse(savedUser);
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'client') => {
    try {
      const response = await apiService.login({ email, password, role });
      
      if (response.success && response.user) {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          nom: response.user.nom,
          prenom: response.user.prenom,
          role: response.user.role,
          dateInscription: response.user.dateInscription,
          telephone: response.user.telephone,
          adherantType: response.user.adherantType
        };

        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false
        });

        return { success: true };
      } else {
        return { success: false, error: response.error || 'Erreur de connexion' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false
    });
  };

  return {
    ...authState,
    login,
    logout
  };
};