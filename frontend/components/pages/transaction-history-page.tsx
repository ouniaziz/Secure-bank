"use client"

import { useState, useEffect, useMemo, useDeferredValue } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from "@/components/layout/sidebar"
import TopBar from "@/components/layout/top-bar"
import { ArrowLeft, Send, Download } from "lucide-react"
import mockTransactions from "@/mock/transactions.json"

interface TransactionHistoryPageProps {
  onNavigate: (page: string) => void
  onBack: () => void
}

export default function TransactionHistoryPage({ onBack,onNavigate }: TransactionHistoryPageProps) {
  const [filterType, setFilterType] = useState("all")
  const [filterDate, setFilterDate] = useState("")
  const [transactions, setTransactions] = useState<Array<{
    id: string
    recipient: string
    date: string // YYYY-MM-DD
    type: "sent" | "received"
    amount: number
    status?: string
    description?: string
  }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Pagination state
  const [page, setPage] = useState(1)
  const pageSize = 5
  // Search state (debounced)
  const [searchQuery, setSearchQuery] = useState("")
  const deferredSearch = useDeferredValue(searchQuery)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) {
          setError("You must be logged in")
          setLoading(false)
          return
        }

        const res = await fetch("http://localhost:3001/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          const t = await res.text().catch(() => "")
          throw new Error(`Failed to fetch transactions: ${res.status} ${t}`)
        }
        const data = await res.json()

        const normDate = (d: any) => {
          const dt = new Date(d)
          if (Number.isNaN(dt.getTime())) return ""
          return dt.toISOString().slice(0, 10) // YYYY-MM-DD
        }

        const normalized = (Array.isArray(data) ? data : []).map((t: any, i: number) => {
          const dir = String(t.type ?? t.direction ?? "").toLowerCase()
          const amountStr = String(t.amount ?? t.value ?? "0")
          const amtNum = Number(amountStr.replace(/[^\d.-]/g, "")) || 0
          const type: "sent" | "received" =
            dir.includes("send") || dir.includes("sent") || dir.includes("debit") ? "sent" : "received"

          return {
            id: String(t.id ?? t._id ?? `${t.recipient ?? "tx"}-${t.createdAt ?? t.date ?? i}`),
            recipient: String(t.recipient ?? t.beneficiaryName ?? t.toName ?? t.to ?? "Unknown"),
            date: String(t.date ?? t.createdAt ? normDate(t.date ?? t.createdAt) : normDate(Date.now())),
            type,
            amount: amtNum,
            status: String(t.status ?? "Completed"),
            description: String(t.description ?? ""),
          }
        })

        setTransactions(normalized)
      } catch (e: any) {
        console.error(e)
        setError(e.message || "Failed to load transactions")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Reset to first page when filters or search change
  useEffect(() => {
    setPage(1)
  }, [filterType, filterDate, searchQuery])

  const filteredTransactions = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase()
    return transactions.filter((tx) => {
      if (filterType !== "all" && tx.type !== filterType) return false
      if (filterDate && tx.date !== filterDate) return false
      if (q) {
        const haystack = [
          tx.recipient,
          tx.description ?? "",
          tx.status ?? "",
          tx.id,
          tx.date,
          tx.amount.toFixed(2),
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [transactions, filterType, filterDate, deferredSearch])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize))

  // Clamp page if totalPages shrinks
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages, page])

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredTransactions.slice(start, start + pageSize)
  }, [filteredTransactions, page, pageSize])

  // Windowed pagination with ellipses
  const getPaginationRange = (currentPage: number, total: number, siblingCount = 1): (number | string)[] => {
    const totalPageNumbers = siblingCount * 2 + 5
    if (total <= totalPageNumbers) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, total)

    const showLeftEllipsis = leftSiblingIndex > 2
    const showRightEllipsis = rightSiblingIndex < total - 1

    const range: (number | string)[] = [1]
    if (showLeftEllipsis) range.push("...")
    const start = showLeftEllipsis ? leftSiblingIndex : 2
    const end = showRightEllipsis ? rightSiblingIndex : total - 1
    for (let i = start; i <= end; i++) range.push(i)
    if (showRightEllipsis) range.push("...")
    range.push(total)
    return range
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="transactions" onNavigate={onNavigate} onLogout={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={null} onLogout={() => {}} />

        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 max-w-5xl">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Transaction History</CardTitle>
                  <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Filter by Type</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background"
                    >
                      <option value="all">All Transactions</option>
                      <option value="sent">Sent</option>
                      <option value="received">Received</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Filter by Date</label>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Search</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Recipient, description, status..."
                      className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background"
                    />
                  </div>
                </div>

                {loading && <p className="text-sm text-muted-foreground">Loading transactions…</p>}
                {error && <p className="text-sm text-destructive">{error}</p>}

                {/* Transactions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold">Recipient</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold">Type</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/50 transition">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Send className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{tx.recipient}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm">{tx.date}</td>
                          <td className="py-4 px-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                tx.type === "sent"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-green-500/10 text-green-600"
                              }`}
                            >
                              {tx.type === "sent" ? "Sent" : "Received"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-semibold">
                            <span className={tx.type === "sent" ? "text-destructive" : "text-green-600"}>
                              {tx.type === "sent" ? "-" : "+"}
                              {tx.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-600">
                              {tx.status ?? "Completed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No transactions found</div>
                )}

                {/* Pagination */}
                {filteredTransactions.length > 0 && (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4">
                    <div className="text-xs text-muted-foreground">
                      Showing {(page - 1) * pageSize + 1}–
                      {Math.min(page * pageSize, filteredTransactions.length)} of {filteredTransactions.length}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        className="px-3 h-8 rounded border border-input text-sm disabled:opacity-50"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </button>

                      {getPaginationRange(page, totalPages, 1).map((p, idx) =>
                        typeof p === "number" ? (
                          <button
                            key={`${p}-${idx}`}
                            onClick={() => setPage(p)}
                            className={`h-8 w-8 rounded text-sm ${
                              p === page ? "bg-primary text-primary-foreground" : "border border-input"
                            }`}
                          >
                            {p}
                          </button>
                        ) : (
                          <span key={`dots-${idx}`} className="px-2 text-sm text-muted-foreground">
                            …
                          </span>
                        )
                      )}

                      <button
                        className="px-3 h-8 rounded border border-input text-sm disabled:opacity-50"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
