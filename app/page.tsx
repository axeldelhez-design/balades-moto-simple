"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Niveau = "Novice" | "Intermédiaire" | "Confirmé";

type Balade = {
  id: number;
  titre: string;
  date: string;
  km: string;
  niveau: Niveau;
};

export default function HomePage() {
  const [balades, setBalades] = useState<Balade[]>([
    {
      id: 1,
      titre: "Sortie entre potes",
      date: "Ce week-end",
      km: "120 km",
      niveau: "Novice",
    },
    {
      id: 2,
      titre: "Virée coucher de soleil",
      date: "Vendredi soir",
      km: "180 km",
      niveau: "Intermédiaire",
    },
    {
      id: 3,
      titre: "Roadtrip montagne",
      date: "Prochain dimanche",
      km: "260 km",
      niveau: "Confirmé",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [titre, setTitre] = useState("");
  const [date, setDate] = useState("");
  const [km, setKm] = useState("");
  const [niveau, setNiveau] = useState<Niveau>("Novice");

  function ajouterBalade(e: React.FormEvent) {
    e.preventDefault();

    if (!titre.trim() || !date.trim() || !km.trim()) return;

    const nouvelleBalade: Balade = {
      id: Date.now(),
      titre,
      date,
      km,
      niveau,
    };

    setBalades([nouvelleBalade, ...balades]);
    setTitre("");
    setDate("");
    setKm("");
    setNiveau("Novice");
    setShowForm(false);
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

            <input
              type="text"
              placeholder="Distance (ex: 150 km)"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              className={styles.input}
            />

            <select
              value={niveau}
              onChange={(e) => setNiveau(e.target.value as Niveau)}
              className={styles.input}
            >
              <option value="Novice">Novice</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Confirmé">Confirmé</option>
            </select>

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

                <div className={styles.infoRow}>
                  <span className={styles.badge}>{balade.km}</span>
                  <span
                    className={`${styles.badge} ${
                      balade.niveau === "Novice"
                        ? styles.novice
                        : balade.niveau === "Intermédiaire"
                        ? styles.intermediaire
                        : styles.confirme
                    }`}
                  >
                    {balade.niveau}
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