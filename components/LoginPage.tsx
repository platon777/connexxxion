import React, { useState } from 'react';
import { logoBase64 } from '../assets/logo';

interface LoginPageProps {
  onLogin: (userId: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup' && password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    // In a real app, you'd make an API call here.
    // For now, we simulate success by calling onLogin with the username.
    if (username.trim()) {
      onLogin(username.trim());
    } else {
      alert("Le nom d'utilisateur ne peut pas être vide.");
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
            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="username">Username</label>
              <input 
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="kitanago05, pussycat509, bigdickontown..."
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
                className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg border-2 border-transparent focus:border-yellow-400 focus:ring-0 outline-none transition"
                required
              />
            </div>
            
            {mode === 'signup' && (
              <div className="transition-all duration-500">
                <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
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
            
            <button type="submit" className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/30">
              {mode === 'login' ? 'Se connecter' : 'Inscription'}
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