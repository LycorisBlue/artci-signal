import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, RefreshCw, Download, Share2 } from 'lucide-react';

interface SignalementHeaderProps {
    titre?: string;
    id?: string;
    dateCreation?: string;
    isLoading: boolean;
    refetch: () => void;
}

const SignalementHeader: React.FC<SignalementHeaderProps> = ({
    titre,
    id,
    dateCreation,
    isLoading,
    refetch
}) => {
    const router = useRouter();

    // Extraire les 8 premiers caractères de l'ID pour l'affichage
    const shortId = id ? `${id.substring(0, 8)}...` : '';

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            {/* Titre et fil d'Ariane */}
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Link
                        href="/admin/signalements"
                        className="hover:text-orange-500 transition-colors"
                    >
                        Signalements
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white">Détail du signalement</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate max-w-2xl">
                    {isLoading ? (
                        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64"></div>
                    ) : (
                        titre || "Détail du signalement"
                    )}
                </h1>

                {id && dateCreation && !isLoading ? (
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {shortId}
                        </span>
                        <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Créé le {new Date(dateCreation).toLocaleDateString('fr-FR')}
                        </span>
                    </div>
                ) : isLoading ? (
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mt-2"></div>
                ) : null}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-3">
                {/* Bouton Retour */}
                <button
                    onClick={() => router.push('/admin/signalements')}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Retour à la liste des signalements"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Retour</span>
                </button>

                {/* Bouton Actualiser */}
                <button
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    aria-label="Actualiser les informations"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Actualiser</span>
                </button>

                {/* Actions additionnelles (conditionnellement rendues si un signalement existe) */}
                {id && !isLoading && (
                    <>
                        <button
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Télécharger le rapport"
                        >
                            <Download className="h-4 w-4" />
                            <span>Exporter</span>
                        </button>

                        <button
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                            aria-label="Partager le signalement"
                        >
                            <Share2 className="h-4 w-4" />
                            <span>Partager</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SignalementHeader;