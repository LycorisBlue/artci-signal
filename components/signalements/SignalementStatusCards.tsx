import React from 'react';
import { SignalementStatus, PriorityLevel, STATUS_COLORS, PRIORITY_COLORS } from "@/lib/constants/status";

interface SignalementStatusCardsProps {
    statut?: string;
    typeIncident?: string;
    priorityLevel?: string;
    isLoading: boolean;
}

const SignalementStatusCards: React.FC<SignalementStatusCardsProps> = ({
    statut,
    typeIncident,
    priorityLevel,
    isLoading
}) => {
    // Génère un placeholder pour le chargement
    const renderPlaceholder = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex justify-between items-center">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    // Si en chargement, afficher les placeholders
    if (isLoading) {
        return renderPlaceholder();
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Carte Statut */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Statut</span>
                    {statut ? (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[statut as SignalementStatus] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
                            {statut}
                        </span>
                    ) : (
                        <span className="text-sm italic text-gray-400 dark:text-gray-500">Non défini</span>
                    )}
                </div>
            </div>

            {/* Carte Type d'incident */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Type d&apos;incident</span>
                    {typeIncident ? (
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {typeIncident}
                        </span>
                    ) : (
                        <span className="text-sm italic text-gray-400 dark:text-gray-500">Non défini</span>
                    )}
                </div>
            </div>

            {/* Carte Priorité */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Priorité</span>
                    {priorityLevel ? (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[priorityLevel as PriorityLevel] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
                            {priorityLevel}
                        </span>
                    ) : (
                        <span className="text-sm italic text-gray-400 dark:text-gray-500">Non définie</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignalementStatusCards;