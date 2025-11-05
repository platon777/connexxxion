import React, { useState, useEffect } from 'react';

interface DonationButtonProps {
  onClick: () => void;
}

const DonationButton: React.FC<DonationButtonProps> = ({ onClick }) => {
  const [isPulsing, setIsPulsing] = useState(false);

  // Animation pulse subtile toutes les 4 secondes
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1200);
    }, 4000);

    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        fixed bottom-24 right-6 md:bottom-10 md:right-10 z-40
        inline-flex items-center gap-1.5
        bg-gradient-to-r from-yellow-400 via-orange-400 to-rose-400
        text-gray-900 font-semibold
        px-3.5 py-2 md:px-4 md:py-2.5
        rounded-full
        shadow-xl shadow-amber-300/40
        hover:shadow-2xl hover:shadow-amber-500/60
        transform hover:-translate-y-1 hover:scale-105
        transition-all duration-300 ease-out
        ${isPulsing ? 'animate-pulse' : ''}
      `}
      aria-label="Faire un don pour soutenir Connexxxion"
    >
      {/* Icône coeur avec animation */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 md:h-6 md:w-6 transform group-hover:scale-110 transition-transform duration-300"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>

      {/* Texte avec affichage responsive */}
      <span className="text-[11px] sm:text-xs md:text-sm font-bold">
        Faire un don
      </span>

      {/* Badge "merci" en overlay discret au hover */}
      <span className="
        absolute -top-2 -right-2
        bg-white text-yellow-600
        text-xs font-bold
        px-2 py-0.5 rounded-full
        opacity-0 group-hover:opacity-100
        transform scale-75 group-hover:scale-100
        transition-all duration-300
        shadow-md
      ">
        Merci !
      </span>
    </button>
  );
};

export default DonationButton;
