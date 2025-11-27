"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditGoalPage() {
  const [goal, setGoal] = useState("")
  const [currentGoal, setCurrentGoal] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadGoal = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")

        const { data } = await supabase.from("profiles").select("monthly_goal").eq("id", user.id).single()

        if (data?.monthly_goal) {
          setCurrentGoal(data.monthly_goal)
          setGoal(data.monthly_goal.toString())
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    loadGoal()
  }, [supabase])

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
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
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-sm">
          <form onSubmit={handleSaveGoal} className="flex flex-col">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Update Monthly Goal</CardTitle>
              <CardDescription>Current goal: ${currentGoal?.toLocaleString() || "Not set"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="goal" className="text-sm">
                    New Monthly Goal ($)
                  </Label>
                  <Input
                    id="goal"
                    type="number"
                    min="1"
                    placeholder="Enter your new target"
                    required
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="border-0 bg-secondary text-lg h-12"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex gap-3 pt-0">
              <Button type="button" variant="outline" onClick={() => router.back()} className="w-full">
                Cancel
              </Button>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSaving}>
                {isSaving ? "Saving..." : "Update"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
