"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"

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

  const randomChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]
  const avgSavings =
    savingsData.length > 0 ? Math.round(savingsData.reduce((sum, d) => sum + d.savings, 0) / savingsData.length) : 0

  return (
    <div className="min-h-svh bg-linear-to-b from-background to-secondary/20 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Insights</h1>
          <p className="text-sm text-muted-foreground">Financial analysis & gamification progress</p>
        </div>

        {/* Main Stats */}
        <div className="grid gap-4 mb-6">
          {/* Score & Level */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Score</p>
                  <p className="text-4xl font-bold text-primary">{profile.current_score}</p>
                  <p className="text-xs text-muted-foreground mt-2">/ 100</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Level</p>
                  <p className="text-4xl font-bold text-accent">{profile.current_level}</p>
                  <p className="text-xs text-muted-foreground mt-2">/ 5</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Total Savings */}
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground mb-1">Total Savings</p>
              <p className="text-3xl font-bold text-foreground">${profile.total_savings.toLocaleString()}</p>
            </CardContent>
          </Card>

          {/* Badges */}
          {profile.badges_earned.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Badges Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.badges_earned.map((badge, i) => (
                    <Badge key={i} className="bg-accent/20 text-accent hover:bg-accent/30">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Monthly Trend */}
          {savingsData.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Monthly Trend</CardTitle>
                <CardDescription className="text-xs">
                  Average monthly savings: ${avgSavings.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savingsData.slice(-6).map((data, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground w-20">{data.month}</span>
                      <div className="flex-1 mx-3 bg-secondary h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-accent h-full rounded-full"
                          style={{ width: `${Math.min((data.savings / avgSavings) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-foreground font-medium w-20 text-right">
                        ${data.savings.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Challenge */}
          <Card className="border-0 shadow-sm bg-accent/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Next Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{randomChallenge}</p>
              <p className="text-xs text-muted-foreground mt-3">Complete challenges to earn bonus points!</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Button className="w-full bg-primary hover:bg-primary/90" asChild>
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
