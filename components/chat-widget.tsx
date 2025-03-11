"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, ChevronDown, ChevronUp } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "borrower"
  timestamp: Date
}

interface ChatWidgetProps {
  borrowerName: string
  borrowerId: string
  initialMessages?: Message[]
}

export function ChatWidget({ borrowerName, borrowerId, initialMessages = [] }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isMinimized])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isMinimized) setIsMinimized(false)
  }

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(!isMinimized)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages([...messages, newMessage])
      setMessage("")

      // Simulate response (in a real app, this would be an API call)
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: "תודה על ההודעה. אני אבדוק את זה ואחזור אליך בהקדם.",
          sender: "borrower",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, response])
      }, 1000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Chat Button */}
      <Button
        onClick={toggleChat}
        className={`rounded-full p-3 h-14 w-14 shadow-lg ${isOpen ? "bg-red-500 hover:bg-red-600" : "bg-purple-700 hover:bg-purple-800"}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="absolute bottom-16 left-0 w-80 md:w-96 shadow-xl">
          <CardHeader
            className="py-3 px-4 flex flex-row items-center justify-between bg-purple-700 text-white rounded-t-lg cursor-pointer"
            onClick={toggleMinimize}
          >
            <CardTitle className="text-sm font-medium">שיחה עם {borrowerName}</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={toggleMinimize}>
              {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      אין הודעות. התחל שיחה חדשה.
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`mb-3 max-w-[80%] ${msg.sender === "user" ? "mr-auto" : "ml-auto"}`}>
                        <div
                          className={`p-3 rounded-lg ${
                            msg.sender === "user"
                              ? "bg-purple-600 text-white rounded-bl-none"
                              : "bg-gray-200 text-gray-800 rounded-br-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div
                          className={`text-xs mt-1 text-gray-500 ${msg.sender === "user" ? "text-left" : "text-right"}`}
                        >
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t flex">
                  <Input
                    type="text"
                    placeholder="הקלד הודעה..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="ml-2 mr-0"
                  />
                  <Button type="submit" size="icon" className="bg-purple-700 hover:bg-purple-800">
                    <Send size={18} />
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      )}
    </div>
  )
}

