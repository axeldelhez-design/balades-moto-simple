import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Balades Moto The Biker Team",
    short_name: "Balades Moto",
    description: "Organisation de balades moto prévues et dernière minute",
    start_url: "/",
    display: "standalone",
    background_color: "#111827",
    theme_color: "#111827",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/icon-512.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
      },
      {
        src: "/apple-icon.jpeg",
        sizes: "180x180",
        type: "image/jpeg",
      },
    ],
  };
}