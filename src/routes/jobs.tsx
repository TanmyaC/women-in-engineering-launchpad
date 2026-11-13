import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteShell";
import { JobTools } from "@/components/JobTools";
import { AiJobJourney } from "@/components/AiJobJourney";
import { TargetCompanies } from "@/components/TargetCompanies";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Finding a job — Miro Women In Engineering" }, { name: "description", content: "Job search guidance: an AI-powered job search roadmap and tools recommended by our community." }, { property: "og:title", content: "Finding a job — Miro Women In Engineering" }, { property: "og:description", content: "Job search guidance: an AI-powered job search roadmap and tools recommended by our community." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Jobs,
});

function Jobs() {
  return (
    <>
      <PageHeader eyebrow="Finding a job" title="Land your next role" intro="Practical advice gathered from our community on searching, applying and negotiating." />
      <AiJobJourney />
      <TargetCompanies />
      <JobTools />
    </>
  );
}
