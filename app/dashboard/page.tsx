"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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

  return (
    <div className="min-h-svh bg-linear-to-b from-background to-secondary/20 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Track your financial progress</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-xs bg-transparent">
            Logout
          </Button>
        </div>

        {/* Main Stats */}
        <div className="grid gap-4 mb-6">
          {/* Progress Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Monthly Progress</CardTitle>
              <CardDescription>
                ${profile.total_savings.toLocaleString()} of ${profile.monthly_goal?.toLocaleString() || 0} saved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-xs text-muted-foreground mt-3">{progressPercentage.toFixed(0)}% to goal</p>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Current Level</p>
                  <p className="text-3xl font-bold text-accent">{profile.current_level}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Score</p>
                  <p className="text-3xl font-bold text-primary">{profile.current_score}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Badges */}
          {profile.badges_earned.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Badges Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.badges_earned.map((badge, i) => (
                    <Badge key={i} variant="secondary" className="bg-accent/20 text-accent">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/edit-goal">Edit Goal</Link>
          </Button>
          <Button className="w-full bg-primary hover:bg-primary/90" asChild>
            <Link href="/upload-data">Upload Data</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
