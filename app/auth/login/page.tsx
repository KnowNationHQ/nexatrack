"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0715]">
      <Card className="w-full max-w-md mx-auto px-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Nexatrack <span className="text-[#FF3E41]">Admin</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-[#FF3E41] hover:bg-[#d92e31]"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[#FF3E41] hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
