import type React from "react"
import { Navbar } from "@/components/navbar"

export default function BorrowerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userType="borrower" />
      <main className="container mx-auto py-8 px-4">{children}</main>
    </div>
  )
}

