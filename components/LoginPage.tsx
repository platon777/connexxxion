import React, { useState } from 'react';
import { logoBase64 } from '../assets/logo';
import { authService } from '../api';
import type { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup' && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    if (mode === 'signup' && (!name.trim() || !email.trim())) {
      setError("Le nom et l'email sont requis.");
      return;
    }

    if (mode === 'login' && !email.trim()) {
      setError("L'email est requis.");
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await authService.login({ email, password });
      } else {
        await authService.signup({ name, email, password });
      }

      // Get user info after successful auth
      const user = await authService.getCurrentUser();
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden my-8">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between bg-gradient-to-br from-yellow-400 to-amber-400 text-white">
          <div>
            <div className="bg-white p-2 rounded-md inline-block shadow-md">
                <img src={logoBase64} alt="ConneXXion Logo" className="h-12" />
            </div>
            <p className="mt-8 text-lg leading-relaxed">
              Bienvenue sur ConneXXion 👋 <br/> Votre espace intime et sans tabou pour partager vos fantasmes, confessions et rencontrer des âmes complices. Libérez vos désirs en toute discrétion... 😈
            </p>
          </div>
          <div className="space-y-4 text-sm mt-8">
            <div className="flex items-center space-x-3 opacity-90">
                <span>💌</span>
                <span><b>Marketplace 🛍️</b> - Découvrez notre sélection de jouets et accessoires pour pimenter vos moments intimes.</span>
            </div>
            <div className="flex items-center space-x-3 opacity-90">
                <span>⚡</span>
                <span><b>Stories & Confessions Hot 🌶️</b></span>
            </div>
            <div className="flex items-center space-x-3 opacity-90">
                <span>🎧</span>
                <span><b>Chat Privé & Rencontres 🥰</b></span>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex w-full max-w-xs p-1 bg-yellow-100/50 rounded-full">
                <button 
                    onClick={() => setMode('login')}
                    className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${mode === 'login' ? 'bg-yellow-400 text-white shadow-md' : 'text-yellow-800/70'}`}
                >
                    Se Connecter
                </button>
                <button 
                    onClick={() => setMode('signup')}
                    className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${mode === 'signup' ? 'bg-yellow-400 text-white shadow-md' : 'text-yellow-800/70'}`}
                >
                    S'inscrire
                </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="name">Nom d'utilisateur</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="kitanago05, pussycat509, bigdickontown..."
                  className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-yellow-400 focus:ring-0 outline-none transition"
                  required={mode === 'signup'}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-yellow-400 focus:ring-0 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="password">Mot de passe 🙈</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Min 8 caractères, 1 lettre, 1 chiffre' : ''}
                className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-yellow-400 focus:ring-0 outline-none transition"
                required
              />
            </div>

            {mode === 'signup' && (
              <div className="transition-all duration-500">
                <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-yellow-400 focus:ring-0 outline-none transition"
                  required={mode === 'signup'}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span>Chargement...</span>
              ) : (
                <span>{mode === 'login' ? 'Se connecter' : 'Inscription'}</span>
              )}
            </button>
          </form>
          
          <div className="text-center mt-6 text-sm">
            {mode === 'login' ? (
              <p>Pas encore de compte coquin ? <button onClick={() => setMode('signup')} className="font-semibold text-yellow-600 hover:underline">S'inscrire</button></p>
            ) : (
              <p>Déjà membre du club ? <button onClick={() => setMode('login')} className="font-semibold text-yellow-600 hover:underline">Se connecter</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;