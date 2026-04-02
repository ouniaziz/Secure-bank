"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Send,
  Users,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useSidebar } from "@/components/context/sidebar-context"
import { useTheme } from "@/components/providers/theme-provider"

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export default function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { isCollapsed, toggleCollapsed } = useSidebar()
  const { theme } = useTheme()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "add-beneficiary", label: "Add Beneficiary", icon: Users },
    { id: "transfer", label: "Transfer", icon: Send },
    { id: "transactions", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleNavigate = (id: string) => {
    onNavigate(id)
    setIsOpen(false)
  }

  const sidebarBgClass = theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
  const textClass = theme === "dark" ? "text-slate-100" : "text-slate-900"
  const hoverClass = theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
  const activeBgClass = theme === "dark" ? "bg-blue-600" : "bg-blue-500"
  const activeFgClass = "text-white"
  const logoClass = theme === "dark" ? "text-blue-400" : "text-blue-600"

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-500 text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Collapse Button */}
      <button
        onClick={toggleCollapsed}
        className={`hidden md:flex absolute top-4 right-0 transform translate-x-1/2 z-40 p-2 rounded-full border transition-colors ${
          theme === "dark"
            ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
            : "bg-white border-slate-300 hover:bg-slate-100 text-slate-700"
        }`}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static w-64 h-screen ${sidebarBgClass} border-r transition-all duration-300 transform md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-40 ${isCollapsed ? "md:w-20" : "md:w-64"}`}
      >
        <div className="p-6 space-y-8 h-full flex flex-col">
          {/* Logo */}
          <div className="pt-8 md:pt-0">
            {isCollapsed ? (
              <div className={`text-2xl font-bold ${logoClass} text-center`}>S</div>
            ) : (
              <h1 className={`text-2xl font-bold ${logoClass}`}>SecureBank</h1>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive ? `${activeBgClass} ${activeFgClass}` : `${textClass} ${hoverClass}`
                  } ${isCollapsed ? "md:justify-center md:px-2" : ""}`}
                  title={isCollapsed ? item.label : ""}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <div className={`pt-4 border-t ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`}>
            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${textClass} ${hoverClass} ${
                isCollapsed ? "md:justify-center md:px-2" : ""
              }`}
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
