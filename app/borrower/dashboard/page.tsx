'use client'

import { getLoans } from '@/app/api/loans/getLoans'
import { Loan } from '@/app/api/loans/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function BorrowerDashboard() {
  const [viewType, setViewType] = useState<'table' | 'cards'>('table')
  const [loans, setLoans] = useState<Loan[]>([])

  const fetchLoans = async () => setLoans(await getLoans())

  useEffect(() => {
    fetchLoans()
  }, [])

  const toggleView = () => {
    setViewType(viewType === 'table' ? 'cards' : 'table')
  }

  const getFilteredLoans = (tab: string) => {
    switch (tab) {
      case 'processing':
        return loans.filter((loan) => [ 'מעבד מסמכים',
          'חסרים מסמכים',
          'הצעות ממתינות',
          'ממתין להצעות',
         ].includes(loan.status))
      case 'processing':
        return loans.filter((loan) => 
          !['הושלם', 'פג תוקף', 'הלוואה פעילה'].includes(loan.status)
        )
      case 'active-loans':
        return loans.filter((loan) => loan.status === 'הלוואה פעילה')
      case 'completed':
        return loans.filter((loan) => loan.status === 'הושלם')
      default:
        return loans
    }
  }

  return (
    <div>
      <h1 className='text-4xl font-bold mb-8 text-purple-800 text-center'>
        עמוד ניהול - לווים
      </h1>
      <p className='mb-8 text-lg text-gray-700 text-center'>
        בקשות הלוואה פעילות:
      </p>

      {/* General Metrics Section */}
      <Card className='mb-8'>
        <CardContent className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <div className='text-xl font-semibold text-purple-700'>
                סה"כ הלוואות
              </div>
              <div className='text-2xl font-bold text-gray-800'>
                {loans.length}
              </div>
            </div>
            <div className='text-center'>
              <div className='text-xl font-semibold text-purple-700'>
                הלוואות בטיפול
              </div>
              <div className='text-2xl font-bold text-gray-800'>
                {getFilteredLoans('processing').length}
              </div>
            </div>
            <div className='text-center'>
              <div className='text-xl font-semibold text-purple-700'>
                סכום הלוואה כולל
              </div>
              <div className='text-2xl font-bold text-gray-800'>
                {loans.reduce((sum, loan) => sum + loan.amount, 0).toLocaleString()}₪{' '}
              </div>
            </div>
            <div className='text-center'>
              <div className='text-xl font-semibold text-purple-700'>
                אחוז אישור ממוצע
              </div>
              <div className='text-2xl font-bold text-gray-800'>
                {(() => {
                  const completedLoans = loans.filter(loan => 
                    ['הושלם', 'הלוואה פעילה'].includes(loan.status)
                  ).length
                  const totalDecidedLoans = loans.filter(loan => 
                    ['הושלם', 'פג תוקף', 'הלוואה פעילה'].includes(loan.status)
                  ).length

                  return totalDecidedLoans > 0 
                    ? Math.round((completedLoans / totalDecidedLoans) * 100) + '%'
                    : '0%'
                })()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle Button */}
      <div className='mb-4 flex justify-end'>
        <Button onClick={toggleView}>
          {viewType === 'table' ? 'הצג ככרטיסיות' : 'הצג כטבלה'}
        </Button>
      </div>

      <Tabs defaultValue='all' className='mb-6'>
        <TabsList className='mb-4'>
          <TabsTrigger value='all'>כל הבקשות</TabsTrigger>
          <TabsTrigger value='processing'>בקשות בתהליך</TabsTrigger>
          <TabsTrigger value='active-loans'>הלוואות פעילות</TabsTrigger>
          <TabsTrigger value='completed'>בקשות שהושלמו</TabsTrigger>
        </TabsList>

        <TabsContent value='all'>
          {viewType === 'table' ? (
            <div className='bg-white shadow-md rounded-lg overflow-x-auto'>
              <table className='min-w-full leading-normal'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      סטטוס
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      התקדמות
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      שם פרויקט
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      סוג פרויקט
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      מיקום
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      סכום הלוואה
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      זמן שעבר
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.id}>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold text-${loan.statusColor}-900 leading-tight`}>
                          <span
                            aria-hidden
                            className={`absolute inset-0 bg-${loan.statusColor}-200 opacity-50 rounded-full`}></span>
                          <span className='relative'>{loan.status}</span>
                        </span>
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        <div className='progress-bar'>
                          <div
                            className='progress-bar-fill'
                            style={{ width: `${loan.progress}%` }}></div>
                        </div>
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.projectName}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.projectType}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.location}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.amount.toLocaleString()}₪{' '}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        ימים {loan.daysPassed}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        <Link href={`/borrower/loan-requests/${loan.id}`}>
                          <Button variant='outline' size='sm'>
                            צפה בפרטים
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {loans.map((loan) => (
                <Card key={loan.id}>
                  <CardContent className='p-6' dir='rtl'>
                    <p className='mb-2'>
                      <strong>סטטוס: </strong>
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold text-${loan.statusColor}-900 leading-tight ml-2`}>
                        <span
                          aria-hidden
                          className={`absolute inset-0 bg-${loan.statusColor}-200 opacity-50 rounded-full`}></span>
                        <span className='relative'>{loan.status}</span>
                      </span>
                    </p>
                    <p className='mb-2'>
                      <strong>התקדמות:</strong>
                      <div className='progress-bar mt-1'>
                        <div
                          className='progress-bar-fill'
                          style={{ width: `${loan.progress}%` }}></div>
                      </div>
                    </p>
                    <p className='mb-2'>
                      <strong>שם פרויקט:</strong> {loan.projectName}
                    </p>
                    <p className='mb-2'>
                      <strong>סוג פרויקט:</strong> {loan.projectType}
                    </p>
                    <p className='mb-2'>
                      <strong>מיקום:</strong> {loan.location}
                    </p>
                    <p className='mb-2'>
                      <strong>סכום הלוואה:</strong> {loan.amount.toLocaleString()}₪{' '}
                    </p>
                    <p className='mb-4'>
                      <strong>זמן שעבר: </strong>
                      {`${loan.daysPassed} ימים`}
                    </p>
                    <Link href={`/borrower/loan-requests/${loan.id}`}>
                      <Button className='w-full'>צפה בפרטים</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='processing'>
          {viewType === 'table' ? (
            <div className='bg-white shadow-md rounded-lg overflow-x-auto'>
              <table className='min-w-full leading-normal'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      סטטוס
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      התקדמות
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      שם פרויקט
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      סוג פרויקט
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      מיקום
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      סכום הלוואה
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      זמן שעבר
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredLoans('processing').map((loan) => (
                    <tr key={loan.id}>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold text-${loan.statusColor}-900 leading-tight`}>
                          <span
                            aria-hidden
                            className={`absolute inset-0 bg-${loan.statusColor}-200 opacity-50 rounded-full`}></span>
                          <span className='relative'>{loan.status}</span>
                        </span>
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        <div className='progress-bar'>
                          <div
                            className='progress-bar-fill'
                            style={{ width: `${loan.progress}%` }}></div>
                        </div>
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.projectName}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.projectType}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.location}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.amount.toLocaleString()}₪{' '}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        ימים {loan.daysPassed}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        <Link href={`/borrower/loan-requests/${loan.id}`}>
                          <Button
                            variant='outline'
                            size='sm'
                            className='text-purple-700 border-purple-700 hover:bg-purple-50'>
                            צפה בפרטים
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {getFilteredLoans('processing').map((loan) => (
                <Card key={loan.id}>
                  <CardContent className='p-6' dir='rtl'>
                    <p className='mb-2'>
                      <strong>סטטוס: </strong>
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold text-${loan.statusColor}-900 leading-tight ml-2`}>
                        <span
                          aria-hidden
                          className={`absolute inset-0 bg-${loan.statusColor}-200 opacity-50 rounded-full`}></span>
                        <span className='relative'>{loan.status}</span>
                      </span>
                    </p>
                    <p className='mb-2'>
                      <strong>התקדמות:</strong>
                      <div className='progress-bar mt-1'>
                        <div
                          className='progress-bar-fill'
                          style={{ width: `${loan.progress}%` }}></div>
                      </div>
                    </p>
                    <p className='mb-2'>
                      <strong>שם פרויקט:</strong> {loan.projectName}
                    </p>
                    <p className='mb-2'>
                      <strong>סוג פרויקט:</strong> {loan.projectType}
                    </p>
                    <p className='mb-2'>
                      <strong>מיקום:</strong> {loan.location}
                    </p>
                    <p className='mb-2'>
                      <strong>סכום הלוואה:</strong> {loan.amount.toLocaleString()}₪{' '}
                    </p>
                    <p className='mb-4'>
                      <strong>זמן שעבר: </strong>
                      {`${loan.daysPassed} ימים`}
                    </p>
                    <Link href={`/borrower/loan-requests/${loan.id}`}>
                      <Button className='w-full'>צפה בפרטים</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='active-loans'>
          {viewType === 'table' ? (
            <div className='bg-white shadow-md rounded-lg overflow-x-auto'>
              <table className='min-w-full leading-normal'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      סטטוס
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      התקדמות
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      שם פרויקט
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      סוג פרויקט
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      מיקום
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      סכום הלוואה
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      זמן שעבר
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredLoans('active-loans').map((loan) => (
                    <tr key={loan.id}>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold text-${loan.statusColor}-900 leading-tight`}>
                          <span
                            aria-hidden
                            className={`absolute inset-0 bg-${loan.statusColor}-200 opacity-50 rounded-full`}></span>
                          <span className='relative'>{loan.status}</span>
                        </span>
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        <div className='progress-bar'>
                          <div
                            className='progress-bar-fill'
                            style={{ width: `${loan.progress}%` }}></div>
                        </div>
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.projectName}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.projectType}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.location}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.amount.toLocaleString()}₪{' '}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        ימים {loan.daysPassed}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        <Link href={`/borrower/loan-requests/${loan.id}`}>
                          <Button
                            variant='outline'
                            size='sm'
                            className='text-purple-700 border-purple-700 hover:bg-purple-50'>
                            צפה בפרטים
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {getFilteredLoans('active-loans').map((loan) => (
                <Card key={loan.id}>
                  <CardContent className='p-6' dir='rtl'>
                    <p className='mb-2'>
                      <strong>סטטוס: </strong>
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold text-${loan.statusColor}-900 leading-tight ml-2`}>
                        <span
                          aria-hidden
                          className={`absolute inset-0 bg-${loan.statusColor}-200 opacity-50 rounded-full`}></span>
                        <span className='relative'>{loan.status}</span>
                      </span>
                    </p>
                    <p className='mb-2'>
                      <strong>התקדמות:</strong>
                      <div className='progress-bar mt-1'>
                        <div
                          className='progress-bar-fill'
                          style={{ width: `${loan.progress}%` }}></div>
                      </div>
                    </p>
                    <p className='mb-2'>
                      <strong>שם פרויקט:</strong> {loan.projectName}
                    </p>
                    <p className='mb-2'>
                      <strong>סוג פרויקט:</strong> {loan.projectType}
                    </p>
                    <p className='mb-2'>
                      <strong>מיקום:</strong> {loan.location}
                    </p>
                    <p className='mb-2'>
                      <strong>סכום הלוואה:</strong> {loan.amount.toLocaleString()}₪{' '}
                    </p>
                    <p className='mb-4'>
                      <strong>זמן שעבר: </strong>
                      {`${loan.daysPassed} ימים`}
                    </p>
                    <Link href={`/borrower/loan-requests/${loan.id}`}>
                      <Button className='w-full'>צפה בפרטים</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='completed'>
          {viewType === 'table' ? (
            <div className='bg-white shadow-md rounded-lg overflow-x-auto'>
              <table className='min-w-full leading-normal'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      סטטוס
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      התקדמות
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      שם פרויקט
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      סוג פרויקט
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      מיקום
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      סכום הלוואה
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      זמן שעבר
                    </th>
                    <th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredLoans('completed').map((loan) => (
                    <tr key={loan.id}>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold text-${loan.statusColor}-900 leading-tight`}>
                          <span
                            aria-hidden
                            className={`absolute inset-0 bg-${loan.statusColor}-200 opacity-50 rounded-full`}></span>
                          <span className='relative'>{loan.status}</span>
                        </span>
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        <div className='progress-bar'>
                          <div
                            className='progress-bar-fill'
                            style={{ width: `${loan.progress}%` }}></div>
                        </div>
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.projectName}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.projectType}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.location}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        {loan.amount.toLocaleString()}₪{' '}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        ימים {loan.daysPassed}
                      </td>
                      <td className='px-5 py-5 border-b border-gray-200 bg-white text-right text-sm'>
                        <Link href={`/borrower/loan-requests/${loan.id}`}>
                          <Button
                            variant='outline'
                            size='sm'
                            className='text-purple-700 border-purple-700 hover:bg-purple-50'>
                            צפה בפרטים
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {getFilteredLoans('completed').map((loan) => (
                <Card key={loan.id}>
                  <CardContent className='p-6' dir='rtl'>
                    <p className='mb-2'>
                      <strong>סטטוס: </strong>
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold text-${loan.statusColor}-900 leading-tight ml-2`}>
                        <span
                          aria-hidden
                          className={`absolute inset-0 bg-${loan.statusColor}-200 opacity-50 rounded-full`}></span>
                        <span className='relative'>{loan.status}</span>
                      </span>
                    </p>
                    <p className='mb-2'>
                      <strong>התקדמות:</strong>
                      <div className='progress-bar mt-1'>
                        <div
                          className='progress-bar-fill'
                          style={{ width: `${loan.progress}%` }}></div>
                      </div>
                    </p>
                    <p className='mb-2'>
                      <strong>שם פרויקט:</strong> {loan.projectName}
                    </p>
                    <p className='mb-2'>
                      <strong>סוג פרויקט:</strong> {loan.projectType}
                    </p>
                    <p className='mb-2'>
                      <strong>מיקום:</strong> {loan.location}
                    </p>
                    <p className='mb-2'>
                      <strong>סכום הלוואה:</strong> {loan.amount.toLocaleString()}₪{' '}
                    </p>
                    <p className='mb-4'>
                      <strong>זמן שעבר: </strong>
                      {`${loan.daysPassed} ימים`}
                    </p>
                    <Link href={`/borrower/loan-requests/${loan.id}`}>
                      <Button className='w-full'>צפה בפרטים</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
