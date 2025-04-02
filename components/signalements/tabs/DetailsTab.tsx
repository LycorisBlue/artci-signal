import React from 'react';
import { Calendar, User, Map } from 'lucide-react';
import { SignalementDetail } from '@/lib/services/signalements/get-signalement-details';

import dynamic from 'next/dynamic';

// Importer dynamiquement la carte pour éviter les problèmes de rendu côté serveur
const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">Chargement de la carte...</span>
        </div>
    )
});

interface DetailsTabProps {
    signalement: SignalementDetail | null | undefined;
    isLoading: boolean;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ signalement, isLoading }) => {
    // Rendu pendant le chargement
    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>

                <div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Si aucun signalement n'est disponible
    if (!signalement) {
        return (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                Aucune information détaillée disponible.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Description */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {signalement.description}
                </div>
            </div>

            {/* Informations d'identification */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Informations du signalement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dates */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" /> Dates
                        </h4>
                        <dl className="space-y-2">
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Date de création</dt>
                                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                                    {new Date(signalement.date_creation).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Dernière modification</dt>
                                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                                    {new Date(signalement.date_modification).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Utilisateur */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" /> Utilisateur
                        </h4>
                        {signalement.anonyme ? (
                            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                                Signalement anonyme
                            </div>
                        ) : signalement.utilisateur ? (
                            <dl className="space-y-2">
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-500 dark:text-gray-400">Nom</dt>
                                    <dd className="text-sm font-medium text-gray-900 dark:text-white">{signalement.utilisateur.nom}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-sm text-gray-500 dark:text-gray-400">Email</dt>
                                    <dd className="text-sm font-medium text-gray-900 dark:text-white">{signalement.utilisateur.email}</dd>
                                </div>
                            </dl>
                        ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                                Informations utilisateur non disponibles
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Localisation - Affichée uniquement si disponible */}
            {signalement?.localisation && (
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Map className="h-5 w-5 text-gray-500" /> Localisation
                    </h3>

                    {/* Carte Leaflet */}
                    <div className="h-64 rounded-lg overflow-hidden">
                        <MapComponent
                            latitude={signalement.localisation.latitude}
                            longitude={signalement.localisation.longitude}
                            title={signalement.titre}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailsTab;