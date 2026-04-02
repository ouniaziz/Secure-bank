"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/layout/sidebar"
import TopBar from "@/components/layout/top-bar"
import ConfirmationModal from "@/components/modals/confirmation-modal"
import { ArrowLeft, Send } from "lucide-react"
import mockBeneficiaries from "@/mock/beneficiaries.json"

interface TransferPageProps {
  onNavigate: (page: string) => void
  onBack: () => void
}

export default function TransferPage({ onNavigate, onBack }: TransferPageProps) {
  const [formData, setFormData] = useState({
    beneficiary: "",
    amount: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Load beneficiaries for the logged-in user
  const [beneficiaries, setBeneficiaries] = useState<Array<{ id: string; name: string; iban: string }>>([])
  const [isLoadingBeneficiaries, setIsLoadingBeneficiaries] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}


    if (!formData.beneficiary) {
      newErrors.beneficiary = "Please select a beneficiary"
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(Number.parseFloat(formData.amount)) || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setShowConfirmation(true)
    }
  }

  // const handleConfirm = () => {
  //   setShowConfirmation(false)
  //   // Simulate successful transfer
  //   setTimeout(() => {
  //     onBack()
  //   }, 1500)
  // }
  const handleConfirm = async () => {
    setShowConfirmation(false);

    const token = localStorage.getItem("accessToken"); // stored on login

    if (!token) {
      alert("You must be logged in to make a transfer");
      return;
    }
    

    try {
      const response = await fetch("http://localhost:3001/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          beneficiaryId: formData.beneficiary,
          // Send as number string to satisfy backend schema
          amount: formData.amount.trim(),
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Transfer failed!");
        return;
      }

      alert("Transfer completed successfully!");
      onBack(); // navigate to previous page (dashboard)
    } catch (error) {
      console.error(error);
      alert("An error occurred while processing transfer");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  useEffect(() => {
    const loadBeneficiaries = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setBeneficiaries([])
        return
      }
      setIsLoadingBeneficiaries(true)
      try {
        const res = await fetch("http://localhost:3001/beneficiaries", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch beneficiaries")
        const data = await res.json()
        // Expecting array of { id, fullName/name, iban }
        const normalized = (Array.isArray(data) ? data : []).map((b: any) => ({
          id: String(b.id),
          name: String(b.fullName ?? b.name ?? ""),
          iban: String(b.iban ?? ""),
        }))
        setBeneficiaries(normalized)
        // If current selected beneficiary is not in list, clear selection
        const exists = normalized.some((b) => b.id === formData.beneficiary)
        if (!exists) {
          setFormData((prev) => ({ ...prev, beneficiary: "" }))
        }
      } catch {
        setBeneficiaries([])
      } finally {
        setIsLoadingBeneficiaries(false)
      }
    }
    loadBeneficiaries()
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="transfer" onNavigate={onNavigate} onLogout={() => {}} />

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
                  <Send className="w-5 h-5" />
                  <CardTitle>Transfer Money</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Beneficiary Selection */}
                  <div className="space-y-2">
                    <label htmlFor="beneficiary" className="text-sm font-medium">
                      Select Beneficiary *
                    </label>
                    <select
                      id="beneficiary"
                      name="beneficiary"
                      value={formData.beneficiary}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-md border bg-background text-foreground ${
                        errors.beneficiary ? "border-destructive" : "border-input"
                      }`}
                      disabled={isLoadingBeneficiaries}
                    >
                      <option value="">{isLoadingBeneficiaries ? "Loading..." : "Choose a beneficiary..."}</option>
                      {beneficiaries.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} - {b.iban}
                        </option>
                      ))}
                    </select>
                    {errors.beneficiary && <p className="text-sm text-destructive">{errors.beneficiary}</p>}
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                      Amount (USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className={`pl-8 ${errors.amount ? "border-destructive" : ""}`}
                      />
                    </div>
                    {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Transfer purpose..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground resize-none"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">Max 100 characters</p>
                  </div>

                  {/* Fee Info */}
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-1">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Transfer Fee</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      $2.50 will be deducted for this transfer
                    </p>
                  </div>

                  <Button type="submit" className="w-full">
                    Review Transfer
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <ConfirmationModal
          amount={formData.amount}
          beneficiary={beneficiaries.find((b) => b.id === formData.beneficiary)?.name || ""}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  )
}
