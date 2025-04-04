"use client";

import { useState } from "react";
import {
    useDashboardStats,
    PeriodType,
} from "@/lib/services/dashboard/get-dashboard-stats";
import {
    AlertTriangle,
    Clock,
    ChevronDown,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock8,
    AlertCircle,
    RefreshCw
} from "lucide-react";
import PieChartCard, { PieChartDataItem } from '@/components/dashboard/PieChartCard';
import ActivityChart from '@/components/dashboard/ActivityChart';
import StatsCards from "@/components/dashboard/StatsCards";
import SystemEvents, { SystemEvent } from "@/components/dashboard/SystemEvents";

export default function DashboardPage() {
    const [period, setPeriod] = useState<PeriodType>("month");
    const { data: stats, isLoading, error } = useDashboardStats(period);
    const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState<boolean>(false);

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
            <div className={`bg-red-50 text-red-700 p-6 rounded-xl shadow-sm`}>
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {error.status ? `Erreur ${error.status}` : "Erreur"}
                </h2>
                <p className="mb-4">{error.message}</p>
                {error.data?.errorType && <p className="text-sm mb-4">Type: {error.data.errorType}</p>}

                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Réessayer
                </button>
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

    // Maintenant que nous savons que stats n'est pas null, nous pouvons préparer les données pour les graphiques
    // Préparation des données pour les graphiques
    const statusChartData: PieChartDataItem[] = Object.entries(stats.signalements.par_statut).map(([status, count]) => {
        let color = "";
        if (status.includes("soumis")) color = "#3b82f6"; // blue-500
        else if (status.includes("traitement")) color = "#f59e0b"; // amber-500
        else if (status.includes("clôturé")) color = "#10b981"; // emerald-500
        else color = "#ef4444"; // red-500

        return {
            name: status,
            value: count,
            color: color,
            icon: getStatusIcon(status)
        };
    });

    const typeChartData: PieChartDataItem[] = stats.signalements.par_type.map((item) => ({
        name: item.type,
        value: item.count,
        color: "#6366f1" // indigo-500
    }));

    const events: SystemEvent[] = stats.evenements_systeme;

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
            <StatsCards stats={stats} />

            {/* Section: Statistiques détaillées - Rangée 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Répartition des signalements par statut */}
                <PieChartCard
                    title="Signalements par statut"
                    data={statusChartData}
                    total={stats.signalements.total}
                />

                {/* Répartition des signalements par type */}
                <PieChartCard
                    title="Signalements par type"
                    data={typeChartData}
                    total={stats.signalements.total}
                />
            </div>
            {/* Section: Activité par jour avec le nouveau composant */}
            <ActivityChart data={stats.activite.par_jour} />

            {/* Section: Événements système récents */}
            <SystemEvents events={events} formatDate={formatDate} />
        </div>
    );
}