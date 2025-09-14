"use client";

import type React from "react";

import { getMarketplaceLoans } from "@/app/api/loans/getMarketplaceLoans";
import { Loan } from "@/app/api/loans/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Marketplace() {
  const router = useRouter();
  const [viewType, setViewType] = useState<"table" | "cards">("table");
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  const [maxAmount, setMaxAmount] = useState<number>(200000000);
  const [filters, setFilters] = useState({
    projectType: "",
    location: "",
    status: "",
    company: "",
  });

  const [loans, setLoans] = useState<Loan[]>([]);

  const fetchLoans = async () => {
    const newLoans = await getMarketplaceLoans();
    setLoans(newLoans);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const toggleView = () => {
    setViewType(viewType === "table" ? "cards" : "table");
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(newFilters);
  };

  const handleSelectChange = (name: string, value: string) => {
    const newFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(newFilters);
  };

  const handleSliderChange = (value: number[]) => {
    setMaxAmount(value[0]);
  };

  const filteredLoans = useMemo(() => {
    let results = [...loans];

    // Filter by project type
    if (filters.projectType && filters.projectType !== "projectType") {
      results = results.filter(
        (loan) => loan.projectType === filters.projectType
      );
    }

    // Filter by location (case insensitive partial match)
    if (filters.location) {
      results = results.filter((loan) =>
        loan.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by max amount
    results = results.filter((loan) => {
      // Extract numeric value from amount string (e.g., "5,000,000 ₪" -> 5000000)
      const numericAmount = Number(loan.amount);
      return numericAmount <= maxAmount;
    });
    // filter expired statuses
    results = results.filter(
      (loan) =>
        loan.status !== "הושלם" &&
        loan.status !== "הלוואה פעילה" &&
        loan.status !== "פג תוקף"
    );

    // Filter by status
    if (filters.status && filters.status !== "status") {
      results = results.filter((loan) => loan.status === filters.status);
    }

    // Filter by company name
    if (filters.company) {
      results = results.filter((loan) =>
        loan.companyName.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (showRecommendedOnly) {
      return results
        .filter((loan) => loan.recommendationOrder !== null)
        .sort((a, b) => a.recommendationOrder! - b.recommendationOrder!);
    } else {
      return results;
    }
  }, [filters, loans, maxAmount, showRecommendedOnly]);

  const openApplicationDetails = (id: string) => {
    router.push(`/financier/application-details/${id}`);
  };

  return (
    <div>
      <nav className="bg-white shadow-md py-4 mb-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800">
            חיפוש בקשות הלוואות
          </h1>
          <div className="space-x-4 space-x-reverse">
            <Button
              onClick={() => setShowRecommendedOnly(true)}
              variant="default"
              className={`bg-purple-700 hover:bg-purple-900${
                showRecommendedOnly ? " text-yellow-300" : ""
              }`}
            >
              בקשות מומלצות ✨
            </Button>
            <Button
              onClick={() => setShowRecommendedOnly(false)}
              variant="default"
              className={`bg-purple-700 hover:bg-purple-900${
                !showRecommendedOnly ? " text-yellow-300" : ""
              }`}
            >
              כל הבקשות
            </Button>
          </div>
        </div>
        {showRecommendedOnly && (
          <p className="text-xs text-gray-600 mt-4 px-4 text-center">
            ב-"בקשות מומלצות" מוצגות הבקשות שהכי דומות להיסטוריית ההשקעות שלך
            ובעלות הלווים האמינים ביותר, מסודרות לפי רמת התאמה מהגבוה לנמוך.
            איננו מתחייבים לתוצאות האלגוריתם.
          </p>
        )}
      </nav>

      <div className="container mx-auto py-8 px-4 flex flex-wrap">
        {/* Left Filter Side */}
        <div className="w-full md:w-1/4 px-2 mb-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                סנן לפי
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectType">סוג פרויקט:</Label>
                  <Select
                    value={filters.projectType}
                    onValueChange={(value) =>
                      handleSelectChange("projectType", value)
                    }
                  >
                    <SelectTrigger id="projectType" className="mt-1">
                      <SelectValue placeholder="בחר סוג פרויקט" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="projectType">
                        בחר סוג פרויקט
                      </SelectItem>
                      <SelectItem value="מגורים">מגורים</SelectItem>
                      <SelectItem value="מסחר">מסחר</SelectItem>
                      <SelectItem value="בנייה עצמית">בנייה עצמית</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">מיקום הפרויקט:</Label>
                  <Input
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="הכנס מיקום"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="maxAmount"
                    style={{
                      overflow: "clip",
                    }}
                  >
                    סך הלוואה מקסימלי: {maxAmount.toLocaleString()}
                  </Label>
                  <Slider
                    id="maxAmount"
                    defaultValue={[maxAmount]}
                    max={200000000}
                    step={20000}
                    onValueChange={handleSliderChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="status">סטטוס:</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="בחר סטטוס" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status">בחר סטטוס</SelectItem>
                      <SelectItem value="חסרים מסמכים">חסרים מסמכים</SelectItem>
                      <SelectItem value="מעבד מסמכים">מעבד מסמכים</SelectItem>
                      <SelectItem value="ממתין להצעות">ממתין להצעות</SelectItem>
                      <SelectItem value="הצעות ממתינות">
                        הצעות ממתינות
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="company">חברה מבצעת:</Label>
                  <Input
                    id="company"
                    name="company"
                    value={filters.company}
                    onChange={handleFilterChange}
                    placeholder="הכנס שם חברה"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content Side */}
        <div className="w-full md:w-3/4 px-2 mb-4">
          {/* View Toggle Button */}
          <div className="mb-4 flex justify-end">
            <Button onClick={toggleView}>
              {viewType === "table" ? "הצג ככרטיסיות" : "הצג כטבלה"}
            </Button>
          </div>

          {filteredLoans.length === 0 && (
            <div className="bg-white shadow-md rounded-lg p-6 text-center mb-4">
              <p className="text-gray-600">
                לא נמצאו תוצאות התואמות את הסינון שלך
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  const resetFilters = {
                    projectType: "",
                    location: "",
                    status: "",
                    company: "",
                  };
                  setFilters(resetFilters);
                  setMaxAmount(10000000);
                  setShowRecommendedOnly(false);
                }}
                className="mt-2"
              >
                נקה סינון
              </Button>
            </div>
          )}

          {viewType === "table" ? (
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      סטטוס
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      התקדמות
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      שם חברה
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      סוג פרויקט
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      מיקום
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      סכום הלוואה
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      זמן שעבר
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.map((loan) => (
                    <tr
                      key={loan.id}
                      onClick={() => openApplicationDetails(loan.id)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold text-${loan.statusColor}-900 leading-tight`}
                        >
                          <span
                            aria-hidden
                            className={`absolute inset-0 bg-${loan.statusColor}-200 opacity-50 rounded-full`}
                          ></span>
                          <span className="relative">{loan.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${loan.progress}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        {loan.companyName}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        {loan.projectType}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        {loan.location}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        {loan.amount}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        ימים {loan.daysPassed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLoans.map((loan) => (
                <Card
                  key={loan.id}
                  className="cursor-pointer hover:shadow-lg"
                  onClick={() => openApplicationDetails(loan.id)}
                >
                  <CardContent className="p-6" dir="rtl">
                    <p className="mb-2">
                      <strong>סטטוס: </strong>
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold text-${loan.statusColor}-900 leading-tight ml-2`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-0 bg-${loan.statusColor}-200 opacity-50 rounded-full`}
                        ></span>
                        <span className="relative">{loan.status}</span>
                      </span>
                    </p>
                    <p className="mb-2">
                      <strong>התקדמות:</strong>
                      <div className="progress-bar mt-1">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${loan.progress}%` }}
                        ></div>
                      </div>
                    </p>
                    <p className="mb-2">
                      <strong>שם חברה:</strong> {loan.companyName}
                    </p>
                    <p className="mb-2">
                      <strong>סוג פרויקט:</strong> {loan.projectType}
                    </p>
                    <p className="mb-2">
                      <strong>מיקום:</strong> {loan.location}
                    </p>
                    <p className="mb-2">
                      <strong>סכום הלוואה:</strong> {loan.amount}
                    </p>
                    <p className="mb-4">
                      <strong>זמן שעבר: </strong>
                      {`${loan.daysPassed} ימים`}
                    </p>
                    <Button className="w-full bg-purple-700 hover:bg-purple-800">
                      הצג פרטים
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
