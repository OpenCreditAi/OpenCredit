'use client'

import { Navbar } from '@/components/navbar'
import { useUserStore } from '@/stores/userStore'
import type React from 'react'

export default function FinancierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUserStore()

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar userType='financier' />
      {user && <main className='container mx-auto py-8 px-4'>{children}</main>}
    </div>
  )
}
