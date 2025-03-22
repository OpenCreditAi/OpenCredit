import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-purple-50 to-white'>
      <header className='bg-white shadow-md py-4 sticky top-0 z-50'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <div className='flex items-center'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold text-xl ml-2'>
              OC
            </div>
            <h1 className='text-2xl font-bold text-purple-800'>OpenCredit</h1>
          </div>
          <div className='space-x-4 space-x-reverse'>
            <Link href='/auth/sign-in'>
              <Button variant='outline'>התחברות</Button>
            </Link>
            <Link href='/auth/sign-up'>
              <Button>הרשמה</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 py-16'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-5xl font-bold mb-6 text-purple-800'>
            פלטפורמת מימון נדל״ן חכמה
          </h1>
          <p className='text-xl mb-10 text-gray-700'>
            OpenCredit מחברת בין יזמים לבין מממנים בתחום הנדל״ן באמצעות שוק
            אשראי שקוף ובטוח
          </p>

          <div className='flex flex-col sm:flex-row justify-center gap-6 mb-16'>
            <Link href='/auth/sign-up?role=borrower'>
              <Button size='lg' className='w-full sm:w-auto'>
                הרשמה כיזם
              </Button>
            </Link>
            <Link href='/auth/sign-up?role=financier'>
              <Button size='lg' variant='outline' className='w-full sm:w-auto'>
                הרשמה כמממן
              </Button>
            </Link>
          </div>

          <div className='grid md:grid-cols-3 gap-8 text-right'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-xl font-semibold mb-3 text-purple-700'>
                ליזמים
              </h3>
              <p className='text-gray-600'>
                הגישו בקשות מימון בקלות, העלו מסמכים, וקבלו הצעות מימון מותאמות
                אישית ממגוון מממנים.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-xl font-semibold mb-3 text-purple-700'>
                למממנים
              </h3>
              <p className='text-gray-600'>
                גישה לבקשות מימון מאומתות, סינון לפי העדפות, וקבלת החלטות מימון
                מבוססות נתונים.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-xl font-semibold mb-3 text-purple-700'>
                שקיפות ובטיחות
              </h3>
              <p className='text-gray-600'>
                שימוש בטכנולוגיית Open Banking לאימות נתונים פיננסיים ויצירת
                סביבה בטוחה ושקופה.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className='bg-gray-100 py-8 mt-16'>
        <div className='container mx-auto px-4 text-center text-gray-600'>
          <p>© {new Date().getFullYear()} OpenCredit. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  )
}
