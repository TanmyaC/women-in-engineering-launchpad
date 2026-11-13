import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const nav = [
  { to: "/sessions", label: "Session notes" },
  { to: "/jobs", label: "Finding a job" },
  { to: "/interview-prep", label: "Interview prep" },
  { to: "/mentorship", label: "Mentorship" },
  { to: "/resources", label: "Resources" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-forest">
            <span className="h-3 w-3 rounded-full bg-gradient-warm" />
            Miro Women In Engineering
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" activeProps={{ className: "bg-secondary text-secondary-foreground" }}>
                {n.label}
              </Link>
            ))}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="secondary" size="icon" className="shrink-0 rounded-full text-primary">
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSemU_A6jIU7JbiDUu3o528JvqAoP6JoWZpaRZ-4GyziINtKqA/viewform?usp=publish-editor" target="_blank" rel="noopener noreferrer" aria-label="Ideas & feedback">
                      <Lightbulb aria-hidden="true" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ideas &amp; feedback</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Miro Women In Engineering · Built by and for our members
      </footer>
    </div>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-8 pt-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-bold text-forest md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{intro}</p>
    </section>
  );
}

export const cardClass = "rounded-[var(--radius)] border border-border bg-card p-6 shadow-soft";
