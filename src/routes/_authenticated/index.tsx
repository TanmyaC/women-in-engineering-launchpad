import { createFileRoute, Link } from "@tanstack/react-router";
import { TopicBoard } from "@/components/TopicBoard";
import { Button } from "@/components/ui/button";
import { Code2, MessagesSquare, Compass, Mic2, Sprout, HeartHandshake, ShieldCheck, FileText, Target, BriefcaseBusiness, BookOpen, ArrowUpRight } from "lucide-react";
import hero from "@/assets/hero-idea-wall.jpg";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({ meta: [{ title: "Miro Women In Engineering — Our community home" }, { name: "description", content: "The home of Miro Women In Engineering: vote on session topics, find a mentor, prep for interviews and grow together." }, { property: "og:title", content: "Miro Women In Engineering — Our community home" }, { property: "og:description", content: "Vote on session topics, find a mentor, prep for interviews and grow together." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Index,
});

const why = [
  { icon: Sprout, title: "Grow your skills", text: "Build skills and open new career doors." },
  { icon: MessagesSquare, title: "Share the real stuff", text: "Exchange honest workplace experiences." },
  { icon: ShieldCheck, title: "Build confidence", text: "Work through self-doubt together." },
  { icon: HeartHandshake, title: "Mentor & be mentored", text: "Give and find support across Miro." },
];

const explore = [
  { to: "/sessions", icon: FileText, title: "Session notes", text: "Lessons from our conversations." },
  { to: "/mentorship", icon: HeartHandshake, title: "Mentorship", text: "Find support. Share your experience." },
  { to: "/interview-prep", icon: Target, title: "Interview prep", text: "Prepare with confidence." },
  { to: "/jobs", icon: BriefcaseBusiness, title: "Finding a job", text: "Tools for your next career move." },
  { to: "/resources", icon: BookOpen, title: "Resources", text: "Books and links worth sharing." },
] as const;

const how = [
  { icon: Code2, title: "Learn together", text: "Technical skills, career growth and leadership." },
  { icon: Compass, title: "Find your people", text: "Connect with peers, mentors and senior leaders." },
  { icon: MessagesSquare, title: "Keep it real", text: "Honest conversations, without judgment." },
  { icon: Mic2, title: "Share experience", text: "Learn from women who've walked the path." },
  { icon: Sprout, title: "Lift each other up", text: "Share opportunities and advocate for one another." },
];

function Index() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-14 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">👋 Welcome to our community</p>
          <h1 className="mt-5 text-5xl font-bold leading-[1.05] text-forest md:text-6xl">
            A safe space to <span className="bg-gradient-warm bg-clip-text text-transparent">grow, lead and lift each other.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            We're a community for women in engineering at Miro — not just engineers — building confidence, skills and careers together. From technical upskilling to beating imposter syndrome, nobody navigates it alone.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="h-auto rounded-full px-6 py-3 text-base shadow-soft transition hover:scale-105">
              <a href="https://www.linkedin.com/groups/42842291/" target="_blank" rel="noopener noreferrer">Join our LinkedIn group</a>
            </Button>
            <Link to="/mentorship" className="rounded-full border border-forest px-6 py-3 font-medium text-forest transition hover:bg-secondary">Find a mentor</Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-3 rotate-2 rounded-[2rem] bg-gradient-warm opacity-60" />
          <img src={hero} alt="Women engineers adding sticky notes to a giant idea wall" width={1280} height={1024} className="relative rounded-[2rem] shadow-soft" />
        </div>
      </section>

      <section id="topics" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20">
        <TopicBoard />
      </section>

      <section aria-labelledby="explore-heading" className="border-y border-primary/15 bg-accent/15">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-primary"><span aria-hidden="true" className="h-px w-8 bg-primary" />Explore the hub</p>
        <h2 id="explore-heading" className="mt-3 text-3xl font-bold text-forest md:text-4xl">Shared knowledge. New possibilities.</h2>
        <p className="mt-3 text-muted-foreground">What we learn and share, all in one place.</p>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {explore.map(({ to, icon: Icon, title, text }) => (
            <li key={to} className="border-t border-primary/20 pt-4">
              <Button asChild variant="link" className="h-auto w-full items-start justify-start whitespace-normal rounded-sm p-0 text-left text-forest hover:no-underline">
                <Link to={to} className="group">
                  <Icon aria-hidden="true" className="mt-1 shrink-0 text-primary" strokeWidth={1.5} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start gap-1 font-display text-lg font-bold">
                      {title}<ArrowUpRight aria-hidden="true" className="mt-1 shrink-0 text-primary motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-1 block text-sm font-normal text-muted-foreground">{text}</span>
                  </span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
        </div>
      </section>

      <section aria-labelledby="mission-heading" className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div>
          <div>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-primary"><span aria-hidden="true" className="h-px w-8 bg-primary" />Our mission</p>
            <h2 id="mission-heading" className="mt-3 text-3xl font-bold text-forest md:text-4xl">More confidence. More opportunity.</h2>
            <p className="mt-3 text-muted-foreground">Helping women in engineering at Miro grow, lead and thrive — together.</p>
          </div>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {why.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3 border-t border-sage/30 pt-4">
                <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.5} />
                <div>
                  <h3 className="text-lg font-bold text-forest">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="border-y border-sage/25 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
          <div>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-primary"><span aria-hidden="true" className="h-px w-8 bg-primary" />How we do it</p>
            <h2 id="how-heading" className="mt-3 text-3xl font-bold text-forest md:text-4xl">Growth isn’t a solo project.</h2>
          </div>
          <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {how.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3 border-t border-sage/30 pt-4">
                <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.5} />
                <div>
                  <h3 className="text-lg font-bold text-forest">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
