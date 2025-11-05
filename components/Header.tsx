import React from 'react';
import logoImg from '../assets/logo.jpg';

interface HeaderProps {
  onHomeClick: () => void;
  onCategoriesClick: () => void;
  onMemosClick?: () => void;
  userId: string | null;
  isAdmin?: boolean;
  onLogout: () => void;
  onLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, onCategoriesClick, onMemosClick, userId, isAdmin, onLogout, onLogin }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button type="button" className="flex-shrink-0 cursor-pointer" onClick={onHomeClick}>
            <img src={logoImg} alt="ConneXXion Logo" className="h-12" />
          </button>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <button onClick={onHomeClick} className="font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              Accueil
            </button>
            <button onClick={onCategoriesClick} className="font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              Categories
            </button>
            {isAdmin && onMemosClick && (
              <button onClick={onMemosClick} className="font-semibold text-yellow-600 hover:text-yellow-700 transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                Messages
              </button>
            )}
          </nav>
          <div className="flex items-center">
            {userId ? (
              <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Connecte : <span className="font-bold text-gray-700">{userId}</span>
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
