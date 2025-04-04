// components/signalements/tabs/CommentairesTab.tsx
import React, { useState } from 'react';
import { Send, RefreshCw, AlertTriangle, User, Clock } from 'lucide-react';
import { Commentaire } from '@/lib/services/signalements/get-signalement-details';
import { createComment } from '@/lib/services/signalements/comment';

interface CommentairesTabProps {
    commentaires: Commentaire[];
    signalementId: string;
    isLoading: boolean;
    onCommentAdded?: () => void; // Callback pour rafraîchir les données
}

const CommentairesTab: React.FC<CommentairesTabProps> = ({
    commentaires,
    signalementId,
    isLoading,
    onCommentAdded
}) => {
    const [newComment, setNewComment] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour ajouter un commentaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSending(true);
        setError(null);

        try {
            // Appel au service d'ajout de commentaire
            await createComment(signalementId, newComment, isInternal);

            // Réinitialiser le formulaire après succès
            setNewComment('');

            // Appeler le callback pour rafraîchir les données
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du commentaire:', error);
            setError('Une erreur est survenue lors de l\'ajout du commentaire. Veuillez réessayer.');
        } finally {
            setIsSending(false);
        }
    };

    // Rendu pendant le chargement
    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                {/* Le même code de chargement que vous avez déjà */}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Formulaire d'ajout de commentaire */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ajouter un commentaire</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Rédigez votre commentaire ici..."
                            className="w-full min-h-24 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-3 text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            disabled={isSending}
                            aria-label="Texte du commentaire"
                        ></textarea>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="comment-internal"
                                checked={isInternal}
                                onChange={(e) => setIsInternal(e.target.checked)}
                                className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                disabled={isSending}
                            />
                            <label htmlFor="comment-internal" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                Commentaire interne (non visible par l&apos;utilisateur)
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSending || !newComment.trim()}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isSending || !newComment.trim()
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                                }`}
                        >
                            {isSending ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Envoyer
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Liste des commentaires */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Historique des commentaires ({commentaires.length})
                </h3>

                {commentaires.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        Aucun commentaire pour ce signalement.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {commentaires.map((commentaire) => (
                            <div
                                key={commentaire.id}
                                className={`p-4 rounded-lg ${commentaire.interne
                                    ? 'bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30'
                                    : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <div className="flex justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {commentaire.auteur.nom}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {commentaire.auteur.role === 'admin' ? 'Administrateur' :
                                                    commentaire.auteur.role === 'root' ? 'Super administrateur' : 'Citoyen'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                        <Clock className="h-3.5 w-3.5" />
                                        {new Date(commentaire.date).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>

                                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                                    {commentaire.contenu}
                                </div>

                                {commentaire.interne && (
                                    <div className="mt-2 text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        Commentaire interne (non visible par l&apos;utilisateur)
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentairesTab;