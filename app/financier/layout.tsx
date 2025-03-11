import type React from "react"
import { Navbar } from "@/components/navbar"

export default function FinancierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userType="financier" />
      <main className="container mx-auto py-8 px-4">{children}</main>
    </div>
  )
}

