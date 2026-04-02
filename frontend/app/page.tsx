"use client"

import { useState } from "react"
import LoginPage from "@/components/pages/login-page"
import DashboardPage from "@/components/pages/dashboard-page"
import AddBeneficiaryPage from "@/components/pages/add-beneficiary-page"
import TransferPage from "@/components/pages/transfer-page"
import TransactionHistoryPage from "@/components/pages/transaction-history-page"
import SettingsPage from "@/components/pages/settings-page"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SidebarProvider } from "@/components/context/sidebar-context"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState("login")
  const [user, setUser] = useState(null)

  const handleLogin = (userData: any) => {
    setUser(userData)
    setIsAuthenticated(true)
    setCurrentPage("dashboard")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentPage("login")
    setUser(null)
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-background text-foreground">
          {!isAuthenticated ? (
            <LoginPage onLogin={handleLogin} />
          ) : (
            <>
              {currentPage === "dashboard" && (
                <DashboardPage user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
              )}
              {currentPage === "add-beneficiary" && (
                <AddBeneficiaryPage onNavigate={handleNavigate} onBack={() => setCurrentPage("dashboard")} />
              )}
              {currentPage === "transfer" && (
                <TransferPage onNavigate={handleNavigate} onBack={() => setCurrentPage("dashboard")} />
              )}
              {currentPage === "transactions" && (
                <TransactionHistoryPage onNavigate={handleNavigate} onBack={() => setCurrentPage("dashboard")} />
              )}
              {currentPage === "settings" && (
                <SettingsPage user={user} onNavigate={handleNavigate} onBack={() => setCurrentPage("dashboard")} />
              )}
            </>
          )}
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}
