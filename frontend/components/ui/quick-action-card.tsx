"use client"

import type { LucideIcon } from "lucide-react"

interface QuickActionCardProps {
  icon: LucideIcon
  title: string
  description: string
  onClick: () => void
}

export default function QuickActionCard({ icon: Icon, title, description, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="p-6 rounded-lg border border-border bg-card hover:bg-muted transition text-left group"
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </button>
  )
}
