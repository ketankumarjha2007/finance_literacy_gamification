import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles, Trophy, UploadCloud } from "lucide-react"

const features = [
  {
    title: "Smart Progress Tracking",
    description: "Visualize savings trends with rich charts, scorecards, and badge progress.",
    icon: Trophy,
  },
  {
    title: "Secure Supabase Sync",
    description: "Supabase Auth + RLS keep your data encrypted and scoped to your account.",
    icon: ShieldCheck,
  },
  {
    title: "Frictionless Imports",
    description: "Drop in JSON from spreadsheets or budgeting apps and we handle the rest.",
    icon: UploadCloud,
  },
]

export default function HomePage() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-linear-to-b from-background via-background/95 to-secondary/30">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(249,115,22,0.12),_transparent_60%)]" />
      </div>

      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6 lg:px-10">
        <header className="grid items-center gap-12 text-center md:text-left lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Financial Literacy, Gamified
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Turn savings goals into <span className="text-primary">levels, badges,</span> and bragging rights.
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Money Game keeps you motivated with streaks, challenges, and celebratory UI touches every time you save.
                Upload your data, lock in your goals, and watch the progress bar fill up faster than ever.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <Button size="lg" className="bg-primary text-base hover:bg-primary/90" asChild>
                <Link href="/auth/sign-up" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary/20 bg-background/60 text-base" asChild>
                <Link href="/auth/login">I already have an account</Link>
              </Button>
            </div>
            <dl className="grid gap-6 text-left sm:grid-cols-3">
              {[
                { label: "Monthly goals created", value: "8,500+" },
                { label: "Badges earned", value: "22K" },
                { label: "Avg. savings streak", value: "37 days" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border/40 bg-background/60 p-4 text-center shadow-lg shadow-primary/5 backdrop-blur"
                >
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</dt>
                  <dd className="text-2xl font-semibold text-foreground">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl ring-1 ring-white/10 backdrop-blur">
            <div className="space-y-4">
              <p className="text-sm font-medium text-primary">Live preview</p>
              <div className="rounded-2xl bg-background/90 p-5 shadow-inner">
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Current sprint</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">Level 8 • Score 72</p>
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
                      <span>Monthly goal</span>
                      <span>$2,400 / $3,000</span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-secondary">
                      <div className="h-full w-4/5 rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/40 bg-secondary/60 p-4">
                    <p className="text-sm font-medium text-foreground">New badge unlocked</p>
                    <p className="text-xs text-muted-foreground">Consistent Saver • 30-day streak</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl border border-border/50 bg-background/80 p-3">
                      <p className="text-xs text-muted-foreground">This week</p>
                      <p className="text-lg font-semibold text-foreground">+$420</p>
                    </div>
                    <div className="rounded-2xl border border-border/50 bg-background/80 p-3">
                      <p className="text-xs text-muted-foreground">Challenges</p>
                      <p className="text-lg font-semibold text-foreground">2/3 done</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-6 rounded-3xl border border-border/40 bg-background/70 p-8 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Why Money Game works</p>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-border/50 bg-card/80 p-6 shadow-lg shadow-primary/5">
                <feature.icon className="mb-4 h-10 w-10 rounded-2xl bg-primary/10 p-2.5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
