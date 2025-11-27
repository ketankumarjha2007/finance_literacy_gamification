"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowUpRight, Gauge, LogOut, Sparkles, Trophy } from "lucide-react"

interface Profile {
  id: string
  monthly_goal: number | null
  total_savings: number
  current_level: number
  current_score: number
  badges_earned: string[]
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")

        const { data, error: err } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (err) throw err

        if (data && !data.monthly_goal) {
          router.push("/set-goal")
          return
        }

        setProfile(data)
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-svh items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-sm">
          <CardHeader className="text-center">
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || "Unable to load profile"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progressPercentage = profile.monthly_goal
    ? Math.min((profile.total_savings / profile.monthly_goal) * 100, 100)
    : 0

  const remainingAmount =
    profile.monthly_goal !== null ? Math.max(profile.monthly_goal - profile.total_savings, 0) : null
  const goalMessage =
    remainingAmount === null
      ? "Set a monthly goal to start tracking."
      : remainingAmount === 0
        ? "You're ahead of plan—consider raising your goal!"
        : `Only $${remainingAmount.toLocaleString()} remaining`

  const quickStats = [
    {
      label: "Current Level",
      value: `Lv ${profile.current_level}`,
      helper: "Keep stacking streaks",
      icon: Trophy,
      accent: "text-accent",
    },
    {
      label: "Score",
      value: profile.current_score,
      helper: "Out of 100",
      icon: Gauge,
      accent: "text-primary",
    },
    {
      label: "Goal remaining",
      value: remainingAmount !== null ? `$${remainingAmount.toLocaleString()}` : "—",
      helper:
        remainingAmount === null ? "Set a monthly goal" : remainingAmount === 0 ? "Goal reached!" : "Stay the course",
      icon: ArrowUpRight,
      accent: "text-foreground",
    },
  ]

  return (
    <div className="relative min-h-svh bg-linear-to-b from-background via-background/95 to-secondary/20 px-4 py-10 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(245,158,11,0.12),transparent_60%)]" />
      </div>
      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              <Sparkles className="h-3 w-3" aria-hidden />
              Live Progress
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Your savings control center</h1>
              <p className="text-sm text-muted-foreground">
                ${profile.total_savings.toLocaleString()} saved this month • Keep momentum to unlock more badges
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 border-border/60 bg-background/60 text-xs uppercase tracking-wide shadow-sm transition hover:-translate-y-0.5"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>

        <section className="grid gap-6">
          <Card className="border border-white/10 bg-card/80 shadow-2xl shadow-primary/10 ring-1 ring-white/5 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-muted-foreground">Monthly progress</CardTitle>
              <CardDescription className="text-2xl font-semibold text-foreground">
                ${profile.total_savings.toLocaleString()} of ${profile.monthly_goal?.toLocaleString() ?? 0}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-3 rounded-full bg-secondary/70">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <p className="font-medium text-primary">{progressPercentage.toFixed(0)}% to goal</p>
                <p className="text-muted-foreground">{goalMessage}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            {quickStats.map((stat) => (
              <Card
                key={stat.label}
                className="border border-border/60 bg-background/80 shadow-lg shadow-primary/10 backdrop-blur transition hover:-translate-y-0.5"
              >
                <CardContent className="flex flex-col gap-4 p-5">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <stat.icon className={`h-5 w-5 ${stat.accent}`} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.helper}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {profile.badges_earned.length > 0 && (
            <Card className="border border-border/60 bg-card/80 shadow-lg shadow-primary/10 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Badges earned</CardTitle>
                <CardDescription>Celebrate wins and keep your streak alive.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.badges_earned.map((badge, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="border border-primary/30 bg-primary/10 text-primary transition hover:-translate-y-0.5"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            className="w-full border-border/60 bg-background/70 text-base shadow-sm backdrop-blur transition hover:-translate-y-0.5"
            asChild
          >
            <Link href="/edit-goal">Edit goal</Link>
          </Button>
          <Button
            className="w-full bg-primary text-base shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary/90"
            asChild
          >
            <Link href="/upload-data">Upload data</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
