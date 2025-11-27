"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SetGoalPage() {
  const [goal, setGoal] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: err } = await supabase
        .from("profiles")
        .update({ monthly_goal: Number.parseInt(goal) })
        .eq("id", user.id)

      if (err) throw err
      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Set Your Monthly Goal</CardTitle>
            <CardDescription>Your journey begins with one choice.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveGoal}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="goal" className="text-sm">
                    Monthly Savings Goal ($)
                  </Label>
                  <Input
                    id="goal"
                    type="number"
                    min="1"
                    placeholder="Enter your target"
                    required
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="border-0 bg-secondary text-lg h-12"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Goal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
