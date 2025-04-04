"use client";

import { useParams } from "next/navigation";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

// Composants
import SignalementHeader from "@/components/signalements/SignalementHeader";
import SignalementStatusCards from "@/components/signalements/SignalementStatusCards";
import SignalementTabContent from "@/components/signalements/SignalementTabContent";

// Composants d'onglets
import DetailsTab from "@/components/signalements/tabs/DetailsTab";
import PreuvesTab from "@/components/signalements/tabs/PreuvesTab";
import CommentairesTab from "@/components/signalements/tabs/CommentairesTab";
import ActionsTab from "@/components/signalements/tabs/ActionsTab";
import { useSignalementDetail } from "@/lib/services/signalements/get-signalement-details";
import { useState } from "react";
import Toast, { ToastType } from "@/components/common/Toast";

// Services et hooks

const SignalementDetailPage = () => {
    const { id } = useParams();
    const { data: signalement, isLoading, error, refetch } = useSignalementDetail(id as string);

    const [toast, setToast] = useState<{
        message: string;
        type: ToastType;
        visible: boolean;
    }>({
        message: '',
        type: 'success',
        visible: false
    });

    // Fonction pour afficher le toast
    const showToast = (message: string, type: ToastType) => {
        setToast({
            message,
            type,
            visible: true
        });
    };

    // Fonction pour fermer le toast
    const closeToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    // Fonction qui sera appelée après un téléversement réussi
    const handlePreuveUpload = () => {
        showToast('Preuves téléversées avec succès ! Mise à jour des données...', 'success');
        refetch();
    };

    const handleCommentAdded = () => {
        showToast('Commentaire ajouté avec succès !', 'success');
        refetch();
    };

    // Gérer l'affichage des erreurs
    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Erreur {error.status || ''}
                </h2>
                <p className="mb-4">{error.message}</p>
                <div className="flex gap-4">
                    <Link
                        href="/admin/signalements"
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        Retour à la liste
                    </Link>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête de la page */}
            <SignalementHeader
                titre={signalement?.titre}
                id={signalement?.id}
                dateCreation={signalement?.date_creation}
                isLoading={isLoading}
                refetch={refetch}
            />

            {/* Cartes d'état */}
            <SignalementStatusCards
                statut={signalement?.statut}
                typeIncident={signalement?.type_incident}
                priorityLevel={signalement?.priority_level}
                isLoading={isLoading}
            />

            {/* Contenu principal organisé en onglets */}
            <SignalementTabContent
                preuvesCount={signalement?.preuves?.length}
                commentairesCount={signalement?.commentaires?.length}
                signalementId={id as string}
                isLoading={isLoading}

                detailsComponent={<DetailsTab signalement={signalement} isLoading={isLoading} />}
                preuvesComponent={<PreuvesTab preuves={signalement?.preuves || []} isLoading={isLoading} signalementId={id as string} onUploadSuccess={handlePreuveUpload} />}
                commentairesComponent={<CommentairesTab
                    commentaires={signalement?.commentaires || []}
                    signalementId={id as string}
                    isLoading={isLoading}
                    onCommentAdded={handleCommentAdded}
                />}
                actionsComponent={<ActionsTab
                    signalement={signalement}
                    onStatusChange={refetch}
                    isLoading={isLoading}
                />}
            />
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
                onClose={closeToast}
                duration={3000}
            />
        </div>
    );
};

export default SignalementDetailPage;