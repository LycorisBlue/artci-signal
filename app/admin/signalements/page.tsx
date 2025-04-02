"use client";

import { useState, useEffect, useCallback } from "react";
import {
    AlertTriangle,
    Search,
    Filter,
    SlidersHorizontal,
    ChevronDown, Eye, Clock, ArrowDownToLine, Ban, MessageCircle, Flag, MoreHorizontal,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import {
    getSignalementsList,
    SignalementFilters,
    PaginationParams,
    Signalement,
    PaginationInfo,
    SignalementStats
} from "@/lib/services/signalements/get-signalements-list";
import { SignalementStatus, PriorityLevel, STATUS_COLORS, PRIORITY_COLORS, IncidentType } from "@/lib/constants/status";
import { useRouter } from "next/navigation";
export default function SignalementsPage() {
    const router = useRouter(); // Assurez-vous que cette ligne existe

    // États pour les données
    const [signalements, setSignalements] = useState<Signalement[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [stats, setStats] = useState<SignalementStats | null>(null);

    // États pour les filtres et la pagination
    const [filters, setFilters] = useState<SignalementFilters>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limitPerPage, setLimitPerPage] = useState<number>(10);

    // états pour gérer l'ouverture/fermeture des menus d'actions
    const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);


    // États pour l'UI
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<{
        message: string;
        status?: number;
        type?: string;
        retry?: boolean;
    } | null>(null);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Fonction pour récupérer les signalements
    const fetchSignalements = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const paginationParams: PaginationParams = {
                page: currentPage,
                limit: limitPerPage
            };

            // Si searchTerm est défini, on l'ajoute aux filtres
            const currentFilters = {
                ...filters,
                ...(searchTerm ? { search: searchTerm } : {})
            };

            const response = await getSignalementsList(paginationParams, currentFilters);

            setSignalements(response.data.signalements);
            setPagination(response.data.pagination);
            setStats(response.data.stats);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Erreur lors de la récupération des signalements:", err);
            setError({
                message: err.message || "Erreur lors de la récupération des signalements",
                status: err.status,
                type: err.data?.errorType,
                retry: true
            });
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, limitPerPage, filters, searchTerm]);

    // Effet pour charger les données au chargement et lors des changements de filtres/pagination
    useEffect(() => {
        fetchSignalements();
    }, [fetchSignalements]);

    // Gestion de la recherche
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // Réinitialiser à la première page lors d'une recherche
        fetchSignalements();
    };

    // Affichage du chargement
    if (isLoading && !signalements.length) {
        return (
            <div className="h-full flex items-center justify-center py-24">
                <div className="relative h-16 w-16">
                    <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-orange-200 dark:border-orange-900/30"></div>
                    <div className="absolute top-0 left-0 h-full w-full rounded-full border-t-4 border-orange-500 animate-spin"></div>
                </div>
            </div>
        );
    }

    // Affichage des erreurs
    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Erreur
                </h2>
                <p className="mb-4">{error.message}</p>
                <button
                    onClick={fetchSignalements}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête de la page */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Signalements</h1>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                    Gestion des signalements d&apos;incidents de en ligne.
                </p>
            </div>

            {/* Barre de filtres et recherche */}
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
                {/* Barre de recherche */}
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher un signalement..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                        />
                    </div>
                </form>

                {/* Bouton pour ouvrir le panneau de filtres */}
                <button
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors shadow-sm"
                >
                    <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span>Filtres</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isFilterPanelOpen ? "rotate-180" : ""}`} />
                </button>
            </div>

            {/* Panneau de filtres (à développer) */}
            {isFilterPanelOpen && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <SlidersHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            Filtres avancés
                        </h2>
                        <button
                            onClick={() => setFilters({})}
                            className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                        >
                            Réinitialiser
                        </button>
                    </div>

                    {/* Contenu des filtres - à développer dans la section suivante */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Filtre par statut */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Statut
                            </label>
                            <select
                                value={filters.statut || ""}
                                onChange={(e) => setFilters({ ...filters, statut: e.target.value === "" ? undefined : e.target.value as SignalementStatus })}
                                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                            >
                                <option value="">Tous les statuts</option>
                                <option value={SignalementStatus.SOUMIS}>Soumis</option>
                                <option value={SignalementStatus.EN_TRAITEMENT}>En traitement</option>
                                <option value={SignalementStatus.CLOTURE}>Clôturé</option>
                                <option value={SignalementStatus.NON_PRIS_EN_CHARGE}>Non pris en charge</option>
                            </select>
                        </div>

                        {/* Filtre par type d'incident */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Type d&apos;incident
                            </label>
                            <select
                                value={filters.type_incident || ""}
                                onChange={(e) => setFilters({ ...filters, type_incident: e.target.value === "" ? undefined : e.target.value as IncidentType })}
                                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                            >
                                <option value="">Tous les types</option>
                                <option value={IncidentType.ARNAQUE}>Arnaque en ligne</option>
                                <option value={IncidentType.HARCELEMENT}>Harcèlement</option>
                                <option value={IncidentType.VOL_IDENTITE}>Vol d&apos;identité</option>
                                <option value={IncidentType.PHISHING}>Phishing</option>
                                <option value={IncidentType.CONTENU_ILLEGAL}>Diffusion de contenu illégal</option>
                                <option value={IncidentType.PIRATAGE}>Piratage de compte</option>
                                <option value={IncidentType.AUTRE}>Autre</option>
                            </select>
                        </div>

                        {/* Filtre par niveau de priorité */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Niveau de priorité
                            </label>
                            <select
                                value={filters.priority_level || ""}
                                onChange={(e) => setFilters({ ...filters, priority_level: e.target.value === "" ? undefined : e.target.value as PriorityLevel })}
                                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                            >
                                <option value="">Toutes les priorités</option>
                                <option value={PriorityLevel.NORMAL}>Normal</option>
                                <option value={PriorityLevel.IMPORTANT}>Important</option>
                                <option value={PriorityLevel.URGENT}>Urgent</option>
                                <option value={PriorityLevel.CRITIQUE}>Critique</option>
                            </select>
                        </div>

                        {/* Filtre par signalements anonymes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Anonymité
                            </label>
                            <select
                                value={filters.anonyme || ""}
                                onChange={(e) => setFilters({ ...filters, anonyme: e.target.value === "" ? undefined : e.target.value as "true" | "false" })}
                                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                            >
                                <option value="">Tous</option>
                                <option value="true">Anonymes uniquement</option>
                                <option value="false">Non-anonymes uniquement</option>
                            </select>
                        </div>

                        {/* Filtre par date de début */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Date de début
                            </label>
                            <input
                                type="date"
                                value={filters.date_debut || ""}
                                onChange={(e) => setFilters({ ...filters, date_debut: e.target.value || undefined })}
                                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                            />
                        </div>

                        {/* Filtre par date de fin */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Date de fin
                            </label>
                            <input
                                type="date"
                                value={filters.date_fin || ""}
                                onChange={(e) => setFilters({ ...filters, date_fin: e.target.value || undefined })}
                                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                            />
                        </div>
                    </div>

                    {/* Options de tri */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Trier par
                                </label>
                                <select
                                    value={filters.sort_by || "created_at"}
                                    onChange={(e) => setFilters({ ...filters, sort_by: e.target.value as "created_at" | "updated_at" | "type_incident" | "statut" | "titre" })}
                                    className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                >
                                    <option value="created_at">Date de création</option>
                                    <option value="updated_at">Date de modification</option>
                                    <option value="type_incident">Type d&apos;incident</option>
                                    <option value="statut">Statut</option>
                                    <option value="titre">Titre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Direction
                                </label>
                                <select
                                    value={filters.sort_dir || "desc"}
                                    onChange={(e) => setFilters({ ...filters, sort_dir: e.target.value as "asc" | "desc" })}
                                    className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                >
                                    <option value="desc">Décroissant</option>
                                    <option value="asc">Croissant</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => {
                                setFilters({});
                                setSearchTerm("");
                            }}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                            Réinitialiser
                        </button>
                        <button
                            onClick={() => {
                                setCurrentPage(1); // Réinitialiser à la première page lors d'un filtrage
                                fetchSignalements();
                                setIsFilterPanelOpen(false);
                            }}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Appliquer les filtres
                        </button>
                    </div>
                </div>
            )}

            {/* Statistiques des signalements */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total des signalements */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total signalements</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.total.toLocaleString()}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Anonymes</p>
                                <p className="text-lg font-semibold text-gray-800 dark:text-white">{stats.anonymes.toLocaleString()}</p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Identifiés</p>
                                <p className="text-lg font-semibold text-gray-800 dark:text-white">{(stats.total - stats.anonymes).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Signalements en cours de traitement */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">En traitement</p>
                                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500 mt-1">{stats.by_status.en_traitement.toLocaleString()}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shadow-sm">
                                <Clock className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-yellow-500 h-2.5 rounded-full"
                                    style={{ width: `${Math.round((stats.by_status.en_traitement / stats.total) * 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                                {Math.round((stats.by_status.en_traitement / stats.total) * 100)}% du total
                            </p>
                        </div>
                    </div>

                    {/* Signalements soumis */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Soumis</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-500 mt-1">{stats.by_status.soumis.toLocaleString()}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-blue-500 h-2.5 rounded-full"
                                    style={{ width: `${Math.round((stats.by_status.soumis / stats.total) * 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                                {Math.round((stats.by_status.soumis / stats.total) * 100)}% du total
                            </p>
                        </div>
                    </div>

                    {/* Signalements clôturés */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Clôturés</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-500 mt-1">{stats.by_status.cloture.toLocaleString()}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-green-500 h-2.5 rounded-full"
                                    style={{ width: `${Math.round((stats.by_status.cloture / stats.total) * 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                                {Math.round((stats.by_status.cloture / stats.total) * 100)}% du total
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tableau des signalements - à développer */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID/Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Titre/Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priorité</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Utilisateur</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {signalements.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        Aucun signalement trouvé.
                                    </td>
                                </tr>
                            ) : (
                                signalements.map((signalement) => (
                                    <tr
                                        key={signalement.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        {/* ID et Date */}
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {signalement.id.substring(0, 8)}...
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(signalement.date_creation).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </td>

                                        {/* Titre et Description */}
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {signalement.titre}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                {signalement.description}
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                {signalement.preuves_count > 0 && (
                                                    <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                        <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
                                                        {signalement.preuves_count} {signalement.preuves_count > 1 ? 'preuves' : 'preuve'}
                                                    </span>
                                                )}
                                                {signalement.commentaires_count > 0 && (
                                                    <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                        <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                                                        {signalement.commentaires_count} {signalement.commentaires_count > 1 ? 'commentaires' : 'commentaire'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Type d'incident */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {signalement.type_incident}
                                            </div>
                                            {signalement.anonyme && (
                                                <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                    Anonyme
                                                </span>
                                            )}
                                        </td>

                                        {/* Statut */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[signalement.statut as SignalementStatus] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
                                                {signalement.statut}
                                            </span>
                                        </td>

                                        {/* Priorité */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[signalement.priority_level as PriorityLevel] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
                                                {signalement.priority_level}
                                            </span>
                                        </td>

                                        {/* Utilisateur */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {signalement.utilisateur ? (
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {signalement.utilisateur.nom}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {signalement.utilisateur.email}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    Non disponible
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => {
                                                        // Naviguer vers la page de détails
                                                        router.push(`/admin/signalements/${signalement.id}`);
                                                    }}
                                                    className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors"
                                                >
                                                    Voir
                                                </button>
                                                <div className="h-4 border-r border-gray-300 dark:border-gray-700"></div>
                                                <div className="relative inline-block text-left">
                                                    <button
                                                        className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveActionMenu(activeActionMenu === signalement.id ? null : signalement.id);
                                                        }}
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Actions</span>
                                                    </button>

                                                    {/* Menu déroulant */}
                                                    {activeActionMenu === signalement.id && (
                                                        <>
                                                            {/* Overlay pour fermer le menu en cliquant ailleurs */}
                                                            <div
                                                                className="fixed inset-0 z-10"
                                                                onClick={() => setActiveActionMenu(null)}
                                                            />

                                                            {/* Menu */}
                                                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20 divide-y divide-gray-100 dark:divide-gray-700">
                                                                <div className="py-1">
                                                                    <button
                                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                        onClick={() => {
                                                                            // Naviguer vers la page de détails
                                                                            router.push(`/admin/signalements/${signalement.id}`);
                                                                            setActiveActionMenu(null);
                                                                        }}
                                                                    >
                                                                        <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                                        Voir le détail
                                                                    </button>

                                                                    <button
                                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                        onClick={() => {
                                                                            // Logique pour changer le statut
                                                                            setActiveActionMenu(null);
                                                                        }}
                                                                    >
                                                                        <Clock className="h-4 w-4 text-yellow-500" />
                                                                        Changer le statut
                                                                    </button>
                                                                </div>

                                                                <div className="py-1">
                                                                    <button
                                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                        onClick={() => {
                                                                            // Logique pour télécharger les preuves
                                                                            setActiveActionMenu(null);
                                                                        }}
                                                                    >
                                                                        <ArrowDownToLine className="h-4 w-4 text-blue-500" />
                                                                        Télécharger les preuves
                                                                    </button>

                                                                    <button
                                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                        onClick={() => {
                                                                            // Logique pour ajouter un commentaire
                                                                            setActiveActionMenu(null);
                                                                        }}
                                                                    >
                                                                        <MessageCircle className="h-4 w-4 text-green-500" />
                                                                        Ajouter un commentaire
                                                                    </button>
                                                                </div>

                                                                <div className="py-1">
                                                                    <button
                                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                        onClick={() => {
                                                                            // Logique pour signaler
                                                                            setActiveActionMenu(null);
                                                                        }}
                                                                    >
                                                                        <Flag className="h-4 w-4 text-orange-500" />
                                                                        Signaler
                                                                    </button>

                                                                    <button
                                                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                                                                        onClick={() => {
                                                                            // Logique pour rejeter
                                                                            setActiveActionMenu(null);
                                                                        }}
                                                                    >
                                                                        <Ban className="h-4 w-4" />
                                                                        Rejeter le signalement
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination et contrôles */}
            {pagination && (
                <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Affichage de {(pagination.current_page - 1) * pagination.limit + 1} à {Math.min(pagination.current_page * pagination.limit, pagination.total)} sur {pagination.total} signalements
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Sélecteur d'éléments par page */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Éléments par page:</span>
                            <select
                                value={limitPerPage}
                                onChange={(e) => {
                                    const newLimit = parseInt(e.target.value);
                                    setLimitPerPage(newLimit);
                                    setCurrentPage(1); // Réinitialiser à la première page lors du changement de limite
                                }}
                                className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        {/* Contrôles de pagination */}
                        <div className="flex space-x-2">
                            {/* Première page */}
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={!pagination.has_prev}
                                className={`px-2 py-1 rounded-md text-sm ${pagination.has_prev
                                    ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"}`}
                            >
                                &laquo;
                            </button>

                            {/* Page précédente */}
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={!pagination.has_prev}
                                className={`px-3 py-1 rounded-md text-sm ${pagination.has_prev
                                    ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"}`}
                            >
                                Précédent
                            </button>

                            {/* Indicateur de page actuelle */}
                            <div className="px-3 py-1 rounded-md text-sm bg-orange-500 text-white">
                                {pagination.current_page}
                            </div>

                            {/* Page suivante */}
                            <button
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={!pagination.has_next}
                                className={`px-3 py-1 rounded-md text-sm ${pagination.has_next
                                    ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"}`}
                            >
                                Suivant
                            </button>

                            {/* Dernière page */}
                            <button
                                onClick={() => setCurrentPage(pagination.total_pages)}
                                disabled={!pagination.has_next}
                                className={`px-2 py-1 rounded-md text-sm ${pagination.has_next
                                    ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"}`}
                            >
                                &raquo;
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}