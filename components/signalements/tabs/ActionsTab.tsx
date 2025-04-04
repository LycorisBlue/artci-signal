import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle, Flag } from 'lucide-react';
import { SignalementStatus, PriorityLevel, ALLOWED_STATUS_TRANSITIONS } from "@/lib/constants/status";
import { SignalementDetail } from '@/lib/services/signalements/get-signalement-details';
import { updateSignalementPriority } from '@/lib/services/signalements/flag';
import { changeSignalementStatus } from "@/lib/services/signalements/update-status";
import { markSignalementAsSpam } from '@/lib/services/signalements/spam';

interface ActionsTabProps {
    signalement: SignalementDetail | null | undefined;
    onStatusChange: () => void;
    isLoading: boolean;
}

const ActionsTab: React.FC<ActionsTabProps> = ({
    signalement,
    onStatusChange,
    isLoading
}) => {
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedPriority, setSelectedPriority] = useState<string>('');
    const [statusChangeNote, setStatusChangeNote] = useState<string>('');
    const [spamReason, setSpamReason] = useState<string>('');

    // États de chargement séparés pour chaque action
    const [isStatusSubmitting, setIsStatusSubmitting] = useState<boolean>(false);
    const [isPrioritySubmitting, setIsPrioritySubmitting] = useState<boolean>(false);
    const [isSpamSubmitting, setIsSpamSubmitting] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);

    // Reset états quand le signalement change
    useEffect(() => {
        if (signalement) {
            setSelectedStatus(signalement.statut);
            setSelectedPriority(signalement.priority_level || '');
        }
    }, [signalement]);

    // Fonction pour changer le statut
    const handleStatusChange = async () => {
        if (!signalement) return;
        if (selectedStatus === signalement.statut) {
            setError('Aucun changement de statut détecté.');
            return;
        }

        if (!statusChangeNote.trim()) {
            setError('Veuillez ajouter une note expliquant le changement de statut.');
            return;
        }

        setIsStatusSubmitting(true);
        setError(null);

        try {
            await changeSignalementStatus(
                signalement.id,
                selectedStatus as SignalementStatus,
                statusChangeNote
            );

            setStatusChangeNote('');
            onStatusChange(); // Rafraîchir les données du signalement
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Erreur lors du changement de statut:', error);
            setError(error.message || 'Une erreur est survenue lors du changement de statut.');
        } finally {
            setIsStatusSubmitting(false);
        }
    };

    // Fonction pour changer la priorité
    const handlePriorityChange = async () => {
        if (!signalement) return;
        if (selectedPriority === signalement.priority_level) {
            setError('Aucun changement de priorité détecté.');
            return;
        }

        setIsPrioritySubmitting(true);
        setError(null);

        try {
            await updateSignalementPriority(
                signalement.id,
                selectedPriority as PriorityLevel
            );
            console.log(`Priorité changée avec succès à "${selectedPriority}"`);
            onStatusChange(); // Rafraîchir les données du signalement
        } catch (error) {
            console.error('Erreur lors du changement de priorité:', error);
            setError('Une erreur est survenue lors du changement de priorité.');
        } finally {
            setIsPrioritySubmitting(false);
        }
    };

    // Fonction pour signaler comme spam
    const handleMarkAsSpam = async () => {
        if (!signalement) return;

        if (!spamReason.trim()) {
            setError('Veuillez indiquer une raison pour marquer ce signalement comme spam.');
            return;
        }

        const confirmSpam = window.confirm(
            'Êtes-vous sûr de vouloir marquer ce signalement comme spam ? Cette action changera son statut.'
        );

        if (!confirmSpam) return;

        setIsSpamSubmitting(true);
        setError(null);

        try {
            await markSignalementAsSpam(signalement.id, spamReason, true);
            console.log('Signalement marqué comme spam avec succès.');
            setSpamReason('');
            onStatusChange(); // Rafraîchir les données du signalement
        } catch (error) {
            console.error('Erreur lors du marquage comme spam:', error);
            setError('Une erreur est survenue lors du marquage comme spam.');
        } finally {
            setIsSpamSubmitting(false);
        }
    };

    // Rendu pendant le chargement
    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
                    <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
                </div>
                <div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
                    <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
                </div>
            </div>
        );
    }

    // Si aucun signalement n'est disponible
    if (!signalement) {
        return (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                Aucun signalement disponible.
            </div>
        );
    }

    // Options de statut disponibles basées sur les transitions autorisées
    const availableStatusOptions = ALLOWED_STATUS_TRANSITIONS[signalement.statut as SignalementStatus] || [];
    const priorityOptions = Object.values(PriorityLevel);

    // Fonction pour déterminer si un élément est désactivé en fonction de plusieurs critères
    const isStatusButtonDisabled = isStatusSubmitting || isPrioritySubmitting || isSpamSubmitting ||
        selectedStatus === signalement.statut || !statusChangeNote.trim();

    const isPriorityButtonDisabled = isStatusSubmitting || isPrioritySubmitting || isSpamSubmitting ||
        selectedPriority === signalement.priority_level || selectedPriority === '';

    const isSpamButtonDisabled = isStatusSubmitting || isPrioritySubmitting || isSpamSubmitting ||
        !spamReason.trim();

    return (
        <div className="space-y-8">
            {/* Changement de statut */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Changer le statut</h3>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Statut actuel: <span className="font-semibold">{signalement.statut}</span>
                        </label>
                        <select
                            id="status-select"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            disabled={isStatusSubmitting}
                        >
                            <option value={signalement.statut}>{signalement.statut}</option>
                            {availableStatusOptions.map((status) => (
                                status !== signalement.statut && (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                )
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="status-note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Note de changement de statut
                        </label>
                        <textarea
                            id="status-note"
                            value={statusChangeNote}
                            onChange={(e) => setStatusChangeNote(e.target.value)}
                            placeholder="Expliquez brièvement la raison du changement de statut..."
                            className="w-full min-h-20 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-3 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            disabled={isStatusSubmitting}
                        ></textarea>
                    </div>

                    <button
                        onClick={handleStatusChange}
                        disabled={isStatusButtonDisabled}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isStatusButtonDisabled
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                    >
                        {isStatusSubmitting ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Mise à jour...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                Mettre à jour le statut
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Changement de priorité */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Changer la priorité</h3>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="priority-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Priorité actuelle: <span className="font-semibold">{signalement.priority_level || 'Non définie'}</span>
                        </label>
                        <select
                            id="priority-select"
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            disabled={isPrioritySubmitting}
                        >
                            <option value="">Sélectionner une priorité</option>
                            {priorityOptions.map((priority) => (
                                <option key={priority} value={priority}>
                                    {priority}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handlePriorityChange}
                        disabled={isPriorityButtonDisabled}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isPriorityButtonDisabled
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                            }`}
                    >
                        {isPrioritySubmitting ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Mise à jour...
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="h-4 w-4" />
                                Mettre à jour la priorité
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Marquer comme spam - Affiché seulement si le signalement n'est pas déjà marqué comme spam */}
            {signalement.statut !== 'spam' && (
                <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-900/30">
                    <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-4">Signaler comme spam</h3>

                    <div className="space-y-4">
                        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                            Cette action marquera le signalement comme spam et changera son statut.
                            Cette action peut être annulée ultérieurement.
                        </p>

                        <div>
                            <label htmlFor="spam-reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Raison du marquage comme spam
                            </label>
                            <textarea
                                id="spam-reason"
                                value={spamReason}
                                onChange={(e) => setSpamReason(e.target.value)}
                                placeholder="Indiquez pourquoi ce signalement est considéré comme spam..."
                                className="w-full min-h-20 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-3 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                disabled={isSpamSubmitting}
                            ></textarea>
                        </div>

                        <button
                            onClick={handleMarkAsSpam}
                            disabled={isSpamButtonDisabled}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isSpamButtonDisabled
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                                    : 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400'
                                }`}
                        >
                            {isSpamSubmitting ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    Traitement...
                                </>
                            ) : (
                                <>
                                    <Flag className="h-4 w-4" />
                                    Marquer comme spam
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionsTab;