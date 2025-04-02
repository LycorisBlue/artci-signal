import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { Preuve } from '@/lib/services/signalements/get-signalement-details';

interface PreuvesTabProps {
    preuves: Preuve[];
    isLoading: boolean;
}

const PreuvesTab: React.FC<PreuvesTabProps> = ({ preuves, isLoading }) => {
    // Rendu pendant le chargement
    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-40"></div>
                    ))}
                </div>
            </div>
        );
    }

    // Si aucune preuve n'est disponible
    if (!preuves.length) {
        return (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                Aucune preuve n&apos;a été fournie pour ce signalement.
            </div>
        );
    }

    const handleDownloadAll = () => {
        // Logique pour télécharger toutes les preuves en un seul fichier zip
        alert('Fonctionnalité de téléchargement groupé à implémenter');
    };

    return (
        <div>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Liste des preuves ({preuves.length})
                </h3>
                <button
                    onClick={handleDownloadAll}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    <Download className="h-4 w-4" />
                    Télécharger toutes les preuves
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {preuves.map((preuve) => (
                    <div
                        key={preuve.id}
                        className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white truncate">{preuve.nom}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Ajouté le {new Date(preuve.date_ajout).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${preuve.type === 'IMAGE' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                    preuve.type === 'DOCUMENT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                        preuve.type === 'VIDEO' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                }`}>
                                {preuve.type}
                            </span>
                        </div>

                        {/* Aperçu selon le type de preuve */}
                        {preuve.type === 'IMAGE' && (
                            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                                <img
                                    src={preuve.url}
                                    alt={preuve.nom}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                        // Fallback si l'image ne charge pas
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/images/placeholder-image.svg';
                                    }}
                                />
                            </div>
                        )}

                        {preuve.type === 'LIEN' && (
                            <div className="text-sm text-blue-600 dark:text-blue-400 underline truncate mb-2">
                                <a href={preuve.url} target="_blank" rel="noopener noreferrer">
                                    {preuve.url}
                                </a>
                            </div>
                        )}

                        {/* Actions disponibles */}
                        <div className="flex space-x-2 mt-2">
                            <a
                                href={preuve.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Voir
                            </a>
                            <a
                                href={preuve.url}
                                download={preuve.nom}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Télécharger
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PreuvesTab;