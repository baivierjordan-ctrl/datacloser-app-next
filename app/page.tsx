"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { lireSession } from "@/lib/session";

export default function Accueil() {
  const router = useRouter();

  useEffect(() => {
    router.replace(lireSession() ? "/radar" : "/connexion");
  }, [router]);

  return null;
}
