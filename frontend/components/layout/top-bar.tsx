"use client"

import { Bell, User, LogOut, Moon, Sun, Menu } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"
import { useSidebar } from "@/components/context/sidebar-context"

interface TopBarProps {
  user: any
  onLogout: () => void
}

export default function TopBar({ user, onLogout }: TopBarProps) {
  const { theme, toggleTheme } = useTheme()
  const { isCollapsed, toggleCollapsed } = useSidebar()

  return (
    <header
      className={`border-b ${theme === "dark" ? "border-slate-800 bg-slate-800" : "border-slate-200 bg-white"} px-4 md:px-8 py-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleCollapsed}
            className={`hidden md:flex p-2 rounded-lg transition ${
              theme === "dark" ? "hover:bg-slate-700 text-slate-200" : "hover:bg-slate-100 text-slate-700"
            }`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-semibold">Welcome, {user?.name || "User"}</h2>
            <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
              Last login: Today at 2:30 PM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition ${
              theme === "dark" ? "hover:bg-slate-700 text-yellow-400" : "hover:bg-slate-100 text-slate-700"
            }`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            className={`p-2 rounded-lg transition ${theme === "dark" ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            className={`p-2 rounded-lg transition ${theme === "dark" ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}
          >
            <User className="w-5 h-5" />
          </button>
          <button
            onClick={onLogout}
            className={`p-2 rounded-lg transition ${theme === "dark" ? "hover:bg-slate-700 text-red-400" : "hover:bg-slate-100 text-red-600"}`}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
