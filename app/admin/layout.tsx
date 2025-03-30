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
    Search,
    Sun,
    Moon
} from "lucide-react";
import { getFromStorage } from "@/lib/utils/storage";
import { logout } from "@/lib/services/auth/logout";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
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
            setIsLoading(false);
        };

        // Récupérer l'état de la sidebar depuis le localStorage
        const getSidebarState = () => {
            if (typeof window !== "undefined") {
                const state = localStorage.getItem("sidebarOpen");
                setSidebarOpen(state === "true");
            }
        };

        // Récupérer le mode thème
        const getThemeMode = () => {
            if (typeof window !== "undefined") {
                const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                setDarkMode(isDark);
            }
        };

        checkAuth();
        getSidebarState();
        getThemeMode();
    }, [router]);

    const toggleSidebar = () => {
        const newState = !sidebarOpen;
        setSidebarOpen(newState);
        if (typeof window !== "undefined") {
            localStorage.setItem("sidebarOpen", String(newState));
        }
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        // Ici, vous pouvez ajouter le code pour changer le thème globalement
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Erreur de déconnexion:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-orange-500 rounded-full border-t-transparent"></div>
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
        <div className={`flex min-h-screen ${darkMode ? "dark" : ""}`}>
            {/* Sidebar mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    } lg:static lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
                    <Link href="/admin/dashboard" className="flex items-center space-x-2">
                        <div className="relative h-8 w-8">
                            {/* Remplacer par votre logo */}
                            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                                A
                            </div>
                        </div>
                        <span className="text-lg font-semibold dark:text-white">ARTCI Signal</span>
                    </Link>
                    <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="px-4 py-4">
                    <ul className="space-y-2">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 ${link.active ? "bg-orange-100 text-orange-800 dark:bg-gray-800 dark:text-orange-400" : "text-gray-700 dark:text-gray-300"
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        {link.icon}
                                        <span className="font-medium">{link.name}</span>
                                    </div>
                                    {link.badge && (
                                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-500 text-white">
                                            {link.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            {/* Avatar utilisateur */}
                            <div className="h-full w-full bg-orange-200 flex items-center justify-center font-bold text-orange-800">
                                U
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800 dark:text-white">Administrateur</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">admin@artci.ci</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-gray-950">
                {/* Header */}
                <header className="z-10 h-16 bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center">
                        <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white mr-4">
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800 dark:text-white md:block hidden">
                            {navLinks.find(link => link.active)?.name || "Tableau de bord"}
                        </h1>
                    </div>

                    <div className="hidden md:flex items-center relative flex-1 max-w-md mx-8">
                        <Search className="h-5 w-5 absolute left-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-600"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Thème */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                        >
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
                                <BellRing className="h-5 w-5" />
                                    <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                                        4
                                    </span>
                            </button>
                        </div>

                        {/* Profil utilisateur */}
                        <div className="relative">
                            <button className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                {/* Avatar utilisateur */}
                                <div className="h-full w-full bg-orange-200 flex items-center justify-center font-bold text-orange-800">
                                    U
                                </div>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-950">
                    {children}
                </main>
            </div>
        </div>
    );
}