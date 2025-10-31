import React from 'react';
import { logoBase64 } from '../assets/logo';

interface HeaderProps {
  onHomeClick: () => void;
  onCategoriesClick: () => void;
  userId: string | null;
  onLogout: () => void;
  onLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, onCategoriesClick, userId, onLogout, onLogin }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button type="button" className="flex-shrink-0 cursor-pointer" onClick={onHomeClick}>
            <img src={logoBase64} alt="ConneXXion Logo" className="h-12" />
          </button>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <button onClick={onHomeClick} className="font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              Accueil
            </button>
            <button onClick={onCategoriesClick} className="font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              Categories
            </button>
          </nav>
          <div className="flex items-center">
            {userId ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-600 hidden sm:inline">
                  Connecte : <span className="font-bold">{userId}</span>
                </span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full hover:bg-yellow-200 transition-colors"
                >
                  Deconnexion
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-bold rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
