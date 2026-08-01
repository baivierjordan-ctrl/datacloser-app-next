"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLangue } from "@/lib/i18n";
import { Check, Loader2, MailX } from "lucide-react";
import { MarqueEnTete } from "@/components/Marque";
import { desinscrire } from "@/lib/api";

/**
 * Désinscription depuis un email de prospection.
 *
 * Accessible sans compte ni connexion : c'est une obligation légale, et
 * exiger quoi que ce soit d'une personne qui veut qu'on lui fiche la
 * paix serait une faute.
 *
 * La demande part automatiquement à l'arrivée. Faire cliquer une
 * seconde fois quelqu'un qui a déjà cliqué dans l'email pour ça relève
 * du procédé dilatoire.
 */
function ContenuDesinscription() {
  const { t } = useLangue();
  const parametres = useSearchParams();
  const email = parametres.get("unsubscribe")?.trim() ?? "";

  const [etat, setEtat] = useState<"cours" | "fait" | "erreur" | "absent">(
    email ? "cours" : "absent",
  );
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (!email) return;
    desinscrire(email)
      .then(() => setEtat("fait"))
      .catch((e: Error) => {
        setErreur(e.message);
        setEtat("erreur");
      });
  }, [email]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <MarqueEnTete />

        <div className="rounded-xl border border-line bg-surface p-6">
          {etat === "cours" && (
            <p className="flex items-center gap-3 text-sm text-muted">
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              {t("desinscription.enCours")}
            </p>
          )}

          {etat === "fait" && (
            <>
              <p className="flex items-center gap-2.5 text-base font-medium">
                <Check size={18} className="shrink-0 text-ok" aria-hidden="true" />
                {t("desinscription.fait")}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-content-soft">
                <span className="font-mono text-[13px]">{email}</span>{" "}
                {t("desinscription.confirmation")}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                {t("desinscription.enFile")}
              </p>
            </>
          )}

          {etat === "erreur" && (
            <>
              <p className="flex items-center gap-2.5 text-base font-medium text-danger">
                <MailX size={18} className="shrink-0" aria-hidden="true" />
                {t("desinscription.echec")}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-content-soft">
                {erreur}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {t("desinscription.rechargez")}{" "}
                <a
                  href="mailto:hello@data-closer.com?subject=Désinscription"
                  className="text-teal hover:underline"
                >
                  hello@data-closer.com
                </a>{" "}
                {t("desinscription.traiteeManuellement")}
              </p>
            </>
          )}

          {etat === "absent" && (
            <>
              <p className="text-base font-medium">{t("desinscription.absente")}</p>
              <p className="mt-3 text-sm leading-relaxed text-content-soft">
                {t("desinscription.absenteDetail")}{" "}
                <a
                  href="mailto:hello@data-closer.com?subject=Désinscription"
                  className="text-teal hover:underline"
                >
                  hello@data-closer.com
                </a>
                .
              </p>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          DataCloser — Jordan Baivier, Belgique
        </p>
      </div>
    </main>
  );
}

export default function PageDesinscription() {
  return (
    <Suspense fallback={null}>
      <ContenuDesinscription />
    </Suspense>
  );
}
