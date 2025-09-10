"use client";

import type React from "react";

import { getLoan } from "@/app/api/loans/getLoan";
import { Loan } from "@/app/api/loans/types";
import { DocumentItem } from "@/components/document-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { getTextDirection } from "@/utils/textDirection";

// ---- Safe status helpers (no dynamic Tailwind) ----
type PillColor = "green" | "yellow" | "red" | "gray";
const pillClasses = (color: PillColor) => {
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
  // Known enum → Hebrew. Otherwise return raw label from server.
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
      return status || "לא זמין";
  }
};

const mapStatusColorFromEnum = (status: string): PillColor => {
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

const inferColorFromLabel = (label: string): PillColor => {
  const t = label || "";
  if (t.includes("חסר") || t.includes("ממתינ")) return "yellow";
  if (t.includes("התקבל") || t.includes("מאושר")) return "green";
  if (t.includes("נדחה") || t.includes("פג")) return "red";
  return "gray";
};

export default function ApplicationDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const API_BASE_URL = "http://127.0.0.1:5000";

  // ---- Loan ----
  const [loanRequest, setLoanRequest] = useState<Loan | null>(null);
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
      name: "סטטוס סרבנים",
      status: "missing",
    },
    { englishName: "building_permit", name: "היתר בניה", status: "missing" },
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

  const fetchLoan = async () => {
    try {
      const data = await getLoan(id);
      setLoanRequest(data);
      setDocuments((prev) =>
        prev.map((doc) => ({
          ...doc,
          status: data.file_names?.includes(doc.englishName)
            ? "uploaded"
            : "missing",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch loan:", err);
    }
  };

  useEffect(() => {
    fetchLoan();
  }, []);

  // ---- Chat ----
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        sender: m.sender_role === "financier" ? "financier" : "borrower",
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

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    if (loanRequest) getMessages();
  }, [loanRequest]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- Document actions ----
  const handleViewDocument = (docName: string) => {
    alert(`מציג מסמך: ${docName}`);
  };
  const handleRequestDocument = (docName: string) => {
    alert(`נשלחה בקשה למסמך: ${docName}`);
  };

  // ---- Offer form ----
  const [offerAmount, setOfferAmount] = useState<number | "">("");
  const [interestRate, setInterestRate] = useState<number | "">("");
  const [offerTerms, setOfferTerms] = useState<string>("");
  const [repaymentPeriod, setRepaymentPeriod] = useState<number | "">("");

  const requestMoreDocuments = () => {
    alert("נשלחה בקשה למסמכים נוספים מהלווה.");
  };

  const makeAnOffer = async () => {
    if (!loanRequest) return;
    if (
      parseFloat(offerAmount.toString()) > loanRequest.amount ||
      parseFloat(offerAmount.toString()) < 1 ||
      offerAmount === "" ||
      isNaN(Number(offerAmount))
    ) {
      alert("הכנס סכום חוקי");
      return;
    }
    if (
      parseFloat(interestRate.toString()) <= 0 ||
      interestRate === "" ||
      isNaN(Number(interestRate))
    ) {
      alert("הכנס ריבית חוקית");
      return;
    }
    if (
      parseFloat(repaymentPeriod.toString()) <= 0 ||
      repaymentPeriod === "" ||
      isNaN(Number(repaymentPeriod))
    ) {
      alert("הכנס תקופת החזר חוקית");
      return;
    }

    const offerData = {
      offer_amount: offerAmount,
      interest_rate: interestRate,
      offer_terms: offerTerms || "",
      repayment_period: repaymentPeriod,
      loan_id: id,
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/offer/new`, offerData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (res.status === 201) {
        alert("ההצעה נשלחה בהצלחה!");
        router.push("/financier/dashboard");
      } else {
        alert("משהו השתבש. לא ניתן לשלוח את ההצעה");
      }
    } catch (err) {
      console.error("Error sending offer:", err);
      alert("משהו השתבש. לא ניתן לשלוח את ההצעה");
    }
  };

  if (!loanRequest) return "Loading...";

  // ---- Status pill (works for enums or Hebrew labels)
  const statusLabel = mapStatus(loanRequest.status || "");
  const statusColorKey: PillColor =
    (loanRequest as any).statusColor ||
    (loanRequest as any).status_color ||
    mapStatusColorFromEnum(loanRequest.status || "") ||
    inferColorFromLabel(statusLabel);
  const statusPill = pillClasses(statusColorKey);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-purple-800 text-center">
        פרטי בקשה #{id}
      </h1>

      <Tabs defaultValue="details" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="details">פרטי בקשה</TabsTrigger>
          <TabsTrigger value="documents">מסמכים</TabsTrigger>
          <TabsTrigger value="chat">צ'אט</TabsTrigger>
        </TabsList>

        {/* ---------- DETAILS ---------- */}
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Request details */}
            <Card dir="rtl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  פרטי הבקשה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-200">
                  <p>
                    <strong>שם חברה:</strong> {loanRequest.companyName}
                  </p>
                  <p>
                    <strong>סוג פרויקט:</strong> {loanRequest.projectType}
                  </p>
                  <p>
                    <strong>סכום הלוואה:</strong>{" "}
                    {Number(loanRequest.amount).toLocaleString("he-IL")}₪
                  </p>
                  <p>
                    <strong>מיקום:</strong> {loanRequest.location}
                  </p>
                  <p>
                    <strong>זמן שעבר:</strong> {loanRequest.daysPassed} ימים
                  </p>
                  <p>
                    <strong>סטטוס:</strong>{" "}
                    <span
                      className={`relative inline-block px-2 py-1 font-semibold leading-tight text-xs ${statusPill.text}`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-0 ${statusPill.bg} opacity-50 rounded-full`}
                      />
                      <span className="relative">{statusLabel}</span>
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Borrower details */}
            <Card dir="rtl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  פרטי לווה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-200">
                  <p>
                    <strong>שם: </strong>
                    <span
                      className="inline-block"
                      style={{
                        direction: getTextDirection(
                          loanRequest.borrower?.name || ""
                        ),
                        unicodeBidi: "isolate",
                      }}
                    >
                      {loanRequest.borrower?.name}
                    </span>
                  </p>
                  <p>
                    <strong>טלפון: </strong>
                    <span dir="ltr" style={{ unicodeBidi: "bidi-override" }}>
                      {loanRequest.borrower?.phoneNumber}
                    </span>
                  </p>
                  <p>
                    <strong>דוא"ל: </strong>
                    <span dir="ltr" style={{ unicodeBidi: "bidi-override" }}>
                      {loanRequest.borrower?.email}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---------- DOCUMENTS ---------- */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>מסמכים שהועלו</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, i) => (
                  <DocumentItem
                    key={i}
                    name={doc.name}
                    status={doc.status as "uploaded" | "missing"}
                    userType="financier"
                    loanId={id}
                    englishName={doc.englishName}
                    onView={() => handleViewDocument(doc.name)}
                    onRequest={() => handleRequestDocument(doc.name)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------- CHAT ---------- */}
        <TabsContent value="chat">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b p-2" dir="rtl">
              <div className="flex items-center">
                <Avatar style={{ height: "4rem", width: "4rem" }}>
                  <AvatarImage
                    src="/borrower.png"
                    alt={loanRequest.borrower?.name || "borrower"}
                  />
                  <AvatarFallback className="bg-purple-100 text-purple-800">
                    {loanRequest.borrower?.name?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{loanRequest.borrower?.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {loanRequest.companyName}
                  </p>
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
                        msg.sender === "financier"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === "financier"
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
                            msg.sender === "financier"
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
                  className="rounded-full bg-purple-600"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ---------- OFFER FORM (with spacing) ---------- */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            הגש הצעת מימון
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="offerAmount"
              >
                סכום המימון המוצע:
              </label>
              <Input
                id="offerAmount"
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(parseFloat(e.target.value))}
                placeholder="הכנס סכום"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="interestRate"
              >
                ריבית מוצעת (%):
              </label>
              <Input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                step="0.1"
                placeholder="הכנס אחוז ריבית"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="repaymentPeriod"
              >
                תקופת החזר (חודשים):
              </label>
              <Input
                id="repaymentPeriod"
                type="number"
                value={repaymentPeriod}
                onChange={(e) => setRepaymentPeriod(parseFloat(e.target.value))}
                placeholder="הכנס תקופה (בחודשים)"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="offerTerms"
            >
              תנאים נוספים:
            </label>
            <Textarea
              id="offerTerms"
              value={offerTerms}
              onChange={(e) => setOfferTerms(e.target.value)}
              placeholder="פרט תנאים נוספים להצעה"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* ---------- ACTIONS ---------- */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          className="bg-yellow-400 hover:bg-yellow-600 text-white"
          onClick={requestMoreDocuments}
        >
          בקש מסמכים נוספים
        </Button>
        <Button
          className="bg-green-500 hover:bg-green-700 text-white"
          onClick={makeAnOffer}
        >
          שלח הצעה
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/financier/marketplace")}
        >
          חזור לרשימה
        </Button>
      </div>
    </div>
  );
}
