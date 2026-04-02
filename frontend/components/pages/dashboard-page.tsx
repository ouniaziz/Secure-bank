"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from "@/components/layout/sidebar"
import TopBar from "@/components/layout/top-bar"
import QuickActionCard from "@/components/ui/quick-action-card"
import { Send, Users, History, Settings } from "lucide-react"

interface DashboardPageProps {
  user: any
  onNavigate: (page: string) => void
  onLogout: () => void
}

export default function DashboardPage({ user, onNavigate, onLogout }: DashboardPageProps) {
  const [showBalance, setShowBalance] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(user ?? null)
  const [account, setAccount] = useState<{
    balance: number
    accountNumber: string
    currency: string
    accountType: string
    createdAt: string
    updatedAt: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Array<{
    id: string
    recipient: string
    date: string
    type: "sent" | "received"
    amount: number
    status?: string
  }>>([])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) {
          setError("You must be logged in")
          setLoading(false)
          return
        }

        const res = await fetch("http://localhost:3001/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          const t = await res.text()
          throw new Error(`Failed to fetch user: ${res.status} ${t}`)
        }
        const data = await res.json()
        const u = data?.user ?? data
        setCurrentUser(u)
        setAccount({
          balance: Number(u.balance ?? 0),
          accountNumber: String(u.accountNumber ?? "N/A"),
          currency: String(u.currency ?? "—"),
          accountType: String(u.accountType ?? "—"),
          createdAt: String(u.createdAt ?? u.created_at ?? ""),
          updatedAt: String(u.updatedAt ?? u.updated_at ?? ""),
        })

        // Fetch transactions
        const txRes = await fetch("http://localhost:3001/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!txRes.ok) {
          const t = await txRes.text().catch(() => "")
          throw new Error(`Failed to fetch transactions: ${txRes.status} ${t}`)
        }
        const txData = await txRes.json()
        const normalized = (Array.isArray(txData) ? txData : []).map((t: any, i: number) => {
          const dir = String(t.type ?? "").toLowerCase()
          const amountStr = String(t.amount ?? "0")
          const amtNum = Number(amountStr.replace(/[^\d.-]/g, "")) || 0
          const type: "sent" | "received" = dir.includes("sent") ? "sent" : "received"
          return {
            id: String(t.id ?? i),
            recipient: String(t.recipient ?? "Unknown"),
            date: String(t.date ?? new Date().toISOString().slice(0, 10)),
            type,
            amount: amtNum,
            status: String(t.status ?? "completed"),
          }
        })
        // Keep the latest 3 items (sorted by date desc)
        const latest = normalized
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)
        setRecentTransactions(latest)
      } catch (e: any) {
        console.error(e)
        setError(e.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={currentUser} onLogout={onLogout} />

        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 space-y-6">
            {/* Account Overview Card */}
            <Card className="bg-gradient-to-r from-primary to-primary/80 border-0 text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Total Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading && <p className="text-sm opacity-90">Loading account...</p>}
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold tracking-tight">
                      {showBalance
                        ? account
                          ? `${account.currency} ${account.balance.toLocaleString()}`
                          : "—"
                        : "••••••"}
                    </p>
                    <p className="text-sm opacity-90 mt-1">Account Balance</p>
                  </div>
                  <button onClick={() => setShowBalance(!showBalance)} className="text-sm hover:opacity-80 transition">
                    {showBalance ? "👁️ Hide" : "👁️ Show"}
                  </button>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="opacity-75">Account Number</p>
                    <p className="font-mono">{account?.accountNumber ?? "N/A"}</p>
                  </div>
                  <div>
                    <p className="opacity-75">Account Type</p>
                    <p>{account?.accountType ?? "—"}</p>
                  </div>
                  <div>
                    <p className="opacity-75">Currency</p>
                    <p>{account?.currency ?? "—"}</p>
                  </div>
                </div>
                <div className="flex gap-6 text-xs opacity-90">
                  <div>
                    <p className="opacity-75">Created</p>
                    <p>{account?.createdAt ? new Date(account.createdAt).toLocaleString() : "—"}</p>
                  </div>
                  <div>
                    <p className="opacity-75">Updated</p>
                    <p>{account?.updatedAt ? new Date(account.updatedAt).toLocaleString() : "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionCard
                  icon={Send}
                  title="Transfer"
                  description="Send money"
                  onClick={() => onNavigate("transfer")}
                />
                <QuickActionCard
                  icon={Users}
                  title="Beneficiary"
                  description="Add recipient"
                  onClick={() => onNavigate("add-beneficiary")}
                />
                <QuickActionCard
                  icon={History}
                  title="History"
                  description="View transactions"
                  onClick={() => onNavigate("transactions")}
                />
                <QuickActionCard
                  icon={Settings}
                  title="Settings"
                  description="Account settings"
                  onClick={() => onNavigate("settings")}
                />
              </div>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Transactions</CardTitle>
                  <button onClick={() => onNavigate("transactions")} className="text-sm text-primary hover:underline">
                    View all
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {recentTransactions.length === 0 && (
                  <p className="text-sm text-muted-foreground">No recent transactions.</p>
                )}
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Send className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{tx.recipient}</p>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <p className={`font-semibold ${tx.type === "sent" ? "text-destructive" : "text-green-600"}`}>
                        {tx.type === "sent" ? "-" : "+"}
                        {tx.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔒</div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 dark:text-green-100">Secure Connection Active</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your connection is encrypted with industry-leading 256-bit SSL/TLS protocols.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
