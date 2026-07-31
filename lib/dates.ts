/**
 * Lecture des horodatages venus de l'API.
 *
 * Le serveur écrit ses dates sans fuseau (`2026-07-31T08:54:00`) alors
 * qu'il tourne en UTC. Sans marqueur, le navigateur les interprète
 * comme de l'heure locale : en Belgique l'été, deux heures de retard
 * s'affichaient.
 *
 * On répare à la lecture plutôt qu'à l'écriture : côté serveur, ces
 * mêmes dates sont comparées entre elles avec `datetime.now()`, et les
 * rendre conscientes du fuseau ferait échouer chaque comparaison. La
 * correction ici est sans risque et vaut aussi pour l'historique déjà
 * enregistré.
 */

/** Marqueur de fuseau en fin de chaîne : Z, +02:00, -0500… */
const FUSEAU_PRESENT = /(Z|[+-]\d{2}:?\d{2})$/i;

export function lireDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;

  const normalise = FUSEAU_PRESENT.test(iso.trim())
    ? iso.trim()
    : `${iso.trim().replace(" ", "T")}Z`;

  const date = new Date(normalise);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** « 31 juil., 10:50 » — pour les journaux et historiques. */
export function dateHeure(iso: string | null | undefined): string {
  const date = lireDate(iso);
  return date
    ? date.toLocaleString("fr-BE", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
}

/** « 31 juillet » — quand l'heure n'apporte rien. */
export function dateSeule(iso: string | null | undefined): string {
  const date = lireDate(iso);
  return date
    ? date.toLocaleDateString("fr-BE", { day: "2-digit", month: "long" })
    : "—";
}

/** « 31 juil. 2026 » — pour les dates de création, plus anciennes. */
export function dateCourte(iso: string | null | undefined): string {
  const date = lireDate(iso);
  return date
    ? date.toLocaleDateString("fr-BE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
}
