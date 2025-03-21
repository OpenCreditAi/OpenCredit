"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, User, LogOut, Settings, UserCircle, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NavbarProps {
  userType: "borrower" | "financier"
}

export function Navbar({ userType }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems =
    userType === "borrower"
      ? [
          { name: "לוח מחוונים", href: "/borrower/dashboard", icon: "dashboard" },
          { name: "בקשה חדשה", href: "/borrower/new-request", icon: "new" },
        ]
      : [
          { name: "לוח מחוונים", href: "/financier/dashboard", icon: "dashboard" },
          { name: "חיפוש בקשות", href: "/financier/marketplace", icon: "search" },
          { name: "בקשות בטיפול", href: "/financier/in-process", icon: "process" },
        ]

  return (
    <nav className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? "shadow-md py-2" : "py-4"}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href={`/${userType}/dashboard`} className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold text-xl mr-4">
                OC
              </div>
              <span className="text-xl font-bold text-purple-800 hidden sm:inline-block">OpenCredit</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    isActive
                      ? "bg-purple-100 text-purple-800 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-purple-700"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>התראות</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="p-3 hover:bg-gray-50 border-b">
                    <p className="font-medium text-sm">בקשת הלוואה חדשה התקבלה</p>
                    <p className="text-xs text-gray-500">לפני 5 דקות</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 border-b">
                    <p className="font-medium text-sm">מסמך חדש הועלה לבקשה #1002</p>
                    <p className="text-xs text-gray-500">לפני שעה</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50">
                    <p className="font-medium text-sm">הצעת מימון התקבלה</p>
                    <p className="text-xs text-gray-500">לפני 3 שעות</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <Button variant="ghost" size="sm" className="w-full text-purple-600">
                    צפה בכל ההתראות
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback className="bg-purple-100 text-purple-800">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start p-2">
                  <div className="flex-shrink-0 ml-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                      <AvatarFallback className="bg-purple-100 text-purple-800">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="text-sm font-medium">ישראל ישראלי</p>
                    <p className="text-xs text-gray-500">israel@example.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center">
                  <UserCircle className="ml-2 h-4 w-4" />
                  <Link href="/profile" className="w-full">
                    פרופיל
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <Settings className="ml-2 h-4 w-4" />
                  <Link href="/settings" className="w-full">
                    הגדרות
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center text-red-600">
                  <LogOut className="ml-2 h-4 w-4" />
                  <Link href="/" className="w-full">
                    התנתק
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="focus:outline-none">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t pt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-2 px-4 rounded-md ${
                    isActive ? "bg-purple-100 text-purple-800 font-semibold" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            })}
            <div className="border-t mt-4 pt-4">
              <Link
                href="/profile"
                className="block py-2 px-4 rounded-md text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                פרופיל
              </Link>
              <Link
                href="/settings"
                className="block py-2 px-4 rounded-md text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                הגדרות
              </Link>
              <Link
                href="/"
                className="block py-2 px-4 rounded-md text-red-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                התנתק
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

