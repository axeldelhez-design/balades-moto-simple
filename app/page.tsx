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
    description: "Sortie tranquille.",
    km: 65,
    niveau: "novice",
  },
  {
    id: 3,
    titre: "Balade Dinant",
    description: "Plus technique et plus longue.",
    km: 180,
    niveau: "confirmé",
  },
];

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Balades moto</h1>

      {balades.map((balade) => (
        <div
          key={balade.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 15,
            marginBottom: 15,
          }}
        >
          <h2>{balade.titre}</h2>
          <p>{balade.description}</p>

          <div style={{ marginTop: 10 }}>
            <span
              style={{
                background: "#e0f2fe",
                padding: "5px 10px",
                borderRadius: 20,
                marginRight: 8,
                display: "inline-block",
              }}
            >
              {balade.km} km
            </span>

            <span
              style={{
                background:
                  balade.niveau === "novice"
                    ? "#dcfce7"
                    : balade.niveau === "intermédiaire"
                    ? "#fef9c3"
                    : "#fee2e2",
                padding: "5px 10px",
                borderRadius: 20,
                display: "inline-block",
              }}
            >
              {balade.niveau === "novice"
                ? "Novice"
                : balade.niveau === "intermédiaire"
                ? "Intermédiaire"
                : "Confirmé"}
            </span>
          </div>
        </div>
      ))}
    </main>
  );
}