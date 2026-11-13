import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { interviewPrep } from "@/data/content";

export const Route = createFileRoute("/interview-prep")({
  head: () => ({ meta: [{ title: "Interview prep — Miro Women In Engineering" }, { name: "description", content: "General interview tips and role-specific guides for engineering, management, product and data." }, { property: "og:title", content: "Interview prep — Miro Women In Engineering" }, { property: "og:description", content: "General interview tips and role-specific guides for engineering, management, product and data." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Prep,
});

const RECRUITER = [
  { name: "Research", tone: "tag-management", items: ["Read the job post and pick the 5 must-have skills", "Skim the company site, product and recent news", "Look up your recruiter on LinkedIn", "Note level, team, location and pay range if listed"] },
  { name: "Your story", tone: "tag-career", items: ["A 60-second \"tell me about yourself\"", "Why this role, why now", "3 wins with numbers", "A positive reason for leaving your current job"] },
  { name: "Answers & questions", tone: "tag-product", items: ["Your salary range and flexibility", "Notice period and start date", "Work authorization, location and remote needs", "Ask about the hiring process, timeline, team and what they value most"] },
  { name: "Day of & after", tone: "tag-design", items: ["Test audio, camera and a quiet room", "Keep your résumé and notes in front of you", "Take notes on next steps", "Send a thank-you email within 24 hours"] },
];

const HIRING = [
  { name: "Understand the role", tone: "tag-management", items: ["Re-read the job post and map each requirement to your experience", "Research the manager: background, posts, team projects", "Guess the team's top 3 problems", "Prepare a view on how you'd approach your first 90 days"] },
  { name: "Build your stories", tone: "tag-career", items: ["List 6–8 stories: conflict, failure, leadership, tight deadline, ambiguity, influence", "Write each as STAR: situation, task, action, result", "Add numbers to every result", "Prep a failure story with what you learned"] },
  { name: "Practice delivery", tone: "tag-product", items: ["Say each story aloud in under 2 minutes", "Do a mock interview with a friend or record yourself", "Prep \"greatest weakness\" and \"why should we hire you\"", "Use \"I\" for your actions, \"we\" for team results"] },
  { name: "Ask & follow up", tone: "tag-design", items: ["Ask: what does success look like in 6 months?", "Ask about team style, biggest challenges and how feedback works", "Ask about next steps and timing", "Send a tailored thank-you within 24 hours"] },
];

function Section({ title, items, mark, groups, goal, notes, topics }: { goal?: string; notes?: string; title: string; items: string[]; mark: string; groups?: typeof RECRUITER; topics?: typeof interviewPrep.functions[number]["topics"] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="group flex w-full items-center justify-between gap-4 text-left">
        <h2 className="text-2xl font-bold text-forest">{title}</h2>
        <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground ${open ? "rotate-180" : ""}`} aria-hidden><ChevronDown size={22} strokeWidth={2.5} /></span>
      </button>
      {open && goal && <p className="mt-4 font-medium text-foreground">🎯 {goal}</p>}
      {open && notes && <Link to="/sessions" className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground">📄 Session notes: {notes} →</Link>}
      {open && groups && <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{groups.map((g, n) => (<div key={g.name} className={`rounded-2xl p-5 ${g.tone}`}><p className="text-xs font-semibold uppercase tracking-wider opacity-70">Step {n + 1}</p><h3 className="mt-1 text-lg font-bold">{g.name}</h3><ul className="mt-3 space-y-2 text-sm text-foreground/80">{g.items.map((i) => <li key={i} className="flex gap-2"><span>•</span><span>{i}</span></li>)}</ul></div>))}</div>}
      {open && topics && <div className="mt-6 divide-y divide-border">{topics.map((topic) => <EngineeringTopic key={topic.name} topic={topic} />)}</div>}
      {open && !groups && !topics && <ul className="mt-5 grid gap-3 text-muted-foreground md:grid-cols-2">{items.map((i) => <li key={i}>{mark} {i}</li>)}</ul>}
    </div>
  );
}

function EngineeringTopic({ topic }: { topic: typeof interviewPrep.functions[number]["topics"][number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-4">
      <Button variant="ghost" onClick={() => setOpen(!open)} aria-expanded={open} className="h-auto w-full justify-between gap-4 whitespace-normal px-0 py-2 text-left hover:bg-transparent">
        <h3 className={`rounded-md px-3 py-2 text-lg font-semibold ${topic.tone}`}>{topic.name}</h3>
        <ChevronDown aria-hidden className={`shrink-0 text-primary transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
      </Button>
      {open && (topic.resources.length ? <ul className="mt-3 space-y-3">{topic.resources.map((resource) => <li key={resource.url}><Button asChild variant="link" className="h-auto whitespace-normal px-0 text-left"><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title} ↗</a></Button></li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">No resources added yet.</p>)}
    </div>
  );
}

function Prep() {
  return (
    <>
      <PageHeader eyebrow="Interview prep" title="Walk in prepared" intro="Start with the basics that apply everywhere, then go deeper for your function." />
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20">
        <Section title="Recruiter interview" items={[]} mark="" groups={RECRUITER} goal="Goal: be clear on why you, why this role, and what you need." />
        <Section title="Hiring manager & behavioral interview" items={[]} mark="" groups={HIRING} notes="Navigating Behavioral & Hiring Manager Interviews" goal="Goal: show you can do the job, work well with people, and prove it with real stories." />
        {interviewPrep.functions.map((f) => <Section key={f.name} title={f.name} items={[]} mark="—" topics={f.topics} />)}
      </section>
    </>
  );
}
