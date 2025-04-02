"use client"

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { login } from "@/lib/services/auth/login";
import { saveToStorage } from "@/lib/utils/storage";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('Début de handleSubmit');
        e.preventDefault();
        console.log('Après preventDefault');
        setIsLoading(true);
        setError("");

        try {
            console.log('Avant appel login');
            // Appel de la fonction login depuis vos services existants
            const response = await login({ email, password });
            console.log('Après appel login réussi', response);

            // Sauvegarde des tokens dans le storage
            const { accessToken, refreshToken } = response.data.tokens;
            console.log('Tokens extraits', { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
            saveToStorage("token", accessToken, true);
            saveToStorage("refreshToken", refreshToken, rememberMe);
            console.log('Tokens sauvegardés');

            console.log("Connexion réussie:", { email, rememberMe });

            // Redirection après connexion réussie
            console.log('Avant redirection');
            router.push("/");
            console.log('Après appel router.push');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.log('Dans le catch', err);
            const errorMessage = err.message || "Identifiants incorrects. Veuillez réessayer.";
            console.log('Message d\'erreur extrait', errorMessage);
            setError(errorMessage);
            console.log('Erreur définie dans state');
        } finally {
            console.log('Dans finally');
            setIsLoading(false);
            console.log('Loading state mis à false');
        }
        console.log('Fin de handleSubmit');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex">
            {/* Partie formulaire (gauche) */}
            <div className="w-full md:w-2/5 flex flex-col justify-center px-4 sm:px-8 md:px-16 bg-white shadow-xl">
                <div className="max-w-md mx-auto w-full">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portail administrateur</h1>
                        <p className="text-gray-600">
                            Entrez vos identifiants pour accéder à votre espace administration.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center text-sm">
                            <span className="mr-2">⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Adresse email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MailIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                                <Link href="/mot-de-passe-oublie" className="text-sm text-orange-600 hover:text-orange-700">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Se souvenir de moi
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center items-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-xl transition duration-200 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connexion en cours...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <Link href="/signaler-probleme" className="text-sm text-orange-600 hover:text-orange-700">
                            Signaler un problème de connexion
                        </Link>
                    </div>
                </div>
            </div>

            {/* Partie image (droite) */}
            <div className="hidden md:block w-3/5 relative bg-orange-50" style={{ height: '100vh' }}>
                {/* Image de fond */}
                <div className="relative w-full h-full">
                    <Image
                        src="/pictures/login-illustration.jpeg"
                        alt="Illustration connexion"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>

                {/* Overlay avec texte - utilisation d'un pseudo-élément pour l'opacité */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-white">
                    {/* Pseudo-élément pour l'opacité */}
                    <div className="absolute inset-0 bg-black opacity-30 z-0"></div>

                    {/* Contenu avec pleine opacité */}
                    <div className="mb-8 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Administration</h2>
                        <p className="text-lg md:text-xl max-w-md text-center">
                            Accédez à tous les outils d&apos;administration et gérez efficacement votre plateforme.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}