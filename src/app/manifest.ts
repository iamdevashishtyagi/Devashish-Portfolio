import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Devashish Tyagi | Best Website Developer & Full Stack Engineer",
    short_name: "Devashish Tyagi",
    description:
      "Official portfolio of Devashish Tyagi — Best Website Developer & Full Stack Engineer in Meerut & India specializing in Next.js, React, Node.js, and AI systems.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f2",
    theme_color: "#fbf8f2",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
