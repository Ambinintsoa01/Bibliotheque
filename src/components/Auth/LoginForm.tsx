import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BookOpen, Lock, Mail, UserCheck, Users } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string, role: 'admin' | 'client') => Promise<{ success: boolean; error?: string }>;
}

interface FormData {
  email: string;
  password: string;
  role: 'admin' | 'client';
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');

    try {
      const result = await onLogin(data.email, data.password, data.role);
      if (!result.success) {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">BiblioManager</h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous pour accéder au système
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type d'utilisateur
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <label className="relative">
                  <input
                    type="radio"
                    value="admin"
                    {...register('role', { required: 'Sélectionnez un type d\'utilisateur' })}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedRole === 'admin' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <UserCheck className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Admin</span>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    value="client"
                    {...register('role', { required: 'Sélectionnez un type d\'utilisateur' })}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedRole === 'client' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <Users className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Client</span>
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type="password"
                  {...register('password', { 
                    required: 'Le mot de passe est requis',
                    minLength: {
                      value: 6,
                      message: 'Le mot de passe doit contenir au moins 6 caractères'
                    }
                  })}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Démo - Utilisez n'importe quel email et mot de passe
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;