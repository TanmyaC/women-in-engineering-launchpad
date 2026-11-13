import { useEffect, useRef, useState } from "react";
import { aiJobJourney as j } from "@/data/content";

export function AiJobJourney() {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!seen) return;
    const t = setInterval(() => setActive((a) => (a + 1) % j.stages.length), 2600);
    return () => clearInterval(t);
  }, [seen]);

  const reveal = (delay: number) => ({
    className: `transition-all duration-700 ease-out ${seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`,
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-6 pb-16">
      <div className="rounded-3xl bg-forest p-6 text-forest-foreground md:p-10">
        <div {...reveal(0)}>
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Your roadmap</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">{j.title}</h2>
          <p className="mt-2 text-lg opacity-90">{j.tagline}</p>
        </div>

        <div className="relative mt-8 hidden h-1 rounded-full bg-forest-foreground/20 lg:block">
          <div className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-700" style={{ width: seen ? `${((active + 1) / j.stages.length) * 100}%` : "0%" }} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {j.stages.map((s, i) => {
            const on = i === active;
            return (
              <div key={s.name} {...reveal(150 + i * 120)} onMouseEnter={() => setActive(i)}>
                <div className={`h-full rounded-2xl p-3 transition-all duration-500 ${on ? "bg-forest-foreground/15 ring-2 ring-accent" : "bg-forest-foreground/5"}`}>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs transition ${on ? "bg-accent text-accent-foreground scale-110" : "bg-forest-foreground/15"}`}>{i + 1}</span>
                    {s.name}
                  </p>
                  <div className="mt-1 text-2xl" aria-hidden>{s.icon}</div>
                  <ul className="mt-3 space-y-2">
                    {s.steps.map((step, k) => (
                      <li key={step} className={`rounded-xl px-3 py-2 text-sm leading-snug transition-all duration-500 ${s.highlight === k ? "bg-primary font-semibold text-primary-foreground" : "bg-card text-card-foreground"} ${on ? "-translate-y-0.5 shadow-md" : ""}`} style={{ transitionDelay: on ? `${k * 70}ms` : "0ms" }}>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div {...reveal(950)} >
          <p className="mt-10 text-sm font-semibold uppercase tracking-widest opacity-80">🛡️ Guardrails at every stage</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {j.guardrails.map((g) => (
              <div key={g} className="rounded-xl border border-accent/60 bg-accent/15 px-4 py-3 text-sm font-medium transition hover:-translate-y-1 hover:bg-accent hover:text-accent-foreground">{g}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
