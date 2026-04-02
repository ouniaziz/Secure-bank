"use client"

interface PasswordStrengthIndicatorProps {
  password: string
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const calculateStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength++
    if (pwd.length >= 12) strength++
    if (/[a-z]/.test(pwd)) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/\d/.test(pwd)) strength++
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) strength++
    return Math.min(strength, 4)
  }

  const strength = calculateStrength(password)
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i < strength ? strengthColors[strength - 1] : "bg-muted"}`}
          />
        ))}
      </div>
      <p
        className={`text-xs font-medium ${
          strength <= 1 ? "text-destructive" : strength === 2 ? "text-yellow-600" : "text-green-600"
        }`}
      >
        Password Strength: {strengthLabels[strength - 1]}
      </p>
    </div>
  )
}
