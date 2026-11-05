import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Corus — Controle de Orçamentos Industriais" },
      { name: "description", content: "Acesse o sistema de orçamentos industriais da Corus Equipamentos." },
      { property: "og:title", content: "Corus — Controle de Orçamentos Industriais" },
      { property: "og:description", content: "Acesse o sistema de orçamentos industriais da Corus Equipamentos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
