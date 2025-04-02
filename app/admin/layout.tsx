"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    BellRing,
    Users,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    AlertTriangle,
    Sun,
    Moon,
    ChevronLeft,
    ChevronRight,
    User,
    Bell,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { getFromStorage } from "@/lib/utils/storage";
import { logout } from "@/lib/services/auth/logout";
import { useUserStore } from "@/lib/stores/userStore";


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { userData, fetchUserData, clearUserData } = useUserStore();
    const [toast, setToast] = useState<{
        visible: boolean;
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
    } | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Vérifier l'authentification
        const checkAuth = async () => {
            const token = await getFromStorage<string>("token", true);
            if (!token) {
                router.push("/login");
                return;
            }

            // Utiliser le store pour récupérer les données utilisateur
            await fetchUserData();
            setIsLoading(false);
        };

        // Récupérer l'état de la sidebar depuis le localStorage
        const getSidebarState = () => {
            if (typeof window !== "undefined") {
                const state = localStorage.getItem("sidebarCollapsed");
                setCollapsed(state === "true");
            }
        };

        // Récupérer le mode thème
        const getThemeMode = () => {
            if (typeof window !== "undefined") {
                const isDark = localStorage.getItem("darkMode") === "true" ||
                    window.matchMedia("(prefers-color-scheme: dark)").matches;
                setDarkMode(isDark);
                document.documentElement.classList.toggle('dark', isDark);
            }
        };

        // Réinitialiser sur mobile
        const handleResize = () => {
            if (window.innerWidth < 1024 && !collapsed) {
                setCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        checkAuth();
        getSidebarState();
        getThemeMode();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [router]);

    // Réinitialiser sur changement de route sur mobile
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setCollapsed(true);
        }
        // Fermer les menus ouverts lors des changements de page
        setShowProfileMenu(false);
        setShowNotifications(false);
    }, [pathname]);

    const toggleSidebar = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        if (typeof window !== "undefined") {
            localStorage.setItem("sidebarCollapsed", String(newState));
        }
    };

    const toggleTheme = () => {
        const newState = !darkMode;
        setDarkMode(newState);
        if (typeof window !== "undefined") {
            localStorage.setItem("darkMode", String(newState));
            document.documentElement.classList.toggle('dark', newState);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            clearUserData(); // Nettoyer les données utilisateur lors de la déconnexion
            router.push("/login");
        } catch (error) {
            console.error("Erreur de déconnexion:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
                <div className="relative h-16 w-16">
                    <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-orange-200 dark:border-orange-900/30"></div>
                    <div className="absolute top-0 left-0 h-full w-full rounded-full border-t-4 border-orange-500 animate-spin"></div>
                </div>
            </div>
        );
    }

    // Définition des liens de la sidebar
    const navLinks = [
        {
            name: "Tableau de bord",
            href: "/admin/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
            active: pathname === "/admin/dashboard",
        },
        {
            name: "Signalements",
            href: "/admin/signalements",
            icon: <AlertTriangle className="h-5 w-5" />,
            active: pathname.includes("/admin/signalements"),
            badge: 3,
        },
        {
            name: "Utilisateurs",
            href: "/admin/utilisateurs",
            icon: <Users className="h-5 w-5" />,
            active: pathname.includes("/admin/utilisateurs"),
        },
        {
            name: "Publications",
            href: "/admin/publications",
            icon: <FileText className="h-5 w-5" />,
            active: pathname.includes("/admin/publications"),
        },
        {
            name: "Paramètres",
            href: "/admin/parametres",
            icon: <Settings className="h-5 w-5" />,
            active: pathname.includes("/admin/parametres"),
        },
    ];

    return (
        <div className={`h-screen flex bg-gray-50 dark:bg-gray-950 ${darkMode ? "dark" : ""}`}>
            {/* Sidebar - Fixed on all screen sizes */}
            <aside
                className={`
                    fixed top-0 bottom-0
                    flex flex-col
                    transition-all duration-300 ease-in-out
                    bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40
                    ${collapsed
                        ? "w-20 -translate-x-full lg:translate-x-0 lg:w-20"
                        : "w-72 translate-x-0"
                    }
                `}
            >
                {/* Sidebar header */}
                <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <div className={`flex items-center transition-all duration-300 ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}>
                        <div className="flex-shrink-0 mr-2">
                            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-md">
                                A
                            </div>
                        </div>
                        <span className="font-bold text-xl text-gray-900 dark:text-white">
                            ARTCI<span className="text-orange-500">Signal</span>
                        </span>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="hidden lg:flex ml-auto p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors duration-200"
                    >
                        {collapsed ?
                            <ChevronRight className="w-5 h-5" /> :
                            <ChevronLeft className="w-5 h-5" />
                        }
                    </button>
                </div>

                {/* Navigation - Scrollable if needed */}
                <nav className="flex-1 overflow-y-auto py-6 px-3">
                    <div className="space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl
                                    transition-all duration-200 group relative
                                    ${link.active
                                        ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 dark:from-orange-900/20 dark:to-orange-800/10 dark:text-orange-400 shadow-sm"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/50"
                                    }
                                `}
                            >
                                {/* Indicateur de menu actif */}
                                {link.active && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full shadow-md" />
                                )}

                                <span className={`flex-shrink-0 ${link.active ? "text-orange-500 dark:text-orange-400" : "text-gray-500 dark:text-gray-400 group-hover:text-orange-500 dark:group-hover:text-orange-400"} transition-colors duration-200`}>
                                    {link.icon}
                                </span>

                                <span className={`font-medium truncate transition-all duration-300 ${collapsed ? "opacity-0 w-0 hidden" : "opacity-100"}`}>
                                    {link.name}
                                </span>

                                {link.badge && (
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-500 text-white shadow-sm ml-auto transition-all duration-300 ${collapsed ? "scale-90" : ""}`}>
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* User Section - Fixed at bottom with dropdown */}
                <div className="border-t border-gray-100 dark:border-gray-800 p-4 mt-auto relative">
                    <div className={`w-full flex items-center gap-3 p-2 rounded-xl cursor-pointer 
      ${collapsed ? "justify-center" : ""}
      hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200`}
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        {/* Profile Image */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800/30 dark:to-orange-700/20 flex items-center justify-center overflow-hidden shadow-md border-2 border-white dark:border-gray-800">
                            <span className="text-orange-800 dark:text-orange-400 font-bold">
                                {userData?.nom?.charAt(0) || userData?.email?.charAt(0) || 'U'}
                            </span>
                        </div>

                        {/* Profile Info */}
                        <div className={`flex-1 min-w-0 transition-all duration-300 
        ${collapsed ? "hidden" : "block"}`}
                        >
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {userData?.nom || 'Chargement...'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {userData?.email || ''}
                            </p>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                        <div className={`absolute ${collapsed ? "lg:left-full lg:bottom-auto lg:top-0 lg:ml-2" : "bottom-full left-0 mb-2"} w-56 z-50`}
                            onClick={(e) => e.stopPropagation()}>
                            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Connecté en tant que</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{userData?.email || ''}</p>
                                </div>
                                <div className="p-1">
                                    <Link href="/admin/profile"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <span>Mon profil</span>
                                    </Link>
                                    <Link href="/admin/parametres"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <span>Paramètres</span>
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLogout();
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                                        <LogOut className="w-4 h-4" />
                                        <span>Se déconnecter</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main content wrapper - Adjust margin for fixed sidebar */}
            <div className={`flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-72"}`}>
                {/* Header */}
                <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
                    <div className="flex items-center">
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden mr-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            {collapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
                        </button>

                        {/* Mobile branding - visible when sidebar is collapsed */}
                        <div className="lg:hidden flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-md">
                                A
                            </div>
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                                ARTCI<span className="text-orange-500">Signal</span>
                            </span>
                        </div>
                    </div>

                    {/* Header Right Items */}
                    <div className="flex items-center space-x-3">
                        {/* Theme Switcher */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors group"
                            aria-label="Changer de thème"
                        >
                            {darkMode ?
                                <Sun className="h-5 w-5 group-hover:text-orange-500 transition-colors" /> :
                                <Moon className="h-5 w-5 group-hover:text-blue-500 transition-colors" />
                            }
                        </button>

                        {/* Notifications Dropdown */}
                        <div className="relative">
                            <button
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors group relative"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowNotifications(!showNotifications);
                                    setShowProfileMenu(false);
                                }}
                                aria-label="Notifications"
                            >
                                <BellRing className="h-5 w-5 group-hover:text-orange-500 transition-colors" />
                                <span className="absolute top-0.5 right-1 h-4 w-4 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center shadow-sm">
                                    4
                                </span>
                            </button>

                            {/* Notifications Panel */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-50"
                                    onClick={(e) => e.stopPropagation()}>
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                        <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                                        <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs rounded-full">4 nouvelles</span>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto">
                                        {/* Liste des notifications */}
                                        <div className="p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className="h-9 w-9 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                                                    <Users className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-900 dark:text-white font-medium">Nouvel utilisateur inscrit</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Il y a 3 minutes</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className="h-9 w-9 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
                                                    <AlertTriangle className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-900 dark:text-white font-medium">Nouveau signalement</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Il y a 10 minutes</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 text-center">
                                        <a href="/admin/notifications" className="text-sm text-orange-600 dark:text-orange-400 font-medium hover:underline">
                                            Voir toutes les notifications
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Button */}
                        <div className="relative">
                            <button
                                className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800/30 dark:to-orange-700/20 flex items-center justify-center font-bold text-orange-800 dark:text-orange-400 overflow-hidden shadow-md border-2 border-white dark:border-gray-800"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowProfileMenu(!showProfileMenu);
                                }}
                            >
                                {userData?.nom?.charAt(0) || userData?.email?.charAt(0) || 'U'}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white dark:bg-gray-950">
                    {children}
                </main>
            </div>

            {/* Backdrop for mobile when sidebar is open */}
            {!collapsed && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => {
                        toggleSidebar();
                        setShowProfileMenu(false);
                        setShowNotifications(false);
                    }}
                />
            )}

            {/* Backdrop global pour fermer les menus déroulants */}
            {(showProfileMenu || showNotifications) && (
                <div
                    className="fixed inset-0 z-20"
                    onClick={() => {
                        setShowProfileMenu(false);
                        setShowNotifications(false);
                    }}
                />
            )}

            {toast && (
                <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
                    <div
                        className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
                                toast.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
                                    toast.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500' :
                                        'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                            }`}
                    >
                        <div className={`rounded-full p-1 ${toast.type === 'error' ? 'bg-red-200' :
                                toast.type === 'success' ? 'bg-green-200' :
                                    toast.type === 'warning' ? 'bg-yellow-200' :
                                        'bg-blue-200'
                            }`}>
                            {toast.type === 'error' && <AlertTriangle className="h-5 w-5" />}
                            {toast.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                            {toast.type === 'warning' && <AlertCircle className="h-5 w-5" />}
                            {toast.type === 'info' && <Bell className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                            {toast.message}
                        </div>
                        <button
                            onClick={() => setToast(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}