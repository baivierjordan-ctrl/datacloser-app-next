import type { Metadata, Viewport } from "next";
import "./globals.css";
import { EnregistrerServiceWorker } from "@/components/EnregistrerServiceWorker";
import { BulleAssistant } from "@/components/BulleAssistant";
import { InviteInstallation } from "@/components/InviteInstallation";

export const metadata: Metadata = {
  // Le gabarit met le nom du produit en fin d'onglet : l'écran courant
  // reste lisible quand plusieurs onglets sont ouverts côte à côte.
  title: {
    default: "DataCloser",
    template: "%s · DataCloser",
  },
  description: "Prospection B2B automatisée pour le marché francophone",
  applicationName: "DataCloser",
  manifest: "/manifest.json",
  // Sur iOS, l'ajout à l'écran d'accueil passe par ces métadonnées :
  // Safari ignore le manifeste pour le mode plein écran.
  appleWebApp: {
    capable: true,
    title: "DataCloser",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f7f9",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          // Exécuté avant le rendu : c'est la seule façon d'éviter le
          // clignotement. Volontairement minimal et sans dépendance.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem("datacloser.theme");var s=window.matchMedia("(prefers-color-scheme: dark)").matches;if(p==="sombre"||(!p&&s)){document.documentElement.setAttribute("data-theme","sombre")}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <EnregistrerServiceWorker />
        {children}
        <BulleAssistant />
        <InviteInstallation />
      </body>
    </html>
  );
}
