"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Award, BarChart2, Brain, ArrowRight } from "lucide-react"

interface Profile {
  id: string
  total_savings: number
  current_level: number
  current_score: number
  badges_earned: string[]
}

interface SavingsData {
  month: string
  income: number
  expenses: number
  savings: number
}

const CHALLENGES = [
  "Save 20% of your income this month",
  "Reduce expenses by $100",
  "Track every transaction for a week",
  "Find one recurring expense to cut",
  "Build a $1,000 emergency fund",
]

export default function InsightsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [savingsData, setSavingsData] = useState<SavingsData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [challengeIndex, setChallengeIndex] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")

        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        const { data: savingsDataResponse } = await supabase
          .from("savings_data")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })

        setProfile(profileData)
        setSavingsData(savingsDataResponse || [])
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [supabase])

  useEffect(() => {
    setChallengeIndex(Math.floor(Math.random() * CHALLENGES.length))
  }, [])

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
            <CardDescription>{error || "Unable to load insights"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const randomChallenge = CHALLENGES[challengeIndex]
  const avgSavings =
    savingsData.length > 0 ? Math.round(savingsData.reduce((sum, d) => sum + d.savings, 0) / savingsData.length) : 0

  const metricCards = [
    {
      label: "Score",
      value: `${profile.current_score}/100`,
      helper: "Performance gauge",
      icon: BarChart2,
      accent: "text-primary",
    },
    {
      label: "Level",
      value: `Lvl ${profile.current_level}`,
      helper: "Current tier",
      icon: Award,
      accent: "text-accent",
    },
    {
      label: "Badges",
      value: profile.badges_earned.length,
      helper: "Lifetime unlocked",
      icon: Brain,
      accent: "text-foreground",
    },
  ]

  const trendData = savingsData.slice(-6)

  return (
    <div className="relative min-h-svh bg-linear-to-b from-background via-background/95 to-secondary/30 px-4 py-10 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(249,115,22,0.12),transparent_60%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            Insights
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Your insights at a glance</h1>
            <p className="text-sm text-muted-foreground">
              Financial analysis, gamification progress, and the next challenge to keep you moving.
            </p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {metricCards.map((metric) => (
            <Card
              key={metric.label}
              className="border border-border/60 bg-background/80 shadow-lg shadow-primary/10 backdrop-blur transition hover:-translate-y-0.5"
            >
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <metric.icon className={`h-5 w-5 ${metric.accent}`} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.helper}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4">
          <Card className="border border-white/10 bg-card/80 shadow-xl shadow-primary/10 ring-1 ring-white/5 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-muted-foreground">Total savings</CardTitle>
              <CardDescription className="text-3xl font-semibold text-foreground">
                ${profile.total_savings.toLocaleString()}
              </CardDescription>
            </CardHeader>
          </Card>

          {profile.badges_earned.length > 0 && (
            <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/10 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Badges earned</CardTitle>
                <CardDescription>Stack streaks to unlock the next tier.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.badges_earned.map((badge, i) => (
                    <Badge
                      key={i}
                      className="border border-primary/30 bg-primary/10 text-primary transition hover:-translate-y-0.5"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border border-border/60 bg-background/80 shadow-lg shadow-primary/10 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Monthly trend</CardTitle>
              <CardDescription className="text-xs">
                Average monthly savings: ${avgSavings.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trendData.length === 0 ? (
                <p className="text-sm text-muted-foreground">Upload data to see your month-over-month story.</p>
              ) : (
                <div className="space-y-3">
                  {trendData.map((data, i) => {
                    const percent = avgSavings > 0 ? Math.min((data.savings / avgSavings) * 100, 100) : 100
                    return (
                      <div key={`${data.month}-${i}`} className="space-y-1 text-xs">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="font-medium">{data.month}</span>
                          <span className="text-foreground">${data.savings.toLocaleString()}</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary/70">
                          <div
                            className="h-full rounded-full bg-accent transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-primary/30 bg-primary/5 shadow-lg shadow-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-primary">Next challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-lg font-medium text-foreground">{randomChallenge}</p>
              <p className="text-xs text-muted-foreground">Complete challenges to earn bonus points and badges.</p>
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <ArrowRight className="h-4 w-4" />
                Log your progress in the dashboard
              </div>
            </CardContent>
          </Card>
        </section>

        <Button
          className="w-full bg-primary text-base shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary/90"
          asChild
        >
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
