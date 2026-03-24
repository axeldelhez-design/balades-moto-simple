"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import styles from "./page.module.css";

type Niveau = "novice" | "intermédiaire" | "confirmé";

type Balade = {
  id: number;
  titre: string;
  date: string;
  km: number;
  niveau: Niveau;
  créateur_nom?: string;
};

type Participant = {
  id: number;
  balade_id: number;
  user_id: string;
  pseudo: string;
};

const baladesParDefaut: Balade[] = [
  {
    id: 1,
    titre: "Balade Ardennes",
    date: "2026-04-14T14:00:00",
    km: 120,
    niveau: "intermédiaire",
    créateur_nom: "Organisateur",
  },
  {
    id: 2,
    titre: "Tour des lacs",
    date: "2026-04-20T10:00:00",
    km: 65,
    niveau: "novice",
    créateur_nom: "Organisateur",
  },
  {
    id: 3,
    titre: "Forêt et petites routes",
    date: "2026-04-28T09:30:00",
    km: 180,
    niveau: "confirmé",
    créateur_nom: "Organisateur",
  },
];

export default function HomePage() {
  const [balades, setBalades] = useState<Balade[]>(baladesParDefaut);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [titre, setTitre] = useState("");
  const [date, setDate] = useState("");
  const [km, setKm] = useState("");
  const [niveau, setNiveau] = useState<Niveau>("novice");

  const [nomsParBalade, setNomsParBalade] = useState<Record<number, string>>(
    {}
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  async function fetchBalades() {
    const { data, error } = await supabase
      .from("Balades")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
  alert("ERREUR BALADES : " + error.message);
  console.log("ERREUR BALADES COMPLETE :", error);
  return;
}

    if (!data || data.length === 0) {
      setBalades(baladesParDefaut);
      return;
    }

    const baladesFormatees: Balade[] = data.map((row: any, index: number) => ({
      id: Number(row.id ?? index + 1),
      titre: row.titre ?? "",
      date: row.date ?? "",
      km: Number(row.km ?? 0),
      niveau: (row.niveau ?? "novice") as Niveau,
      créateur_nom: row["créateur_nom"] ?? "Organisateur",
    }));

    setBalades(baladesFormatees);
  }

  async function fetchParticipants() {
    const { data, error } = await supabase
      .from("participations")
      .select("id, balade_id, user_id, pseudo")
      .order("id", { ascending: true });

    if (error) {
      console.error("ERREUR PARTICIPANTS :", error);
      return;
    }

    const participantsFormates: Participant[] = (data || []).map((p: any) => ({
      id: Number(p.id),
      balade_id: Number(p.balade_id),
      user_id: p.user_id ?? "",
      pseudo: p.pseudo ?? "Utilisateur",
    }));

    setParticipants(participantsFormates);
  }

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUserEmail(user?.email ?? null);
    setCurrentUserId(user?.id ?? null);
  }

  useEffect(() => {
    fetchBalades();
    fetchParticipants();
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
      setCurrentUserId(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function ajouterBalade(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Tu dois être connecté pour créer une balade.");
      return;
    }

    if (!titre.trim()) {
      alert("Entre un titre.");
      return;
    }

    if (!date) {
      alert("Choisis une date et une heure.");
      return;
    }

    const pseudoCreateur = user.email ?? "Organisateur";

    const { error } = await supabase.from("Balades").insert([
      {
        titre: titre.trim(),
        date,
        km: Number(km || 0),
        niveau,
        créateur_nom: pseudoCreateur,
      },
    ]);

    if (error) {
  alert("ERREUR AJOUT BALADE : " + error.message);
  console.log("ERREUR AJOUT BALADE COMPLETE :", error);
  return;
}

    setTitre("");
    setDate("");
    setKm("");
    setNiveau("novice");
    setShowForm(false);

    await fetchBalades();
  }

  function getNiveauLabel(niveauValue: Niveau) {
    if (niveauValue === "novice") return "Novice";
    if (niveauValue === "intermédiaire") return "Intermédiaire";
    return "Confirmé";
  }

  function getNiveauClass(niveauValue: Niveau) {
    if (niveauValue === "novice") return styles.novice;
    if (niveauValue === "intermédiaire") return styles.intermediaire;
    return styles.confirme;
  }

  async function inscription() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("ERREUR INSCRIPTION :", error);
      alert(error.message);
      return;
    }

    alert("Compte créé. Vérifie ton email si besoin.");
  }

  async function connexion() {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("ERREUR CONNEXION :", error);
      alert(error.message);
      return;
    }

    setUserEmail(data.user.email ?? null);
    setCurrentUserId(data.user.id ?? null);
    alert("Connecté !");
  }

  async function deconnexion() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("ERREUR DECONNEXION :", error);
      alert(error.message);
      return;
    }

    setUserEmail(null);
    setCurrentUserId(null);
    alert("Déconnecté !");
  }

  async function participer(baladeId: number) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Tu dois être connecté pour participer.");
      return;
    }

    const pseudo = nomsParBalade[baladeId]?.trim();

    if (!pseudo) {
      alert("Écris ton nom");
      return;
    }

    const dejaInscritNom = participants.some(
      (p) =>
        p.balade_id === baladeId &&
        p.pseudo.trim().toLowerCase() === pseudo.toLowerCase()
    );

    if (dejaInscritNom) {
      alert("Ce nom est déjà inscrit pour cette balade.");
      return;
    }

    const dejaInscritUser = participants.some(
      (p) => p.balade_id === baladeId && p.user_id === user.id
    );

    if (dejaInscritUser) {
      alert("Tu es déjà inscrit à cette balade.");
      return;
    }

    const { error } = await supabase.from("participations").insert([
      {
        balade_id: baladeId,
        user_id: user.id,
        pseudo,
        statut: "je_viens",
      },
    ]);

    if (error) {
      console.error("ERREUR INSERT :", error);
      alert(error.message);
      return;
    }

    setNomsParBalade((prev) => ({
      ...prev,
      [baladeId]: "",
    }));

    await fetchParticipants();
  }

  async function seDesinscrire(baladeId: number) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Tu dois être connecté.");
      return;
    }

    const { error } = await supabase
      .from("participations")
      .delete()
      .eq("balade_id", baladeId)
      .eq("user_id", user.id);

    if (error) {
      console.error("ERREUR DELETE :", error);
      alert(error.message);
      return;
    }

    await fetchParticipants();
  }

  function formatDateAffichage(dateString: string) {
    const dateObj = new Date(dateString);

    if (isNaN(dateObj.getTime())) {
      return dateString;
    }

    return dateObj.toLocaleString("fr-BE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function estDerniereMinute(dateString: string) {
    const dateObj = new Date(dateString);

    if (isNaN(dateObj.getTime())) {
      return false;
    }

    const maintenantLocal = new Date();
    const diffMs = dateObj.getTime() - maintenantLocal.getTime();
    const diffHeures = diffMs / (1000 * 60 * 60);

    return diffHeures <= 24;
  }

  const maintenant = new Date();

  const baladesFutures = balades.filter((balade) => {
    const dateObj = new Date(balade.date);
    return !isNaN(dateObj.getTime()) && dateObj.getTime() > maintenant.getTime();
  });

  const baladesPrevues = baladesFutures.filter(
    (balade) => !estDerniereMinute(balade.date)
  );

  const baladesDerniereMinute = baladesFutures.filter((balade) =>
    estDerniereMinute(balade.date)
  );

  function renderBalade(balade: Balade, flash = false) {
    const participantsBalade = participants.filter(
      (p) => p.balade_id === balade.id
    );

    const estInscrit = participantsBalade.some(
      (p) => p.user_id === currentUserId
    );

    return (
      <article key={balade.id} className={styles.card}>
        <div className={styles.cardTop}>
          <h2>{flash ? `⚡ ${balade.titre}` : balade.titre}</h2>
          <p>{formatDateAffichage(balade.date)}</p>
        </div>

        <div style={{ marginBottom: "10px", color: "rgba(255,255,255,0.9)" }}>
          Créée par : {balade.créateur_nom || "Organisateur"}
        </div>

        <div className={styles.infoRow}>
          <span className={styles.badge}>{balade.km} km</span>
          <span className={`${styles.badge} ${getNiveauClass(balade.niveau)}`}>
            {getNiveauLabel(balade.niveau)}
          </span>
        </div>

        <div style={{ marginTop: "14px", marginBottom: "12px" }}>
          <p
            style={{
              margin: "0 0 8px 0",
              fontWeight: 600,
              color: "white",
            }}
          >
            Participer :
          </p>

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder={
                userEmail ? "Écris ton nom" : "Connecte-toi pour participer"
              }
              value={nomsParBalade[balade.id] || ""}
              onChange={(e) =>
                setNomsParBalade((prev) => ({
                  ...prev,
                  [balade.id]: e.target.value,
                }))
              }
              className={styles.input}
              style={{ flex: 1, minWidth: "180px" }}
              disabled={!userEmail || estInscrit}
            />

            {estInscrit ? (
              <button
                type="button"
                className={styles.no}
                onClick={() => seDesinscrire(balade.id)}
                style={{
                  border: "none",
                  borderRadius: "12px",
                  padding: "11px 16px",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Se désinscrire
              </button>
            ) : (
              <button
                type="button"
                className={styles.yes}
                onClick={() => participer(balade.id)}
                style={{
                  border: "none",
                  borderRadius: "12px",
                  padding: "11px 16px",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: userEmail ? 1 : 0.6,
                }}
                disabled={!userEmail}
              >
                Participer
              </button>
            )}
          </div>
        </div>

        <div style={{ marginTop: "14px" }}>
          <p
            style={{
              margin: "0 0 8px 0",
              fontWeight: 600,
              color: "white",
            }}
          >
            Participants :
          </p>

          {participantsBalade.length === 0 ? (
            <p
              style={{
                margin: 0,
                color: "rgba(255, 255, 255, 0.82)",
              }}
            >
              Aucun participant pour le moment.
            </p>
          ) : (
            <ul
              style={{
                margin: 0,
                paddingLeft: "18px",
                color: "white",
              }}
            >
              {participantsBalade.map((p) => (
                <li key={p.id} style={{ marginBottom: "6px" }}>
                  {p.pseudo}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>Balades Moto The Biker Team</h1>
        <p className={styles.subtitle}>Choisis ta prochaine balade</p>

        <div className={styles.card} style={{ marginBottom: "20px" }}>
          <h2 style={{ marginTop: 0 }}>👤 Connexion</h2>

          {userEmail ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <p style={{ fontWeight: 500, margin: 0 }}>Connecté : {userEmail}</p>

              <div>
                <button type="button" className={styles.no} onClick={deconnexion}>
                  Se déconnecter
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />

              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className={styles.createButton}
                  onClick={inscription}
                >
                  Créer un compte
                </button>

                <button type="button" className={styles.yes} onClick={connexion}>
                  Se connecter
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          className={styles.createButton}
          onClick={() => {
            if (!userEmail) {
              alert("Tu dois être connecté pour créer une balade.");
              return;
            }
            setShowForm(!showForm);
          }}
          style={{
            opacity: userEmail ? 1 : 0.6,
            cursor: userEmail ? "pointer" : "not-allowed",
          }}
        >
          {showForm ? "Fermer" : "+ Créer une balade"}
        </button>

        {showForm && (
          <form className={styles.form} onSubmit={ajouterBalade}>
            <input
              type="text"
              placeholder="Titre de la balade"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className={styles.input}
            />

            <input
              type="number"
              placeholder="Kilomètres"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              className={styles.input}
            />

            <select
              value={niveau}
              onChange={(e) => setNiveau(e.target.value as Niveau)}
              className={styles.input}
            >
              <option value="novice">Novice</option>
              <option value="intermédiaire">Intermédiaire</option>
              <option value="confirmé">Confirmé</option>
            </select>

            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.input}
            />

            <button type="submit" className={styles.submitButton}>
              Ajouter
            </button>
          </form>
        )}

        <div className={styles.list}>
          <div>
            <h2 style={{ color: "white", marginBottom: "10px" }}>
              📅 Balades prévues
            </h2>

            {baladesPrevues.length === 0 ? (
              <p style={{ color: "white" }}>Aucune balade prévue.</p>
            ) : (
              baladesPrevues.map((balade) => renderBalade(balade, false))
            )}
          </div>

          <div style={{ marginTop: "8px" }}>
            <h2 style={{ color: "white", marginBottom: "10px" }}>
              ⚡ Dernières minutes
            </h2>

            {baladesDerniereMinute.length === 0 ? (
              <p style={{ color: "white" }}>Aucune balade de dernière minute.</p>
            ) : (
              baladesDerniereMinute.map((balade) => renderBalade(balade, true))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}