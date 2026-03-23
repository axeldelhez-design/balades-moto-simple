"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Balade = {
  id: number;
  titre: string;
  date: string;
};

export default function HomePage() {
  const [balades, setBalades] = useState<Balade[]>([
    { id: 1, titre: "Balade Ardennes", date: "Dimanche 14 avril" },
    { id: 2, titre: "Tour des lacs", date: "Samedi 20 avril" },
    { id: 3, titre: "Forêt et petites routes", date: "Dimanche 28 avril" },
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
    };

    setBalades([nouvelleBalade, ...balades]);
    setTitre("");
    setDate("");
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