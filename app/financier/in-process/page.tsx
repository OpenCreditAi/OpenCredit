"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function InProcess() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-purple-800 text-center">בקשות בתהליך</h2>
      <p className="text-gray-700 mb-6 text-center">
        כאן תוכלו לראות בקשות שנמצאות בשלבי ביניים: בקשות שהמלווה ביקש מהן מסמכים נוספים או בקשות שכבר קיבלו הצעה.
      </p>

      <div className="space-y-6">
        {/* Applications requested more documents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-yellow-600">נדרשים מסמכים נוספים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <p className="text-gray-700 mb-2">בקשה #1005 — ממתין למסמכים מהמלווה</p>
                <Link href="/financier/application-details/1005">
                  <Button variant="link" className="text-purple-700 hover:text-purple-900 p-0">
                    הצג פרטים
                  </Button>
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <p className="text-gray-700 mb-2">בקשה #1006 — ממתין למסמכים מהמלווה</p>
                <Link href="/financier/application-details/1006">
                  <Button variant="link" className="text-purple-700 hover:text-purple-900 p-0">
                    הצג פרטים
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications that got an offer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-700">הוצעה הצעת הלוואה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <p className="text-gray-700 mb-2">בקשה #1007 — נשלחה הצעה להלוואה, מחכה לחתימה</p>
                <Link href="/financier/application-details/1007">
                  <Button variant="link" className="text-purple-700 hover:text-purple-900 p-0">
                    הצג פרטים
                  </Button>
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <p className="text-gray-700 mb-2">בקשה #1008 — נשלחה הצעה להלוואה, מחכה לאישור</p>
                <Link href="/financier/application-details/1008">
                  <Button variant="link" className="text-purple-700 hover:text-purple-900 p-0">
                    הצג פרטים
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

