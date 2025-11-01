import React from 'react';

import moncashImage from '../assets/moncash_connexxxion.jpg';

interface DonationsPageProps {
  onBack: () => void;
}

const DonationsPage: React.FC<DonationsPageProps> = ({ onBack }) => {
  return (
    <section className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden ring-1 ring-yellow-100">
      <header className="bg-gradient-to-r from-yellow-400 via-orange-400 to-rose-400 px-6 py-8 text-center text-white">
        <p className="uppercase tracking-widest text-sm font-semibold opacity-90">Soutenez Connexxxion</p>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Participez a la magie des Confessions</h1>
        <p className="mt-3 text-sm md:text-base text-white/90">
          Chaque contribution nous aide a garder la plateforme vivante, gratuite et chaleureuse pour toute la communaute.
        </p>
      </header>

      <div className="p-8 space-y-8">
        <p className="text-gray-700 leading-relaxed text-base md:text-lg">
          Nous adorons construire cet espace ou chacun peut s&apos;exprimer librement. Si Connexxxion vous apporte un sourire, un moment de reflexion ou un soutien, vous pouvez contribuer en toute simplicite via MonCash pour nous permettre de couvrir
          l&apos;hebergement, continuer a ameliorer les fonctionnalites et soutenir l&apos;equipe.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-semibold text-yellow-900">Comment contribuer ?</h2>
          <ol className="list-decimal list-inside text-yellow-900/90 space-y-2">
            <li>Ouvrez votre application MonCash.</li>
            <li>Scannez l&apos;affiche ci-dessous ou saisissez les informations associees.</li>
            <li>Choisissez le montant qui vous convient et validez.</li>
          </ol>
          <p className="text-sm text-yellow-900/70">
            Chaque geste compte, meme symbolique. Merci de faire partie de l&apos;aventure !
          </p>
        </div>

        <figure className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <img src={moncashImage} alt="Informations de contribution MonCash Connexxxion" className="w-full object-cover" />
        </figure>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-gray-600 text-sm sm:text-base">
            <p>Envie d&apos;en parler autour de vous ? Partagez cette page avec vos amis pour faire grandir la communaute.</p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-900 text-white font-semibold shadow-md hover:bg-gray-800 transition-colors duration-200"
          >
            Revenir a l&apos;experience
          </button>
        </div>
      </div>
    </section>
  );
};

export default DonationsPage;

