"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

interface DocumentItemProps {
  name: string
  status: "uploaded" | "missing"
  userType: "borrower" | "financier"
  onView?: () => void
  onReplace?: () => void
  onAdd?: () => void
  onRequest?: () => void
}

export function DocumentItem({ name, status, userType, onView, onReplace, onAdd, onRequest }: DocumentItemProps) {
  const handleAction = (action: () => void | undefined) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (action) action()
  }

  const handleReplaceDocument = (e: React.MouseEvent) => {
    e.preventDefault()

    // Create a file input and trigger it
    const input = document.createElement("input")
    input.type = "file"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log(`Selected file: ${file.name} for document: ${name}`)
        // Here you would handle the file upload
        alert(`המסמך "${name}" הוחלף בהצלחה עם הקובץ "${file.name}"`)
        if (onReplace) onReplace()
      }
    }
    input.click()
  }

  const handleAddDocument = (e: React.MouseEvent) => {
    e.preventDefault()

    // Create a file input and trigger it
    const input = document.createElement("input")
    input.type = "file"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log(`Selected file: ${file.name} for document: ${name}`)
        // Here you would handle the file upload
        alert(`המסמך "${name}" הועלה בהצלחה: "${file.name}"`)
        if (onAdd) onAdd()
      }
    }
    input.click()
  }

  return (
    <div className="flex justify-between items-center p-2 border-b">
      <div className="flex gap-2 justify-end">
        {status === "uploaded" ? (
          <>
            <Button variant="outline" size="sm" onClick={handleAction(onView)}>
              הצג מסמך
            </Button>
            {userType === "borrower" && (
              <Button
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-600 hover:bg-purple-50"
                onClick={handleReplaceDocument}
              >
                החלף מסמך
              </Button>
            )}
          </>
        ) : userType === "borrower" ? (
          <Button variant="outline" size="sm" className="text-blue-600" onClick={handleAddDocument}>
            הוסף מסמך
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="text-red-600" onClick={handleAction(onRequest)}>
            דרוש מסמך
          </Button>
        )}
      </div>

      <div className="text-right">
        <h3 className="font-semibold text-gray-700">{name}</h3>
        <span className={`text-xs ${status === "uploaded" ? "text-green-600" : "text-red-600"}`}>
          {status === "uploaded" ? "הועלה" : "חסר"}
        </span>
      </div>
    </div>
  )
}

