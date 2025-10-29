import React from 'react';
import type { View } from '../types';

interface MobileNavProps {
    currentView: View;
    onHomeClick: () => void;
    onCategoriesClick: () => void;
    onAddClick: () => void;
}

const NavItem: React.FC<{
    label: string,
    icon: React.ReactNode,
    isActive: boolean,
    onClick: () => void
}> = ({ label, icon, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`}
    >
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </button>
);

const MobileNav: React.FC<MobileNavProps> = ({ currentView, onHomeClick, onCategoriesClick, onAddClick }) => {
    return (
        <footer className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-lg z-50">
            <div className="flex justify-around items-center h-full">
                <NavItem 
                    label="Accueil"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                    isActive={currentView === 'home'}
                    onClick={onHomeClick}
                />

                <div className="relative">
                    <button 
                        onClick={onAddClick}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 shadow-lg shadow-yellow-400/40 transform hover:scale-110 transition-transform duration-300"
                        aria-label="Ajouter"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    </button>
                </div>
                
                <NavItem 
                    label="Catégories"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                    isActive={currentView === 'categories' || currentView === 'subjects' || currentView === 'confessions' || currentView === 'confessionDetail'}
                    onClick={onCategoriesClick}
                />
            </div>
        </footer>
    );
};

export default MobileNav;