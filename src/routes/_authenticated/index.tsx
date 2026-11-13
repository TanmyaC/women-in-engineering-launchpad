import { createFileRoute, Link } from "@tanstack/react-router";
import { cardClass } from "@/components/SiteShell";
import { TopicBoard } from "@/components/TopicBoard";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-idea-wall.jpg";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({ meta: [{ title: "Miro Women In Engineering — Our community home" }, { name: "description", content: "The home of Miro Women In Engineering: vote on session topics, find a mentor, prep for interviews and grow together." }, { property: "og:title", content: "Miro Women In Engineering — Our community home" }, { property: "og:description", content: "Vote on session topics, find a mentor, prep for interviews and grow together." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Index,
});

const explore = [
  { to: "/sessions", title: "Session notes", text: "Catch up on what we've learned together.", emoji: "📝" },
  { to: "/mentorship", title: "Mentorship", text: "Book a mentor — or become one.", emoji: "🤝" },
  { to: "/interview-prep", title: "Interview prep", text: "General tips and guides per function.", emoji: "🎯" },
  { to: "/jobs", title: "Finding a job", text: "Search, CVs, LinkedIn and negotiation.", emoji: "🚀" },
  { to: "/resources", title: "Useful resources", text: "Links our members swear by.", emoji: "📚" },
] as const;

const why = [
  { emoji: "🌱", title: "Grow your skills", text: "Learn about opportunities for professional development and skill-building." },
  { emoji: "💬", title: "Share the real stuff", text: "Swap experiences and advice on navigating the workplace." },
  { emoji: "💪", title: "Beat imposter syndrome", text: "Support each other through self-doubt and work-life balance." },
  { emoji: "🤝", title: "Mentor & be mentored", text: "Foster mentorship and peer support across Miro." },
];

const how = [
  "Sessions on technical upskilling, career development and leadership",
  "Opportunities to connect with peers and senior leaders",
  "Safe spaces to share challenges, advice and resources",
  "Insights from successful women in engineering",
  "Driving positive change at work and advocating for each other",
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

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold text-forest md:text-4xl">Explore the hub</h2>
          <p className="hidden text-muted-foreground md:block">Everything our community has built, in one place.</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {explore.map((t) => (
            <Link key={t.to} to={t.to} className={`${cardClass} group transition hover:-translate-y-1 hover:border-primary`}>
              <span className="text-3xl transition group-hover:scale-125 inline-block">{t.emoji}</span>
              <h3 className="mt-4 text-lg font-bold text-forest">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
              <span className="mt-4 inline-block text-sm font-medium text-primary">Go →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Our mission</p>
            <h2 className="mt-3 text-3xl font-bold text-forest md:text-4xl">Fostering the growth, confidence and success of women in engineering.</h2>
            <p className="mt-4 text-muted-foreground">Women in engineering are often underrepresented in leadership, wrestle with self-doubt and struggle to find the right growth opportunities. There wasn't a single place to connect — so we built one.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {why.map((w) => (
              <div key={w.title} className={`${cardClass} group transition hover:-translate-y-1 hover:border-primary`}>
                <span className="inline-block text-3xl transition group-hover:scale-125">{w.emoji}</span>
                <h3 className="mt-3 text-lg font-bold text-forest">{w.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-[calc(var(--radius)+12px)] bg-secondary p-8 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">How we do it</p>
          <h2 className="mt-2 text-3xl font-bold text-secondary-foreground">Together, we…</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-5">
            {how.map((h, i) => (
              <li key={h}>
                <p className="font-display text-4xl font-bold text-primary">0{i + 1}</p>
                <p className="mt-2 text-secondary-foreground">{h}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
