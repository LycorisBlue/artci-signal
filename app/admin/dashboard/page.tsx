"use client";

import { useState, useEffect } from "react";
import {
    getDashboardStats,
    DashboardStats,
    PeriodType
} from "@/lib/services/dashboard/get-dashboard-stats";
import {
    BarChart3,
    Users,
    AlertTriangle,
    FileText,
    MessageSquare,
    TrendingUp,
    TrendingDown,
    Bell,
    Clock,
} from "lucide-react";

export default function DashboardPage() {
    const [period, setPeriod] = useState<PeriodType>("month");
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getDashboardStats(period);
                setStats(response.data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.message || "Erreur lors de la récupération des données");
                console.error("Erreur dashboard:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [period]);

    const handlePeriodChange = (newPeriod: PeriodType) => {
        setPeriod(newPeriod);
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin h-12 w-12 border-4 border-orange-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Erreur</h2>
                <p>{error}</p>
                <button
                    onClick={() => getDashboardStats(period)}
                    className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-gray-500">Aucune donnée disponible.</div>
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

    return (
        <div className="space-y-6">
            {/* En-tête avec le titre et le sélecteur de période */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Tableau de bord
                </h1>

                <div className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm flex">
                    {(["day", "week", "month", "year", "all"] as PeriodType[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => handlePeriodChange(p)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${period === p
                                    ? "bg-orange-500 text-white"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                        >
                            {p === "day" && "Jour"}
                            {p === "week" && "Semaine"}
                            {p === "month" && "Mois"}
                            {p === "year" && "Année"}
                            {p === "all" && "Tout"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Période sélectionnée */}
            <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-sm text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                    Période: du {new Date(stats.metadata.periode.debut).toLocaleDateString()} au {new Date(stats.metadata.periode.fin).toLocaleDateString()}
                </span>
            </div>

            {/* Cartes de statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Utilisateurs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Utilisateurs</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.utilisateurs.total}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm">
                        <span className={`flex items-center ${userPercentage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {userPercentage > 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(userPercentage)}%
                        </span>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">{stats.utilisateurs.nouveaux} nouveaux</span>
                    </div>
                </div>

                {/* Signalements */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Signalements</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.signalements.total}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm">
                        <span className={`flex items-center ${signalementPercentage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {signalementPercentage > 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(signalementPercentage)}%
                        </span>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">{stats.signalements.nouveaux} nouveaux</span>
                    </div>
                </div>

                {/* Publications */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Publications</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.publications.total}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                            <FileText className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm">
                        <span className={`flex items-center ${publicationPercentage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {publicationPercentage > 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(publicationPercentage)}%
                        </span>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">{stats.publications.nouvelles} nouvelles</span>
                    </div>
                </div>

                {/* Activité */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Activité</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.activite.commentaires + stats.activite.notifications}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm gap-4">
                        <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1 text-blue-500" />
                            <span className="text-gray-500 dark:text-gray-400">{stats.activite.commentaires}</span>
                        </div>
                        <div className="flex items-center">
                            <Bell className="h-4 w-4 mr-1 text-orange-500" />
                            <span className="text-gray-500 dark:text-gray-400">{stats.activite.notifications}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section: Statistiques détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Répartition des signalements par statut */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Signalements par statut</h2>
                    <div className="space-y-3">
                        {Object.entries(stats.signalements.par_statut).map(([status, count]) => (
                            <div key={status} className="flex items-center">
                                <div className="w-3/5">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{status}</div>
                                </div>
                                <div className="w-2/5">
                                    <div className="relative pt-1">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{count}</div>
                                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                                {Math.round((count / stats.signalements.total) * 100)}%
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                                            <div
                                                style={{
                                                    width: `${(count / stats.signalements.total) * 100}%`,
                                                    backgroundColor: status.includes("soumis") ? "#3b82f6" :
                                                        status.includes("traitement") ? "#f59e0b" :
                                                            status.includes("clôturé") ? "#10b981" :
                                                                "#ef4444"
                                                }}
                                                className="rounded-full"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Répartition des signalements par type */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Signalements par type</h2>
                    <div className="space-y-3">
                        {stats.signalements.par_type.map((item) => (
                            <div key={item.type} className="flex items-center">
                                <div className="w-3/5">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.type}</div>
                                </div>
                                <div className="w-2/5">
                                    <div className="relative pt-1">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{item.count}</div>
                                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                                {Math.round((item.count / stats.signalements.total) * 100)}%
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                                            <div
                                                style={{ width: `${(item.count / stats.signalements.total) * 100}%` }}
                                                className="rounded-full bg-indigo-500"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Répartition des utilisateurs par rôle */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Utilisateurs par rôle</h2>
                    <div className="space-y-3">
                        {Object.entries(stats.utilisateurs.par_role).map(([role, count]) => (
                            <div key={role} className="flex items-center">
                                <div className="w-3/5">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{role}</div>
                                </div>
                                <div className="w-2/5">
                                    <div className="relative pt-1">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{count}</div>
                                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                                {Math.round((count / stats.utilisateurs.total) * 100)}%
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                                            <div
                                                style={{
                                                    width: `${(count / stats.utilisateurs.total) * 100}%`,
                                                    backgroundColor: role === "root" ? "#a855f7" :
                                                        role === "admin" ? "#2563eb" :
                                                            "#6366f1"
                                                }}
                                                className="rounded-full"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section: Activité par jour */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Activité par jour</h2>
                <div className="h-64 flex items-end justify-between space-x-2">
                    {stats.activite.par_jour.map((day) => {
                        const maxValue = Math.max(...stats.activite.par_jour.map(d => d.signalements));
                        const height = (day.signalements / maxValue) * 100;

                        return (
                            <div key={day.date} className="flex flex-col items-center flex-1">
                                <div
                                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer relative group"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {day.signalements} signalements
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate w-full text-center">
                                    {new Date(day.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Section: Événements système récents */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Événements système récents</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Message</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {stats.evenements_systeme.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(event.date).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-300">
                                        {event.message}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {event.source}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {event.action}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.status === "SUCCESS" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                                event.status === "WARNING" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                                    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                            }`}>
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