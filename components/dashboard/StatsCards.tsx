/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/StatsCards.tsx
import React from 'react';
import StatCard, { StatCardData } from './StatCard';
import { Users, AlertTriangle, FileText, BarChart3, MessageSquare, Bell } from "lucide-react";

interface StatsCardsProps {
    stats: any;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
    const calculatePercentage = (newCount: number, total: number): number => {
        return total === 0 ? 0 : Math.round((newCount / total) * 100);
    };

    const statCardsData: StatCardData[] = [
        {
            title: "Utilisateurs",
            total: stats.utilisateurs.total,
            newCount: stats.utilisateurs.nouveaux,
            percentage: calculatePercentage(stats.utilisateurs.nouveaux, stats.utilisateurs.total),
            icon: <Users className="h-6 w-6" />,
            iconContainerClasses: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
        },
        {
            title: "Signalements",
            total: stats.signalements.total,
            newCount: stats.signalements.nouveaux,
            percentage: calculatePercentage(stats.signalements.nouveaux, stats.signalements.total),
            icon: <AlertTriangle className="h-6 w-6" />,
            iconContainerClasses: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
        },
        {
            title: "Publications",
            total: stats.publications.total,
            newCount: stats.publications.nouvelles,
            percentage: calculatePercentage(stats.publications.nouvelles, stats.publications.total),
            icon: <FileText className="h-6 w-6" />,
            iconContainerClasses: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
        },
        {
            title: "Activité",
            total: stats.activite.commentaires + stats.activite.notifications,
            newCount: 0,
            percentage: 0,
            icon: <BarChart3 className="h-6 w-6" />,
            iconContainerClasses: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
            additionalInfo: [
                {
                    label: "Commentaires",
                    value: stats.activite.commentaires,
                    icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
                },
                {
                    label: "Notifications",
                    value: stats.activite.notifications,
                    icon: <Bell className="h-4 w-4 text-orange-500" />,
                },
            ],
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCardsData.map((card, index) => (
                <StatCard key={index} data={card} />
            ))}
        </div>
    );
};

export default StatsCards;
