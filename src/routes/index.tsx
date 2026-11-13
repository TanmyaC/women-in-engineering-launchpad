import { createFileRoute, Link } from "@tanstack/react-router";
import { cardClass } from "@/components/SiteShell";
import { TopicBoard } from "@/components/TopicBoard";
import hero from "@/assets/hero-mentoring.jpg";

export const Route = createFileRoute("/")({
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

const values = [
  { title: "Learn out loud", text: "Share what you know, ask what you don't." },
  { title: "Lift as we climb", text: "Every member is someone's mentor." },
  { title: "Show up", text: "Sessions shaped by the community, for the community." },
];

function Index() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-14 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">👋 Welcome to our community</p>
          <h1 className="mt-5 text-5xl font-bold leading-[1.05] text-forest md:text-6xl">
            Where women in engineering <span className="bg-gradient-warm bg-clip-text text-transparent">grow together.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Miro Women In Engineering is our space to connect, learn from each other and open doors — from your first interview to your next big role.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#topics" className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-soft transition hover:scale-105">Vote on the next session</a>
            <Link to="/mentorship" className="rounded-full border border-forest px-6 py-3 font-medium text-forest transition hover:bg-secondary">Find a mentor</Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-3 rotate-2 rounded-[2rem] bg-gradient-warm opacity-60" />
          <img src={hero} alt="A mentor and a younger engineer talking over coffee" width={1280} height={1024} className="relative rounded-[2rem] shadow-soft" />
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

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 rounded-[calc(var(--radius)+12px)] bg-secondary p-8 md:grid-cols-3 md:p-12">
          {values.map((v, i) => (
            <div key={v.title}>
              <p className="font-display text-5xl font-bold text-primary">0{i + 1}</p>
              <h3 className="mt-2 text-xl font-bold text-secondary-foreground">{v.title}</h3>
              <p className="mt-1 text-secondary-foreground/80">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
