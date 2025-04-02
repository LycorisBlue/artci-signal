import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle, Ban } from 'lucide-react';
import { SignalementStatus, PriorityLevel } from '@/lib/constants/status';
import { SignalementDetail } from '@/lib/services/signalements/get-signalement-details';

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
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
            alert('Aucun changement de statut détecté.');
            return;
        }

        if (!statusChangeNote.trim()) {
            alert('Veuillez ajouter une note expliquant le changement de statut.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Simuler un appel API pour changer le statut
            // Dans un cas réel, vous appelleriez votre API ici
            // Exemple: await updateSignalementStatus(signalement.id, selectedStatus, statusChangeNote);
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert(`Statut changé avec succès de "${signalement.statut}" à "${selectedStatus}"`);
            setStatusChangeNote('');
            onStatusChange(); // Rafraîchir les données du signalement
        } catch (error) {
            console.error('Erreur lors du changement de statut:', error);
            alert('Une erreur est survenue lors du changement de statut.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fonction pour changer la priorité
    const handlePriorityChange = async () => {
        if (!signalement) return;
        if (selectedPriority === signalement.priority_level) {
            alert('Aucun changement de priorité détecté.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Simuler un appel API pour changer la priorité
            // Dans un cas réel, vous appelleriez votre API ici
            // Exemple: await updateSignalementPriority(signalement.id, selectedPriority);
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert(`Priorité changée avec succès à "${selectedPriority}"`);
            onStatusChange(); // Rafraîchir les données du signalement
        } catch (error) {
            console.error('Erreur lors du changement de priorité:', error);
            alert('Une erreur est survenue lors du changement de priorité.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fonction pour rejeter le signalement
    const handleRejectSignalement = async () => {
        if (!signalement) return;

        const confirmReject = window.confirm(
            'Êtes-vous sûr de vouloir rejeter ce signalement ? Cette action ne peut pas être annulée.'
        );

        if (!confirmReject) return;

        setIsSubmitting(true);
        try {
            // Simuler un appel API pour rejeter le signalement
            // Dans un cas réel, vous appelleriez votre API ici
            // Exemple: await rejectSignalement(signalement.id);
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('Signalement rejeté avec succès.');
            onStatusChange(); // Rafraîchir les données du signalement
        } catch (error) {
            console.error('Erreur lors du rejet du signalement:', error);
            alert('Une erreur est survenue lors du rejet du signalement.');
        } finally {
            setIsSubmitting(false);
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

    // Options de statut disponibles
    const statusOptions = Object.values(SignalementStatus);
    const priorityOptions = Object.values(PriorityLevel);

    return (
        <div className="space-y-8">
            {/* Changement de statut */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Changer le statut</h3>

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
                            disabled={isSubmitting}
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
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
                            disabled={isSubmitting}
                        ></textarea>
                    </div>

                    <button
                        onClick={handleStatusChange}
                        disabled={isSubmitting || selectedStatus === signalement.statut || !statusChangeNote.trim()}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isSubmitting || selectedStatus === signalement.statut || !statusChangeNote.trim()
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                    >
                        {isSubmitting ? (
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
                            disabled={isSubmitting}
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
                        disabled={isSubmitting || selectedPriority === signalement.priority_level || selectedPriority === ''}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isSubmitting || selectedPriority === signalement.priority_level || selectedPriority === ''
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                            }`}
                    >
                        {isSubmitting ? (
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

            {/* Actions avancées */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-900/30">
                <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-4">Actions avancées</h3>

                <div className="space-y-2">
                    <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                        Attention : Les actions ci-dessous sont définitives et ne peuvent pas être annulées.
                    </p>

                    <button
                        onClick={handleRejectSignalement}
                        disabled={isSubmitting}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isSubmitting
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                                : 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Traitement...
                            </>
                        ) : (
                            <>
                                <Ban className="h-4 w-4" />
                                Rejeter le signalement
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionsTab;