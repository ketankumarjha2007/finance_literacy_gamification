import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-sm">
        <Card className="border-0 shadow-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl">✓</div>
            </div>
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription className="text-sm">
              We&apos;ve sent a confirmation link to your email address. Click it to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Once confirmed, you&apos;ll be ready to set your financial goals and start learning.
            </p>
            <Link href="/auth/login" asChild>
              <Button className="w-full bg-primary hover:bg-primary/90">Return to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
