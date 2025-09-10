"use client";

import type React from "react";
import { use, useEffect, useRef, useState } from "react";
import axios from "axios";

import { getLoan } from "@/app/api/loans/getLoan";
import { Loan } from "@/app/api/loans/types";

import { DocumentItem } from "@/components/document-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send } from "lucide-react";

// ---- Helpers: map logical color -> safe Tailwind classes (no dynamic strings) ----
const pillClasses = (color: string) => {
  switch (color) {
    case "green":
      return { text: "text-green-900", bg: "bg-green-200" };
    case "yellow":
      return { text: "text-yellow-900", bg: "bg-yellow-200" };
    case "red":
      return { text: "text-red-900", bg: "bg-red-200" };
    default:
      return { text: "text-gray-900", bg: "bg-gray-200" };
  }
};

const mapStatus = (status: string) => {
  switch (status) {
    case "PENDING_FINANCIER":
      return "ממתין למממן";
    case "PENDING_BORROWER":
      return "ממתין לך";
    case "EXPIRED":
      return "פג תוקף";
    case "ACCEPTED":
      return "התקבל";
    case "REJECTED":
      return "נדחה";
    default:
      return status || "לא זמין"; // 👈 use raw status if provided
  }
};

const mapStatusColor = (status: string) => {
  switch (status) {
    case "PENDING_FINANCIER":
    case "PENDING_BORROWER":
      return "yellow";
    case "EXPIRED":
    case "REJECTED":
      return "red";
    case "ACCEPTED":
      return "green";
    default:
      return "gray";
  }
};

export default function LoanRequestDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const API_BASE_URL = "http://localhost:5000"; // adjust if needed

  // ---- State ----
  const [loanRequest, setLoanRequest] = useState<Loan>();
  const [documents, setDocuments] = useState([
    { englishName: "tabo_document", name: "נסח טאבו עדכני", status: "missing" },
    {
      englishName: "united_home_document",
      name: "תקנון הבית המשותף",
      status: "missing",
    },
    {
      englishName: "original_tama_document",
      name: 'הסכם התמ"א המקורי',
      status: "missing",
    },
    {
      englishName: "project_list_document",
      name: "רשימת הפרויקטים של היזם",
      status: "missing",
    },
    {
      englishName: "company_crt_document",
      name: "תעודת התאגדות של החברה היזמית",
      status: "missing",
    },
    {
      englishName: "tama_addons_document",
      name: 'תוספות להסכם התמ"א',
      status: "missing",
    },
    {
      englishName: "reject_status_document",
      name: "סטטוס סרבנים - פרטיהם, פירוט תביעות ופירוט פסקי דין",
      status: "missing",
    },
    {
      englishName: "building_permit",
      name: "היתר בניה, לרבות בקשה לקבלת היתר ותיקונים לו",
      status: "missing",
    },
    {
      englishName: "objection_status",
      name: "סטטוס התנגדויות",
      status: "missing",
    },
    { englishName: "zero_document", name: 'דו"ח אפס', status: "missing" },
    {
      englishName: "bank_account_confirm_document",
      name: "אישור ניהול חשבון",
      status: "missing",
    },
  ]);
  const [financiers, setFinanciers] = useState<any[]>([]);

  // Chat
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ---- Data loaders ----
  const fetchLoan = async () => {
    try {
      const raw = await getLoan(id);

      // Normalize snake_case/camelCase differences:
      const normalized = {
        id: raw.id,
        companyName: raw.companyName ?? raw.company_name,
        projectType: raw.projectType ?? raw.project_type,
        amount: raw.amount,
        location: raw.location,
        daysPassed: raw.daysPassed ?? raw.days_passed,
        status: raw.status,
        statusColor: (raw.statusColor ?? raw.status_color ?? "yellow") as
          | "yellow"
          | "green"
          | "red"
          | "gray",
        progress: raw.progress ?? 0,
        fileNames: raw.fileNames ?? raw.file_names ?? [],
      };

      setLoanRequest(normalized as Loan);

      // Update document statuses from fileNames
      setDocuments((prev) =>
        prev.map((doc) => ({
          ...doc,
          status: normalized.fileNames.includes(doc.englishName)
            ? "uploaded"
            : "missing",
        }))
      );
    } catch (e) {
      console.error("Failed to fetch loan:", e);
    }
  };

  const getOffers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/offer/get/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const offers = Array.isArray(res.data)
        ? res.data
        : res.data.offers || res.data.data || [];

      const mapped = offers.map((o: any) => ({
        id: o.id,
        name: o.organization_name,
        status: mapStatus(o.status),
        statusColor: mapStatusColor(o.status),
        intrestRate: o.interest_rate,
        amount: o.offer_amount,
        percentage: loanRequest?.amount
          ? ((o.offer_amount / loanRequest.amount) * 100).toFixed(2)
          : "0.00",
        repaymentPeriod: o.repayment_period,
      }));

      setFinanciers(mapped);
    } catch (e) {
      console.error("Failed to fetch offers:", e);
    }
  };

  // Chat
  const getMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/chat/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const list = res.data.map((m: any) => ({
        id: m.id,
        text: m.message,
        sender: m.sender_role === "borrower" ? "borrower" : "financier",
        name: m.sender_name,
        timestamp: new Date(m.sent_at),
      }));
      setMessages(list);
    } catch (e) {
      console.error("Failed to fetch messages:", e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await axios.post(
        `${API_BASE_URL}/chat/message/${id}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setMessage("");
      await getMessages();
    } catch (e) {
      console.error("Failed to send message:", e);
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });

  // ---- Effects ----
  useEffect(() => {
    fetchLoan();
  }, []);

  useEffect(() => {
    if (loanRequest) {
      getOffers();
      getMessages();
    }
  }, [loanRequest]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- Actions on offers (Financiers tab only) ----
  const approveOffer = async (offerId: string) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/offer/accept/${offerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      await getOffers();
    } catch {
      alert("failed to approve");
    }
  };

  const rejectOffer = async (offerId: string) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/offer/reject/${offerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      await getOffers();
    } catch {
      alert("failed to reject");
    }
  };

  // ---- UI ----
  if (!loanRequest) return "Loading...";

  const loanPill = pillClasses(loanRequest.statusColor);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-purple-800 text-center">
        פרטי בקשה
      </h1>

      <Tabs defaultValue="details" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="details">פרטי בקשה</TabsTrigger>
          <TabsTrigger value="documents">מסמכים</TabsTrigger>
          <TabsTrigger value="financiers">הצעות מימון</TabsTrigger>
          <TabsTrigger value="chat">צ'אט</TabsTrigger>
        </TabsList>

        {/* ========== DETAILS (like your screenshot) ========== */}
        <TabsContent value="details">
          <div className="flex flex-wrap -mx-2">
            {/* Left column */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              {/* Request details card */}
              <Card className="mb-4" dir="rtl">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    פרטי הבקשה
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-700 mb-1">
                        <strong>שם חברה:</strong> {loanRequest.companyName}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <strong>סוג פרויקט:</strong> {loanRequest.projectType}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <strong>סכום הלוואה:</strong> {loanRequest.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700 mb-1">
                        <strong>מיקום:</strong> {loanRequest.location}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <strong>זמן שעבר:</strong> {loanRequest.daysPassed} ימים
                      </p>
                      <p className="text-gray-700 mb-1">
                        <strong>סטטוס:</strong>
                        <span
                          className={`relative inline-block px-2 py-1 font-semibold leading-tight text-xs ml-1 ${loanPill.text}`}
                        >
                          <span
                            aria-hidden
                            className={`absolute inset-0 ${loanPill.bg} opacity-50 rounded-full`}
                          />
                          <span className="relative">
                            {mapStatus(loanRequest.status)}
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress card */}
              <Card dir="rtl">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    התקדמות
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative pt-1">
                    <div className="flex mb-4 text-sm text-gray-700 justify-between">
                      <div className="w-1/5 text-center">חסרים מסמכים</div>
                      <div className="w-1/5 text-center">מעבדים את המסמכים</div>
                      <div className="w-1/5 text-center">אוספים לך הצעות</div>
                      <div className="w-1/5 text-center">בחירת הלוואה</div>
                      <div className="w-1/5 text-center">הכסף אצלך</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: `${loanRequest.progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column – Offers summary (no buttons) */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <Card dir="rtl">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    הצעות מימון
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {financiers.length === 0 ? (
                    <p className="text-sm text-gray-500">אין הצעות</p>
                  ) : (
                    financiers.map((f, idx) => {
                      const c = pillClasses(f.statusColor);
                      return (
                        <div key={idx} className="text-sm mb-4">
                          <h3 className="font-semibold text-gray-700 mb-1">
                            {f.name}
                          </h3>
                          <p className="text-gray-700 mb-1">
                            <strong>סטטוס:</strong>
                            <span
                              className={`relative inline-block px-2 py-1 font-semibold leading-tight text-xs ml-1 ${c.text}`}
                            >
                              <span
                                aria-hidden
                                className={`absolute inset-0 ${c.bg} opacity-50 rounded-full`}
                              />
                              <span className="relative">{f.status}</span>
                            </span>
                          </p>
                          <p className="text-gray-700 mb-1">
                            <strong>אחוז מההלוואה:</strong> {f.percentage}%
                          </p>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ========== DOCUMENTS ========== */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                מסמכים שהועלו
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                  <DocumentItem
                    key={index}
                    name={doc.name}
                    status={doc.status as "uploaded" | "missing"}
                    userType="borrower"
                    loanId={id}
                    englishName={doc.englishName}
                    onAdd={fetchLoan}
                    onReplace={fetchLoan}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== FINANCIERS (with buttons) ========== */}
        <TabsContent value="financiers">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                פרטי מממנים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6" dir="rtl">
                {financiers.length === 0 ? (
                  <p className="text-sm text-gray-500">אין הצעות</p>
                ) : (
                  financiers.map((f, index) => {
                    const c = pillClasses(f.statusColor);
                    return (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <div className="flex items-center mb-2">
                          {/* Status pill on the right */}
                          <span
                            className={`ml-auto relative inline-block px-2 py-1 font-semibold leading-tight text-xs ${c.text}`}
                          >
                            <span
                              aria-hidden
                              className={`absolute inset-0 ${c.bg} opacity-50 rounded-full`}
                            />
                            <span className="relative">{f.status}</span>
                          </span>

                          {/* Middle info */}
                          <div className="mx-3">
                            <h3 className="font-semibold text-gray-800">
                              {f.name}
                            </h3>
                            <p className="text-sm text-gray-500">מממן מורשה</p>
                          </div>

                          {/* Avatar on the left */}
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src="/placeholder.svg?height=40&width=40"
                              alt={f.name}
                            />
                            <AvatarFallback className="bg-purple-100 text-purple-800">
                              {f.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Offer details grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-700">
                              <strong>אחוז מימון:</strong> {f.percentage}%
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>סכום מימון:</strong>{" "}
                              {Number(f.amount).toLocaleString()}₪
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-700">
                              <strong>ריבית מוצעת:</strong> {f.intrestRate}%
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>תקופת החזר:</strong> {f.repaymentPeriod}{" "}
                              חודשים
                            </p>
                          </div>
                        </div>

                        {/* Action buttons only when pending borrower */}
                        {f.status === "ממתין לך" && (
                          <div className="mt-4 flex space-x-2 space-x-reverse">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => approveOffer(f.id)}
                            >
                              קבל הצעה
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => rejectOffer(f.id)}
                            >
                              דחה הצעה
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== CHAT ========== */}
        <TabsContent value="chat">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b p-2" dir="rtl">
              <div className="flex items-center">
                <Avatar className="ml-3 mr-1">
                  <AvatarImage
                    src="/financier.png?height=40&width=40"
                    alt="מממן"
                  />
                  <AvatarFallback className="bg-purple-100 text-purple-800">
                    מ
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl text-gray-800">צ'אט</CardTitle>
                  <p className="text-sm text-gray-500">תקשורת עם מממנים</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center">אין הודעות עדיין</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "borrower"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === "borrower"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="text-xs font-semibold mb-1">
                          {msg.name}
                        </div>
                        <div className="text-sm" dir="rtl">
                          {msg.text}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            msg.sender === "borrower"
                              ? "text-purple-200"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </CardContent>

            <div className="p-4 border-t">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-2 space-x-reverse"
              >
                <Input
                  type="text"
                  dir="rtl"
                  placeholder="הקלד הודעה..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full bg-purple-600 pt-0.5 pr-0.5"
                >
                  <Send className="h-5 w-5" />
                  <span className="sr-only">שלח</span>
                </Button>
              </form>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
