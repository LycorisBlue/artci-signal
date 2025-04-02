import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export type PieChartDataItem = {
    name: string;
    value: number;
    color: string;
    icon?: React.ReactNode;
};

interface PieChartCardProps {
    title: string;
    data: PieChartDataItem[];
    showPercentage?: boolean;
    showLegend?: boolean;
    total?: number;
}

// Composant pour le tooltip personnalisé
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-gray-800 text-white px-3 py-2 rounded shadow-lg text-xs">
                <p className="font-medium">{data.name}</p>
                <p>
                    <span className="font-medium">{data.value}</span>
                    {data.percentage ? ` (${data.percentage}%)` : ''}
                </p>
            </div>
        );
    }
    return null;
};

const PieChartCard: React.FC<PieChartCardProps> = ({
    title,
    data,
    showPercentage = true,
    showLegend = true,
    total
}) => {
    // Si pas de données, afficher un message
    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
                </div>
                <div className="p-6 text-gray-500 dark:text-gray-400 text-center py-8">
                    Aucune donnée disponible.
                </div>
            </div>
        );
    }

    // Calculer le total si non fourni
    const calculatedTotal = total || data.reduce((sum, item) => sum + item.value, 0);

    // Ajouter le pourcentage à chaque élément
    const chartData = data.map(item => ({
        ...item,
        percentage: calculatedTotal > 0 ? Math.round((item.value / calculatedTotal) * 100) : 0
    }));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Graphique */}
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="40%"   // Utilisation de pourcentages pour une meilleure adaptabilité
                                    outerRadius="70%"
                                    paddingAngle={2}    // Réduction de l'espace entre les segments
                                    dataKey="value"
                                    label={({ percentage }) => showPercentage ? `${percentage}%` : ''}
                                    labelLine={false}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                {showLegend && <Legend layout="horizontal" verticalAlign="bottom" align="center" />}
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PieChartCard;