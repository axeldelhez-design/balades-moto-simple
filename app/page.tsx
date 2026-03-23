type Balade = {
  id: number;
  titre: string;
  description: string;
  km: number;
  niveau: "novice" | "intermédiaire" | "confirmé";
};

const balades: Balade[] = [
  {
    id: 1,
    titre: "Balade Ardennes",
    description: "Belle route avec virages et paysages.",
    km: 120,
    niveau: "intermédiaire",
  },
  {
    id: 2,
    titre: "Balade Namur",
    description: "Sortie tranquille pour profiter calmement.",
    km: 65,
    niveau: "novice",
  },
  {
    id: 3,
    titre: "Balade Dinant",
    description: "Parcours plus long et un peu plus technique.",
    km: 180,
    niveau: "confirmé",
  },
];

function couleurNiveau(niveau: Balade["niveau"]) {
  if (niveau === "novice") return "#dcfce7";
  if (niveau === "intermédiaire") return "#fef9c3";
  return "#fee2e2";
}

function texteNiveau(niveau: Balade["niveau"]) {
  if (niveau === "novice") return "Novice";
  if (niveau === "intermédiaire") return "Intermédiaire";
  return "Confirmé";
}

export default function Home() {
  return (
    <main style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>Balades moto</h1>

      {balades.map((balade) => (
        <div
          key={balade.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#fff",
          }}
        >
          <h2 style={{ marginBottom: "8px" }}>{balade.titre}</h2>

          <p style={{ marginBottom: "12px", color: "#555" }}>
            {balade.description}
          </p>

          <div style={{ marginTop: "10px" }}>
            <span
              style={{
                backgroundColor: "#dbeafe",
                color: "#1d4ed8",
                padding: "6px 12px",
                borderRadius: "999px",
                marginRight: "10px",
                display: "inline-block",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {balade.km} km
            </span>

            <span
              style={{
                backgroundColor: couleurNiveau(balade.niveau),
                padding: "6px 12px",
                borderRadius: "999px",
                display: "inline-block",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {texteNiveau(balade.niveau)}
            </span>
          </div>
        </div>
      ))}
    </main>
  );
}