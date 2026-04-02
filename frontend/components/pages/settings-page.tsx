"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/layout/sidebar"
import TopBar from "@/components/layout/top-bar"
import { ArrowLeft, Settings, Check } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"

interface SettingsPageProps {
  user: any;
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export default function SettingsPage({ user, onNavigate, onBack }: SettingsPageProps) {
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) 123-4567")
  const [email, setEmail] = useState(user?.email || "")
  const [phoneEditing, setPhoneEditing] = useState(false)
  const [emailEditing, setEmailEditing] = useState(false)
  const [savedField, setSavedField] = useState("")
  const { theme, toggleTheme } = useTheme()

  const handlePhoneSave = () => {
    setSavedField("phone")
    setPhoneEditing(false)
    setTimeout(() => setSavedField(""), 2000)
  }

  const handleEmailSave = () => {
    setSavedField("email")
    setEmailEditing(false)
    setTimeout(() => setSavedField(""), 2000)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="settings" onNavigate={onNavigate} onLogout={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} onLogout={() => {}} />

        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 max-w-2xl">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {/* Profile Settings */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  <CardTitle>Account Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Phone Number */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Phone Number</label>
                  {phoneEditing ? (
                    <div className="flex gap-2">
                      <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                      />
                      <Button onClick={handlePhoneSave} size="sm">
                        Save
                      </Button>
                      <Button onClick={() => setPhoneEditing(false)} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <p className="font-mono">{phoneNumber}</p>
                      <div className="flex items-center gap-2">
                        {savedField === "phone" && <Check className="w-4 h-4 text-green-600" />}
                        <button onClick={() => setPhoneEditing(true)} className="text-sm text-primary hover:underline">
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Email Address</label>
                  {emailEditing ? (
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                      />
                      <Button onClick={handleEmailSave} size="sm">
                        Save
                      </Button>
                      <Button onClick={() => setEmailEditing(false)} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <p className="font-mono text-sm">{email}</p>
                      <div className="flex items-center gap-2">
                        {savedField === "email" && <Check className="w-4 h-4 text-green-600" />}
                        <button onClick={() => setEmailEditing(true)} className="text-sm text-primary hover:underline">
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {theme === "dark" ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
                  >
                    Toggle
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
