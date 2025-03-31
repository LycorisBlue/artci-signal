/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import {
    getDashboardStats,
    DashboardStats,
    PeriodType,
    DashboardError
} from "@/lib/services/dashboard/get-dashboard-stats";
import {
    BarChart3,
    Users,
    AlertTriangle,
    FileText,
    MessageSquare,
    Bell,
    Clock,
    ChevronDown,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock8,
    AlertCircle,
    RefreshCw
} from "lucide-react";

export default function DashboardPage() {
    const [period, setPeriod] = useState<PeriodType>("month");
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<{
        message: string;
        status?: number;
        type?: string;
        retry?: boolean;
    } | null>(null);
    const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState<boolean>(false);

    // Créez fetchDashboardData comme une fonction useCallback pour pouvoir l'utiliser dans le bouton Réessayer
    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getDashboardStats(period);
            setStats(response.data);
        } catch (err) {
            // Traitement spécifique des erreurs de type DashboardError
            if (typeof err === 'object' && err !== null && 'status' in err && 'message' in err) {
                const dashboardError = err as DashboardError;

                // Gestion spéciale des erreurs d'authentification
                if (dashboardError.status === 401) {
                    setError({
                        message: "Votre session a expiré. Vous allez être redirigé vers la page de connexion.",
                        status: 401,
                        type: dashboardError.data?.errorType || 'AUTH_ERROR',
                        retry: false
                    });

                    // Redirection après un court délai
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 3000);

                    return;
                }

                // Autres erreurs du backend
                setError({
                    message: dashboardError.message,
                    status: dashboardError.status,
                    type: dashboardError.data?.errorType,
                    retry: true // On peut réessayer pour la plupart des erreurs
                });

                console.error("Erreur dashboard (typée):", dashboardError);
            } else {
                // Erreurs non typées (erreurs réseau, bugs JavaScript, etc.)
                const errorMessage = err instanceof Error ? err.message : "Erreur inconnue lors de la récupération des données";
                setError({
                    message: errorMessage,
                    retry: true
                });
                console.error("Erreur dashboard (non typée):", err);
            }
        } finally {
            setIsLoading(false);
        }
    }, [period]);

    // Utilisez fetchDashboardData dans useEffect
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handlePeriodChange = (newPeriod: PeriodType) => {
        setPeriod(newPeriod);
        setIsPeriodDropdownOpen(false);
    };

    // Helper pour obtenir l'icône de statut appropriée
    const getStatusIcon = (status: string) => {
        if (status.includes("soumis")) return <Clock8 className="h-4 w-4 text-blue-500" />;
        if (status.includes("traitement")) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        if (status.includes("clôturé")) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        return <XCircle className="h-4 w-4 text-red-500" />;
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center py-24">
                <div className="relative h-16 w-16">
                    <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-orange-200"></div>
                    <div className="absolute top-0 left-0 h-full w-full rounded-full border-t-4 border-orange-500 animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${error.status === 401 ? "bg-orange-50" : "bg-red-50"} text-${error.status === 401 ? "orange" : "red"}-700 p-6 rounded-xl shadow-sm`}>
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {error.status ? `Erreur ${error.status}` : "Erreur"}
                </h2>
                <p className="mb-4">{error.message}</p>
                {error.type && <p className="text-sm mb-4">Type: {error.type}</p>}

                {error.retry && (
                    <button
                        onClick={() => fetchDashboardData()}
                        className={`px-4 py-2 bg-${error.status === 401 ? "orange" : "red"}-100 text-${error.status === 401 ? "orange" : "red"}-700 rounded-lg hover:bg-${error.status === 401 ? "orange" : "red"}-200 transition-colors flex items-center gap-2`}
                    >
                        <RefreshCw className="h-4 w-4" />
                        Réessayer
                    </button>
                )}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-gray-500 p-6 bg-white rounded-xl shadow-sm text-center">
                Aucune donnée disponible.
            </div>
        );
    }

    // Calcul du pourcentage pour les tendances
    const calculatePercentage = (newCount: number, totalCount: number) => {
        if (totalCount === 0) return 0;
        return Math.round((newCount / totalCount) * 100);
    };

    const userPercentage = calculatePercentage(stats.utilisateurs.nouveaux, stats.utilisateurs.total);
    const signalementPercentage = calculatePercentage(stats.signalements.nouveaux, stats.signalements.total);
    const publicationPercentage = calculatePercentage(stats.publications.nouvelles, stats.publications.total);

    // Formatter les dates pour l'affichage
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date);
    };

    // Labels pour l'affichage des périodes
    const periodLabels = {
        day: "Aujourd'hui",
        week: "Cette semaine",
        month: "Ce mois",
        year: "Cette année",
        all: "Toutes les données"
    };

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Tableau de bord</h1>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                    Aperçu des statistiques et de l&apos;activité de la plateforme
                </p>
            </div>

            {/* Barre d'actions */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Tableau de bord</span>
                    <span className="text-gray-500 dark:text-gray-400">/</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                        {periodLabels[period]}
                    </span>
                </div>

                {/* Sélecteur de période - version dropdown */}
                <div className="relative z-10">
                    <button
                        onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                        className="inline-flex items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors shadow-sm min-w-44"
                    >
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <span>{periodLabels[period]}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isPeriodDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isPeriodDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-0"
                                onClick={() => setIsPeriodDropdownOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                                <div className="py-1">
                                    {(["day", "week", "month", "year", "all"] as PeriodType[]).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => handlePeriodChange(p)}
                                            className={`px-4 py-2 text-sm w-full text-left flex items-center gap-2 
                                            ${period === p
                                                    ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 font-medium"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                }`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${period === p ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"}`}></span>
                                            {periodLabels[p]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Période sélectionnée */}
            <div className="bg-white dark:bg-gray-800 px-5 py-4 rounded-xl shadow-sm text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium">
                    Période: du {formatDate(stats.metadata.periode.debut)} au {formatDate(stats.metadata.periode.fin)}
                </span>
            </div>

            {/* Cartes de statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Utilisateurs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Utilisateurs</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.utilisateurs.total.toLocaleString()}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm">
                        <span className={`flex items-center gap-1 ${userPercentage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {userPercentage > 0 ? (
                                <ArrowUpRight className="h-4 w-4" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4" />
                            )}
                            {Math.abs(userPercentage)}%
                        </span>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">{stats.utilisateurs.nouveaux.toLocaleString()} nouveaux</span>
                    </div>
                </div>

                {/* Signalements */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Signalements</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.signalements.total.toLocaleString()}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-sm">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm">
                        <span className={`flex items-center gap-1 ${signalementPercentage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {signalementPercentage > 0 ? (
                                <ArrowUpRight className="h-4 w-4" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4" />
                            )}
                            {Math.abs(signalementPercentage)}%
                        </span>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">{stats.signalements.nouveaux.toLocaleString()} nouveaux</span>
                    </div>
                </div>

                {/* Publications */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Publications</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.publications.total.toLocaleString()}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm">
                            <FileText className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm">
                        <span className={`flex items-center gap-1 ${publicationPercentage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {publicationPercentage > 0 ? (
                                <ArrowUpRight className="h-4 w-4" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4" />
                            )}
                            {Math.abs(publicationPercentage)}%
                        </span>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">{stats.publications.nouvelles.toLocaleString()} nouvelles</span>
                    </div>
                </div>

                {/* Activité */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Activité</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                                {(stats.activite.commentaires + stats.activite.notifications).toLocaleString()}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm gap-4">
                        <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300">{stats.activite.commentaires.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Bell className="h-4 w-4 text-orange-500" />
                            <span className="text-gray-700 dark:text-gray-300">{stats.activite.notifications.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section: Statistiques détaillées - Rangée 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Répartition des signalements par statut */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Signalements par statut</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {Object.entries(stats.signalements.par_statut).map(([status, count]) => {
                            const percentage = Math.round((count / stats.signalements.total) * 100);
                            let statusColor = "";

                            if (status.includes("soumis")) statusColor = "#3b82f6";
                            else if (status.includes("traitement")) statusColor = "#f59e0b";
                            else if (status.includes("clôturé")) statusColor = "#10b981";
                            else statusColor = "#ef4444";

                            return (
                                <div key={status} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(status)}
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                                {status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {count.toLocaleString()}
                                            </span>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                {percentage}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: statusColor
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Répartition des signalements par type */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Signalements par type</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {stats.signalements.par_type.map((item) => {
                            const percentage = Math.round((item.count / stats.signalements.total) * 100);
                            return (
                                <div key={item.type} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {item.type}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {item.count.toLocaleString()}
                                            </span>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                {percentage}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Répartition des utilisateurs par rôle */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Utilisateurs par rôle</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {Object.entries(stats.utilisateurs.par_role).map(([role, count]) => {
                            const percentage = Math.round((count / stats.utilisateurs.total) * 100);
                            let roleColor = "";

                            if (role === "root") roleColor = "#a855f7";
                            else if (role === "admin") roleColor = "#2563eb";
                            else roleColor = "#6366f1";

                            return (
                                <div key={role} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                            {role}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {count.toLocaleString()}
                                            </span>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                {percentage}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: roleColor
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Section: Activité par jour */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Activité par jour</h2>
                </div>
                <div className="p-6">
                    <div className="h-64 flex items-end justify-between space-x-2">
                        {stats.activite.par_jour.map((day) => {
                            const maxValue = Math.max(...stats.activite.par_jour.map(d => d.signalements));
                            const height = maxValue > 0 ? (day.signalements / maxValue) * 100 : 0;
                            const date = new Date(day.date);
                            const formattedDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date);

                            return (
                                <div key={day.date} className="flex flex-col items-center flex-1">
                                    <div
                                        className="w-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200 rounded-t-lg cursor-pointer relative group"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {day.signalements} signalements
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate w-full text-center">
                                        {formattedDate}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Section: Événements système récents */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Événements système récents</h2>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">
                        {stats.evenements_systeme.length} événements
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {stats.evenements_systeme.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(event.date)}
                                        <div className="text-xs text-gray-400 dark:text-gray-500">
                                            {new Date(event.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">
                                        {event.message}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {event.source}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {event.action}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.status === "SUCCESS"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : event.status === "WARNING"
                                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                            }`}
                                        >
                                            {event.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}