"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield } from "lucide-react"

interface OTPModalProps {
  email: string
  onVerify: (otp: string) => void
  onClose: () => void
}

export default function OTPModal({ email, onVerify, onClose }: OTPModalProps) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")

  const handleVerify = () => {
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      onVerify(otp)
    } else {
      setError("Please enter a valid 6-digit OTP")
    }
  }

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3")

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle>Verify Your Identity</CardTitle>
          <p className="text-sm text-muted-foreground">We sent a code to {maskedEmail}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter OTP Code</label>
            <Input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                setError("")
              }}
              maxLength={6}
              className="text-center text-2xl tracking-widest font-mono"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">Test OTP: 123456</p>
          </div>

          <Button onClick={handleVerify} className="w-full">
            Verify OTP
          </Button>

          <button onClick={onClose} className="w-full text-sm text-muted-foreground hover:text-foreground transition">
            Cancel
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
