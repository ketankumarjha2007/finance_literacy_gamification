import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold text-primary mb-4">Level Up Your Money Habits</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Master financial literacy through gamification. Track savings, earn badges, and climb levels.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/auth/login" asChild>
            <Button className="bg-primary hover:bg-primary/90">Login</Button>
          </Link>
          <Link href="/auth/sign-up" asChild>
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
