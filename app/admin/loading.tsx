// app/admin/loading.tsx
export default function AdminLoadingLayout() {
    return (
        <div className="space-y-6">
            {/* En-tête avec effet de pulsation */}
            <div className="mb-8">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
            </div>

            {/* Indicateur de chargement principal */}
            <div className="h-full flex items-center justify-center py-24">
                <div className="relative h-16 w-16">
                    <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-orange-200 dark:border-orange-900/30"></div>
                    <div className="absolute top-0 left-0 h-full w-full rounded-full border-t-4 border-orange-500 animate-spin"></div>
                </div>
            </div>

            {/* Conteneur principal avec effet de pulsation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="space-y-4">
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mt-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}