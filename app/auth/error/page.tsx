"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
            <CardDescription>Something went wrong during authentication</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Please try again or contact support if the problem persists.
            </p>
            <div className="flex gap-3">
              <Link href="/" asChild>
                <Button variant="outline" className="w-full bg-transparent">
                  Home
                </Button>
              </Link>
              <Link href="/auth/login" asChild>
                <Button className="w-full bg-primary hover:bg-primary/90">Login</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
