"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/layout/sidebar"
import TopBar from "@/components/layout/top-bar"
import { ArrowLeft, Users, Check } from "lucide-react"

interface AddBeneficiaryPageProps {
  onNavigate: (page: string) => void
  onBack: () => void
}

export default function AddBeneficiaryPage({ onNavigate, onBack }: AddBeneficiaryPageProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    iban: "",
    bankType: "",
    email: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const bankTypes = [
    { value: "same-bank", label: "Same Bank" },
    { value: "national", label: "National Bank" },
    { value: "international", label: "International" },
  ]

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.iban.trim()) {
      newErrors.iban = "IBAN is required"
    } else if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(formData.iban)) {
      newErrors.iban = "Please enter a valid IBAN"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const fetchBeneficiaries = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return [];

    const res = await fetch("http://localhost:3001/beneficiaries", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return res.json();
  }
  
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setErrors((prev) => ({ ...prev, form: "You must be logged in" }));
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/beneficiaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          iban: formData.iban.trim(),
          bankType: formData.bankType,
          email: formData.email.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setErrors((prev) => ({
          ...prev,
          form: errorData.message || "Failed to add beneficiary",
        }));
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch {
      setErrors((prev) => ({
        ...prev,
        form: "Network error. Please try again.",
      }));
    }
  }
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()

  //   if (!validateForm()) return

  //   // Simulate saving
  //   setSubmitted(true)
  //   setTimeout(() => {
  //     onBack()
  //   }, 2000)
  // }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  if (submitted) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar currentPage="beneficiaries" onNavigate={onNavigate} onLogout={() => {}} />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Success!</h2>
                <p className="text-muted-foreground mt-2">Beneficiary added successfully</p>
                <p className="text-sm text-muted-foreground mt-1">{formData.fullName}</p>
              </div>
              <p className="text-sm text-muted-foreground">Redirecting...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="beneficiaries" onNavigate={onNavigate} onLogout={() => {}} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={null} onLogout={() => {}} />

        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 max-w-2xl">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <CardTitle>Add New Beneficiary</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium">
                      Full Name *
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                  </div>

                  {/* IBAN */}
                  <div className="space-y-2">
                    <label htmlFor="iban" className="text-sm font-medium">
                      IBAN *
                    </label>
                    <Input
                      id="iban"
                      name="iban"
                      placeholder="DE89370400440532013000"
                      value={formData.iban}
                      onChange={handleInputChange}
                      className={errors.iban ? "border-destructive" : ""}
                    />
                    {errors.iban && <p className="text-sm text-destructive">{errors.iban}</p>}
                    <p className="text-xs text-muted-foreground">International Bank Account Number</p>
                  </div>

                  {/* Bank Type */}
                  <div className="space-y-2">
                    <label htmlFor="bankType" className="text-sm font-medium">
                      Bank Type
                    </label>
                    <select
                      id="bankType"
                      name="bankType"
                      value={formData.bankType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
                    >
                      {bankTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="beneficiary@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  {/* Security Info */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      ✓ Your beneficiary information is encrypted and securely stored.
                    </p>
                  </div>

                  <Button type="submit" className="w-full">
                    Add Beneficiary
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
