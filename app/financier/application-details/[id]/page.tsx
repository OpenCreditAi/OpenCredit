"use client";

import type React from "react";

import { getLoan } from "@/app/api/loans/getLoan";
import { Loan } from "@/app/api/loans/types";
import { ChatWidget } from "@/components/chat-widget";
import { DocumentItem } from "@/components/document-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Paperclip, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { getTextDirection } from "@/utils/textDirection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateLoanStatus } from "@/app/api/loans/updateLoanStatus";
import { backendToDisplayStatus, displayToBackendStatus, type BackendLoanStatus } from "@/app/api/loans/statusMap";
import { useToast } from "@/hooks/use-toast";

export default function ApplicationDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const API_BASE_URL = "http://127.0.0.1:5000";
  const [offerAmount, setOfferAmount] = useState<number | "">("");
  const [interestRate, setInterestRate] = useState<number | "">("");
  const [offerTerms, setOfferTerms] = useState<string>("");
  const [repaymentPeriod, setRepaymentPeriod] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const [loanRequest, setLoanRequest] = useState<Loan>();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedBackendStatus, setSelectedBackendStatus] = useState<BackendLoanStatus | undefined>(undefined);
  const { toast } = useToast();

  const [documents, setDocuments] = useState([
    {
      englishName: "tabo_document",
      name: "נסח טאבו עדכני",
      status: "missing",
    },
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

  const fetchLoan = async () => setLoanRequest(await getLoan(id));

  useEffect(() => {
    fetchLoan();
  }, []);

  useEffect(() => {
    if (loanRequest) {
      const updatedDocuments = documents.map((doc) => ({
        ...doc,
        status: loanRequest.file_names.includes(doc.englishName)
          ? "uploaded"
          : "missing",
      }));
      setDocuments(updatedDocuments);
    }
  }, [loanRequest]);

  const handleStatusChange = async () => {
    if (!selectedBackendStatus || !loanRequest) return;
    console.log('🔍 Debug - Selected status from dropdown:', selectedBackendStatus);
    console.log('🔍 Debug - Type of selected status:', typeof selectedBackendStatus);
    setIsUpdatingStatus(true);
    const previousStatus = loanRequest.status;
    try {
      const resp = await updateLoanStatus(id, selectedBackendStatus);
      await fetchLoan();
      const emailsOk = resp.borrower_email_sent && resp.financier_email_sent;
      toast({
        title: emailsOk ? "הסטטוס עודכן ונשלחו מיילים" : "הסטטוס עודכן",
        description: `ללווה: ${resp.borrower_email_sent ? 'נשלח' : 'לא נשלח'}, למממן: ${resp.financier_email_sent ? 'נשלח' : 'לא נשלח'}`,
      });
      setSelectedBackendStatus(undefined);
    } catch (e: any) {
      let description = e.message || "נסה שוב מאוחר יותר";
      
      // Try to fetch the latest loan to see if status actually changed despite error
      try {
        const latest = await getLoan(id);
        setLoanRequest(latest);
        if (latest.status !== previousStatus) {
          description = `הסטטוס עודכן אך אירעה שגיאה בשליחת מיילים. ${e.message ?? ''}`.trim();
          toast({ title: "עודכן עם אזהרה", description });
          setSelectedBackendStatus(undefined);
          return;
        }
      } catch {}
      
      toast({ title: "שגיאה בעדכון סטטוס", description });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (loanRequest) getMessages();
  }, [loanRequest]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleViewDocument = (docName: string) => {
    console.log(`Viewing document: ${docName}`);
    // Here you would implement the document viewing logic
    alert(`מציג מסמך: ${docName}`);
  };

  const handleRequestDocument = (docName: string) => {
    console.log(`Requesting document: ${docName}`);
    // Here you would implement the document request logic
    alert(`נשלחה בקשה למסמך: ${docName}`);
  };

  const requestMoreDocuments = () => {
    alert("נשלחה בקשה למסמכים נוספים מהלווה.");
  };

  const makeAnOffer = async () => {
    if (
      parseFloat(offerAmount.toString()) > loanRequest?.amount! ||
      parseFloat(offerAmount.toString()) < 1 ||
      offerAmount == "" ||
      isNaN(offerAmount)
    ) {
      alert("הכנס סכום חוקי");
      return;
    }

    if (
      parseFloat(interestRate.toString()) <= 0 ||
      interestRate == "" ||
      isNaN(interestRate)
    ) {
      alert("הכנס ריבית חוקית");
      return;
    }

    if (
      parseFloat(repaymentPeriod.toString()) <= 0 ||
      repaymentPeriod == "" ||
      isNaN(repaymentPeriod)
    ) {
      alert("הכנס תקופת החזר חוקית");
      return;
    }

    const token = localStorage.getItem("access_token");

    const offerData = {
      offer_amount: offerAmount,
      interest_rate: interestRate,
      offer_terms: offerTerms || "",
      repayment_period: repaymentPeriod,
      loan_id: id,
    };

    try {
      // Send the data to the server using axios
      const response = await axios.post(
        `${API_BASE_URL}/offer/new`,
        offerData,
        {
          headers: {
            "Content-Type": "application/json", // Ensure the server knows we're sending JSON
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.status === 201) {
        // Show a success alert
        alert("ההצעה נשלחה בהצלחה!");
        router.push("/financier/dashboard");
      } else {
        // Handle unexpected server response status
        alert("משהו השתבש. לא ניתן לשלוח את ההצעה");
      }
    } catch (error) {
      // Handle errors (e.g., network issues or server errors)
      console.error("Error sending offer:", error);
      alert("משהו השתבש. לא ניתן לשלוח את ההצעה");
    }
  };

  const handleOfferAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setOfferAmount("");
      setError(null);
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setOfferAmount(numValue);
      setError(null);
    } else {
      setError("סכום המימון חייב להיות גדול מ-0");
    }
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setInterestRate("");
      setError(null);
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setInterestRate(numValue);
      setError(null);
    } else {
      setError("ריבית מוצעת חייבת להיות גדולה מ-0");
    }
  };

  const handleRepaymentPeriodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "") {
      setRepaymentPeriod("");
      setError(null);
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setRepaymentPeriod(numValue);
      setError(null);
    } else {
      setError("תקופת ההחזר חייבת להיות גדולה מ-0");
    }
  };

  const handleOfferTermsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setOfferTerms(e.target.value);
  };

  // Initial chat messages
  const initialMessages = [
    {
      id: "1",
      text: "שלום, אני מעוניין לקבל מידע נוסף על הפרויקט שלך.",
      sender: "user" as const,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      text: "בוודאי, אשמח לענות על כל שאלה. במה אוכל לעזור?",
      sender: "borrower" as const,
      timestamp: new Date(Date.now() - 3500000),
    },
  ];

  if (!loanRequest) {
    return "Loading...";
  }

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

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Application Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  פרטי הבקשה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>שם חברה:</strong> {loanRequest.companyName}
                  </p>
                  <p className="text-gray-700">
                    <strong>סוג פרויקט:</strong> {loanRequest.projectType}
                  </p>
                  <p className="text-gray-700">
                    <strong>סכום הלוואה:</strong>{" "}
                    {loanRequest.amount.toLocaleString()}₪{" "}
                  </p>
                  <p className="text-gray-700">
                    <strong>מיקום:</strong> {loanRequest.location}
                  </p>
                  <p className="text-gray-700">
                    <strong>זמן שעבר: </strong>
                    {`${loanRequest.daysPassed} ימים`}
                  </p>
                  <p className="text-gray-700" dir="rtl">
                    <strong>סטטוס: </strong>
                    <span
                      className={`relative inline-block px-2 py-1 font-semibold text-${loanRequest.statusColor}-900 leading-tight text-xs ml-1`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-0 bg-${loanRequest.statusColor}-200 opacity-50 rounded-full`}
                      ></span>
                      <span className="relative">{loanRequest.status}</span>
                    </span>
                  </p>
                  <div className="flex items-center gap-2" dir="rtl">
                    <div className="w-56">
                      <Select
                        value={selectedBackendStatus}
                        onValueChange={(val) => setSelectedBackendStatus(val as BackendLoanStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="בחר סטטוס חדש" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PROCESSING_DOCUMENTS">מעבד מסמכים</SelectItem>
                          <SelectItem value="MISSING_DOCUMENTS">חסרים מסמכים</SelectItem>
                          <SelectItem value="PENDING_OFFERS">הצעות ממתינות</SelectItem>
                          <SelectItem value="WAITING_FOR_OFFERS">ממתין להצעות</SelectItem>
                          <SelectItem value="ACTIVE_LOAN">הלוואה פעילה</SelectItem>
                          <SelectItem value="PAID">הושלם</SelectItem>
                          <SelectItem value="EXPIRED">פג תוקף</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleStatusChange} disabled={!selectedBackendStatus || isUpdatingStatus}>
                      {isUpdatingStatus ? 'מעדכן...' : 'עדכן סטטוס'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Borrower Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  פרטי לווה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2" dir="rtl">
                  <p className="text-gray-700">
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
                  <p className="text-gray-700">
                    <strong>תפקיד:</strong> מנכ"ל
                  </p>
                  <p className="text-gray-700">
                    <strong>טלפון:</strong> {loanRequest.borrower?.phoneNumber}
                  </p>
                  <p className="text-gray-700" dir="rtl">
                    <strong>דוא"ל: </strong> {loanRequest.borrower?.email}
                  </p>
                  <p className="text-gray-700">
                    <strong>ניסיון קודם:</strong> 10 פרויקטים דומים
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

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

        <TabsContent value="chat">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b p-0" dir="rtl">
              <div className="flex items-center">
                <Avatar
                  style={{
                    height: "4rem",
                    width: "4rem",
                  }}
                >
                  <AvatarImage
                    src="/borrower.png"
                    alt={loanRequest.borrower?.name}
                  />
                  <AvatarFallback className="bg-purple-100 text-purple-800">
                    {loanRequest.borrower?.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl text-gray-800">
                    {loanRequest.borrower?.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {loanRequest.companyName}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4">
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
            </CardContent>

            <div className="p-4 border-t">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-2 space-x-reverse"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full mr-2"
                >
                  <Paperclip className="h-5 w-5" />
                  <span className="sr-only">צרף קובץ</span>
                </Button>
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

      {/* Offer Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            הגש הצעת מימון
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
                onChange={handleOfferAmountChange}
                placeholder="הכנס סכום"
                className="mb-4"
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
                onChange={handleInterestRateChange}
                step="0.1"
                placeholder="הכנס אחוז ריבית"
                className="mb-4"
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
                onChange={handleRepaymentPeriodChange}
                placeholder="הכנס תקופה (בחודשים)"
                className="mb-4"
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
              onChange={handleOfferTermsChange}
              placeholder="פרט תנאים נוספים להצעה"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
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

      {/* Chat Widget (floating) */}
      <ChatWidget
        borrowerName={loanRequest.borrower?.name!}
        borrowerId={loanRequest.borrower?.id!}
        initialMessages={initialMessages}
      />
    </div>
  );
}
