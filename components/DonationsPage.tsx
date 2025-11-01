import React, { useState } from 'react';

import moncashImage from '../assets/moncash_connexxxion.jpg';
import MemoForm from './MemoForm';

interface DonationsPageProps {
  onBack: () => void;
  onMemoSubmit: (data: { user_name?: string; description: string }) => Promise<void>;
}

const DonationsPage: React.FC<DonationsPageProps> = ({ onBack, onMemoSubmit }) => {
  const [showMemoForm, setShowMemoForm] = useState(false);
  const moncashNumber = '47308317';

  const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent('Bonjour! Je souhaite faire un don pour soutenir Connexxxion.');
    const whatsappUrl = `https://wa.me/${moncashNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleMemoSubmit = async (data: { user_name?: string; description: string }) => {
    await onMemoSubmit(data);
    setShowMemoForm(false);
    alert('Merci pour votre message ! 💛');
  };

  return (
    <section className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden ring-1 ring-yellow-100">
      <header className="bg-gradient-to-r from-yellow-400 via-orange-400 to-rose-400 px-6 py-8 text-center text-white">
        <p className="uppercase tracking-widest text-sm font-semibold opacity-90">Soutenez Connexxxion</p>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Participez au developpement de la plateforme</h1>
        <p className="mt-3 text-sm md:text-base text-white/90">
          Chaque contribution nous aide a garder la plateforme vivante, gratuite et chaleureuse pour toute la communaute.
        </p>
      </header>

      <div className="p-8 space-y-8">
        <p className="text-gray-700 leading-relaxed text-base md:text-lg">
          Nous adorons construire cet espace ou chacun peut s&apos;exprimer librement. Si Connexxxion vous apporte un sourire, un moment de reflexion ou un soutien, vous pouvez contribuer en toute simplicite via MonCash pour nous permettre de couvrir
          l&apos;hebergement, continuer a ameliorer les fonctionnalites et soutenir l&apos;equipe.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-yellow-900">Comment contribuer ?</h2>

          {/* Numéro MonCash en évidence */}
          <div className="bg-white border-2 border-yellow-400 rounded-xl p-4 text-center">
            <p className="text-sm text-yellow-900/70 mb-2">Numéro MonCash</p>
            <p className="text-2xl md:text-3xl font-bold text-yellow-900 tracking-wider">47308317</p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText('47308317');
                alert('Numéro copié !');
              }}
              className="mt-3 text-xs text-yellow-700 hover:text-yellow-900 underline"
            >
              Cliquez pour copier
            </button>
          </div>

          <ol className="list-decimal list-inside text-yellow-900/90 space-y-2">
            <li>Ouvrez votre application MonCash.</li>
            <li>Scannez l&apos;affiche ci-dessous ou saisissez le numéro ci-dessus.</li>
            <li>Choisissez le montant qui vous convient et validez.</li>
          </ol>
          <p className="text-sm text-yellow-900/70">
            Chaque geste compte, meme symbolique. Merci de faire partie de l&apos;aventure !
          </p>
        </div>

        <figure className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <img src={moncashImage} alt="Informations de contribution MonCash Connexxxion" className="w-full object-cover" />
        </figure>

        {/* Options de contact */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-yellow-900">Partagez votre soutien</h2>
          <p className="text-sm text-gray-700">
            Choisissez comment vous souhaitez nous laisser un message :
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Option 1: Formulaire de memo */}
            <button
              type="button"
              onClick={() => setShowMemoForm(!showMemoForm)}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-yellow-300 text-yellow-900 font-semibold rounded-xl hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-300 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Ecrire un memo</span>
            </button>

            {/* Option 2: WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsAppRedirect}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Formulaire de memo (conditionnel) */}
        {showMemoForm && (
          <MemoForm onSubmit={handleMemoSubmit} onClose={() => setShowMemoForm(false)} />
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
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

