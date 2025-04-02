"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getFromStorage } from "@/lib/utils/storage";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getFromStorage<string>("token", true);
      if (!token) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <h1 className="text-2xl font-bold">Bienvenue sur ARTCI Signal</h1>
        <p className="text-center sm:text-left">
          Plateforme de signalement et de gestion des incidents de cybersécurité
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/admin/dashboard"
          >
            Tableau de bord
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/admin/signalements"
          >
            Voir les signalements
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <span className="text-sm text-gray-500">© 2025 ARTCI. Tous droits réservés.</span>
      </footer>
    </div>
  );
}