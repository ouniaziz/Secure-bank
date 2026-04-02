"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Mail } from "lucide-react"

interface ConfirmationModalProps {
  amount: string
  beneficiary: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationModal({ amount, beneficiary, onConfirm, onCancel }: ConfirmationModalProps) {
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    setConfirmed(true)
    setTimeout(onConfirm, 1500)
  }

  if (confirmed) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Transfer Successful!</h2>
              <p className="text-muted-foreground mt-2">Your transfer has been processed</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold">${amount}</span>
              </div>
              <div className="flex justify-between">
                <span>To:</span>
                <span className="font-semibold">{beneficiary}</span>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-2">
              <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 dark:text-blue-100">
                Confirmation email sent to your registered email address
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Confirm Transfer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient:</span>
              <span className="font-semibold">{beneficiary}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-bold text-lg">${amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fee:</span>
              <span className="font-semibold">$2.50</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold text-lg text-destructive">
                ${(Number.parseFloat(amount) + 2.5).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="text-xs text-amber-900 dark:text-amber-100">
              Please review the transfer details carefully. This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleConfirm} className="flex-1">
              Confirm & Send
            </Button>
            <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
