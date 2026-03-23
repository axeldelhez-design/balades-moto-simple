"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Niveau = "novice" | "intermédiaire" | "confirmé";

type Balade = {
  id: number;
  titre: string;
  date: string;
  km: number;
  niveau: Niveau;
};

export default function HomePage() {
  const [balades, setBalades] = useState<Balade[]>([
    {
      id: 1,
      titre: "Balade Ardennes",
      date: "Dimanche 14 avril",
      km: 120,
      niveau: "intermédiaire",
    },
    {
      id: 2,
      titre: "Tour des lacs",
      date: "Samedi 20 avril",
      km: 65,
      niveau: "novice",
    },
    {
      id: 3,
      titre: "Forêt et petites routes",
      date: "Dimanche 28 avril",
      km: 180,
      niveau: "confirmé",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [titre, setTitre] = useState("");
  const [date, setDate] = useState("");

  function ajouterBalade(e: React.FormEvent) {
    e.preventDefault();

    if (!titre.trim() || !date.trim()) return;

    const nouvelleBalade: Balade = {
      id: Date.now(),
      titre,
      date,
      km: 0,
      niveau: "novice",
    };

    setBalades([nouvelleBalade, ...balades]);
    setTitre("");
    setDate("");
    setShowForm(false);
  }

  function getNiveauLabel(niveau: Niveau) {
    if (niveau === "novice") return "Novice";
    if (niveau === "intermédiaire") return "Intermédiaire";
    return "Confirmé";
  }

  function getNiveauStyle(niveau: Niveau) {
    if (niveau === "novice") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      };
    }

    if (niveau === "intermédiaire") {
      return {
        backgroundColor: "#fef9c3",
        color: "#a16207",
      };
    }

    return {
      backgroundColor: "#fee2e2",
      color: "#b91c1c",
    };
  }

  return (
    <main className={styles.page}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>Balades Moto The Biker Team</h1>
        <p className={styles.subtitle}>Choisis ta prochaine balade</p>

        <button
          className={styles.createButton}
          onClick={() => setShowForm(!showForm)}
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
              type="text"
              placeholder="Date de la balade"
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
          {balades.map((balade) => (
            <article key={balade.id} className={styles.card}>
              <div className={styles.cardTop}>
                <h2>{balade.titre}</h2>
                <p>{balade.date}</p>

                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#dbeafe",
                      color: "#1d4ed8",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "14px",
                      fontWeight: 600,
                      display: "inline-block",
                    }}
                  >
                    {balade.km} km
                  </span>

                  <span
                    style={{
                      ...getNiveauStyle(balade.niveau),
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "14px",
                      fontWeight: 600,
                      display: "inline-block",
                    }}
                  >
                    {getNiveauLabel(balade.niveau)}
                  </span>
                </div>
              </div>

              <div className={styles.actions}>
                <button className={styles.yes}>Je viens</button>
                <button className={styles.maybe}>Peut-être</button>
                <button className={styles.no}>Non</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}