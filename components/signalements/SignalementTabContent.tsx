import React, { useState, ReactNode } from 'react';
import { FileText, MessageCircle, Image, Settings } from 'lucide-react';

// Types pour les onglets et leurs composants
type TabId = 'details' | 'preuves' | 'commentaires' | 'actions';

interface TabItem {
    id: TabId;
    label: string;
    icon: ReactNode;
    count?: number;
}

interface SignalementTabContentProps {
    // Propriétés relatives aux données
    preuvesCount?: number;
    commentairesCount?: number;
    signalementId?: string;
    isLoading: boolean;

    // Composants d'onglet
    detailsComponent: ReactNode;
    preuvesComponent: ReactNode;
    commentairesComponent: ReactNode;
    actionsComponent: ReactNode;

    // Optionnel: onglet initial (défaut à 'details')
    initialTab?: TabId;
}

const SignalementTabContent: React.FC<SignalementTabContentProps> = ({
    preuvesCount = 0,
    commentairesCount = 0,
    isLoading,
    detailsComponent,
    preuvesComponent,
    commentairesComponent,
    actionsComponent,
    initialTab = 'details'
}) => {
    // État pour gérer l'onglet actif
    const [activeTab, setActiveTab] = useState<TabId>(initialTab);

    // Définition des onglets disponibles
    const tabs: TabItem[] = [
        {
            id: 'details',
            label: 'Détails',
            icon: <FileText className="h-4 w-4" />
        },
        {
            id: 'preuves',
            label: 'Preuves',
            // eslint-disable-next-line jsx-a11y/alt-text
            icon: <Image className="h-4 w-4" />,
            count: preuvesCount
        },
        {
            id: 'commentaires',
            label: 'Commentaires',
            icon: <MessageCircle className="h-4 w-4" />,
            count: commentairesCount
        },
        {
            id: 'actions',
            label: 'Actions',
            icon: <Settings className="h-4 w-4" />
        },
    ];

    // Si en chargement, afficher un placeholder
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="border-b border-gray-200 dark:border-gray-700 h-14 flex px-4 gap-6">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 my-auto"></div>
                    ))}
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Rendu du composant principal
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Navigation des onglets */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset transition-colors ${activeTab === tab.id
                                    ? "border-b-2 border-orange-500 text-orange-600 dark:text-orange-400"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                }`}
                            aria-selected={activeTab === tab.id}
                            role="tab"
                        >
                            <div className="flex items-center gap-2">
                                {tab.icon}
                                {tab.label}
                                {tab.count !== undefined && tab.count > 0 && (
                                    <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                        {tab.count}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Contenu de l'onglet actif */}
            <div className="p-6">
                {activeTab === 'details' && detailsComponent}
                {activeTab === 'preuves' && preuvesComponent}
                {activeTab === 'commentaires' && commentairesComponent}
                {activeTab === 'actions' && actionsComponent}
            </div>
        </div>
    );
};

export default SignalementTabContent;