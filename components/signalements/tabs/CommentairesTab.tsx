import React, { useState } from 'react';
import { Send, RefreshCw, AlertTriangle } from 'lucide-react';
import { Commentaire } from '@/lib/services/signalements/get-signalement-details';

interface CommentairesTabProps {
    commentaires: Commentaire[];
    signalementId: string;
    isLoading: boolean;
}

const CommentairesTab: React.FC<CommentairesTabProps> = ({
    commentaires,
    isLoading
}) => {
    const [newComment, setNewComment] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // Fonction qui serait appelée pour ajouter un commentaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSending(true);
        try {
            // Ici, vous implémenteriez l'appel à votre API pour ajouter un commentaire
            // Exemple: await addCommentService(signalementId, newComment, isInternal);

            // Simulons un délai d'API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Réinitialiser le formulaire après succès
            setNewComment('');
            alert('Commentaire ajouté avec succès!');

            // Idéalement, vous auriez une fonction de callback pour rafraîchir les données
            // ou utiliseriez un state manager comme Redux, Zustand, etc.
        } catch (error) {
            console.error('Erreur lors de l\'ajout du commentaire:', error);
            alert('Une erreur est survenue lors de l\'ajout du commentaire.');
        } finally {
            setIsSending(false);
        }
    };

    // Rendu pendant le chargement
    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="flex justify-between">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                </div>

                <div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
                    <div className="space-y-4">
                        {[1, 2].map(item => (
                            <div key={item} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
                        ))}
                    </div>
                </div>
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
                                            {commentaire.auteur.nom.charAt(0).toUpperCase()}
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
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
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