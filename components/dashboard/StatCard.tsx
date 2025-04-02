// components/dashboard/StatCard.tsx
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardData {
    title: string;
    total: number;
    newCount: number;
    percentage: number;
    icon: React.ReactNode;
    iconContainerClasses?: string; // Propriété pour classes CSS personnalisées
    additionalInfo?: {
        label: string;
        value: number;
        icon?: React.ReactNode;
    }[];
}

interface StatCardProps {
    data: StatCardData;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
    const isPositive = data.percentage >= 0;
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{data.title}</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                        {data.total.toLocaleString()}
                    </p>
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center shadow-sm ${data.iconContainerClasses || "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}>
                    {data.icon}
                </div>
            </div>
            {data.additionalInfo ? (
                <div className="mt-3 flex items-center gap-4">
                    {data.additionalInfo.map((info, index) => (
                        <div key={index} className="flex items-center gap-1">
                            {info.icon && info.icon}
                            <span className="text-gray-700 dark:text-gray-300">
                                {info.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-3 flex items-center text-sm">
                    <span
                        className={`flex items-center gap-1 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}
                    >
                        {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {Math.abs(data.percentage)}%
                    </span>
                    <span className="ml-2 text-gray-500 dark:text-gray-400">
                        {data.newCount.toLocaleString()} nouveaux
                    </span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
