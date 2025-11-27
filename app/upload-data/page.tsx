"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

interface SavingsEntry {
  month: string
  income: number
  expenses: number
  savings: number
}

export default function UploadDataPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedData, setUploadedData] = useState<SavingsEntry[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const text = await file.text()
      const data = JSON.parse(text) as SavingsEntry[]

      if (!Array.isArray(data)) {
        throw new Error("JSON must be an array")
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      let totalSavings = 0
      const insertData = data.map((entry) => {
        totalSavings += entry.savings || 0
        return {
          user_id: user.id,
          month: entry.month,
          income: entry.income || 0,
          expenses: entry.expenses || 0,
          savings: entry.savings || 0,
        }
      })

      // Calculate gamification metrics
      const score = Math.min(Math.round((totalSavings / 1000) * 10), 100)
      const level = Math.floor(score / 25)
      const badges = []

      if (totalSavings >= 1000) badges.push("First Saver")
      if (totalSavings >= 5000) badges.push("Savings Hero")
      if (score >= 50) badges.push("Level Master")

      // Insert savings data
      const { error: insertError } = await supabase.from("savings_data").insert(insertData)

      if (insertError) throw insertError

      // Update profile with totals
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          total_savings: totalSavings,
          current_score: score,
          current_level: level,
          badges_earned: badges,
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      setUploadedData(data)
      // Redirect to insights with success
      router.push("/insights")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to parse JSON")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-linear-to-b from-background to-secondary/20 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Savings Data</h1>
          <p className="text-sm text-muted-foreground">Import your monthly savings in JSON format</p>
        </div>

        <Card className="border-0 shadow-sm mb-6">
          <CardHeader className="pb-4">
            <CardTitle>Upload JSON File</CardTitle>
            <CardDescription>Supports a JSON array with income, expenses, savings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground mb-2">
                  {isLoading ? "Processing..." : "Click to select JSON file or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">Maximum file size: 5MB</p>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {uploadedData.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3">Uploaded Data Preview</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uploadedData.slice(0, 3).map((entry, i) => (
                      <div key={i} className="text-xs bg-secondary/50 rounded p-3">
                        <p className="font-medium">{entry.month}</p>
                        <p className="text-muted-foreground">
                          Income: ${entry.income}, Expenses: ${entry.expenses}, Savings: ${entry.savings}
                        </p>
                      </div>
                    ))}
                    {uploadedData.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        +{uploadedData.length - 3} more entries
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-xs font-medium mb-2">Example JSON Format:</p>
                <pre className="text-xs overflow-x-auto text-muted-foreground">
                  {`[
  {
    "month": "January",
    "income": 5000,
    "expenses": 3500,
    "savings": 1500
  },
  {
    "month": "February",
    "income": 5000,
    "expenses": 3200,
    "savings": 1800
  }
]`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          {uploadedData.length > 0 && (
            <Button className="w-full bg-primary hover:bg-primary/90" asChild>
              <Link href="/insights">View Insights</Link>
            </Button>
          )}
          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/dashboard">Back</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
