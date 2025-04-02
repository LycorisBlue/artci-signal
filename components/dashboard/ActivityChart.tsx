/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/ActivityChart.tsx
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

type ActivityDataPoint = {
    date: string;
    signalements: number;
};

interface ActivityChartProps {
    data: ActivityDataPoint[];
    title?: string;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data, title = "Activité par jour" }) => {
    // Si pas de données, afficher un message
    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
                </div>
                <div className="p-6 text-gray-500 dark:text-gray-400 text-center py-8">
                    Aucune donnée d&apos;activité disponible pour cette période.
                </div>
            </div>
        );
    }

    // Formater les données pour le graphique
    const formattedData = data.map(day => ({
        date: new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        signalements: day.signalements
    }));

    // Configuration du tooltip personnalisé
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 text-white px-3 py-2 rounded shadow-lg text-xs">
                    <p className="font-medium">{label}</p>
                    <p>
                        <span className="font-medium">{payload[0].value}</span> signalements
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
            </div>
            <div className="p-6">
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={formattedData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: '#9ca3af' }}
                            />
                            <YAxis
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: '#9ca3af' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="signalements"
                                fill="#3b82f6" // Bleu similaire à bg-blue-500
                                radius={[4, 4, 0, 0]} // Coins arrondis en haut
                                barSize={formattedData.length > 15 ? 12 : 24} // Ajuster la taille des barres en fonction du nombre de jours
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Nombre de signalements reçus par jour sur la période
                </div>
            </div>
        </div>
    );
};

export default ActivityChart;