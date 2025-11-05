import React from 'react';

interface HomePageProps {
  onStart: () => void;
}

const CONFESSION_ICON = String.fromCodePoint(0x1f92b);

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center text-center py-16 md:py-24 overflow-hidden">
      <div className="hidden md:block absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-48 h-64 bg-yellow-200/80 rounded-3xl transform -rotate-12 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-56 h-72 bg-amber-200/80 rounded-3xl transform rotate-6 animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/4 right-[15%] w-32 h-40 bg-yellow-100/80 rounded-3xl transform rotate-12 animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-[20%] w-24 h-32 bg-amber-100/80 rounded-3xl transform -rotate-6 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-stone-50/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 text-7xl md:text-8xl animate-float" style={{ animationDuration: '5s' }}>
          {CONFESSION_ICON}
          {/* ok */}
          {/* ok2 */}
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
          Plongez dans l'univers
          <br />
          mystérieux des{' '}
          <span className="relative inline-block">
            <span className="absolute inset-x-0 bottom-1.5 md:bottom-2.5 h-3 md:h-5 bg-yellow-300 z-[-1]"></span>
            <span className="relative">confessions</span>
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto italic">
          "Là où l'anonymat rencontre l'authenticité naissent les plus belles vérités."
        </p>

        <div className="mt-12">
          <button
            onClick={onStart}
            className="group flex items-center justify-center px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-full text-lg shadow-lg shadow-yellow-400/30 hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105"
          >
            <span>Commencez l'aventure</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;










