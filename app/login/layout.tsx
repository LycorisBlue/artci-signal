// app/login/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Connexion | Portail Administrateur ARTCI Signal",
    description: "Connectez-vous au portail d'administration d'ARTCI Signal",
    robots: {
        index: false,
        follow: false,
    }
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}