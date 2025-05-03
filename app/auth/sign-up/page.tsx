'use client'

import type React from 'react'

import { getUserDetails } from '@/app/api/user/getUserDetails'
import { useConvertUser } from '@/app/api/user/useConvertUser'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUserStore } from '@/stores/userStore'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SignUp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || ''
  const API_BASE_URL = 'http://127.0.0.1:5000'
  const { setUser } = useUserStore()

  const fetchUserDetails = async () => {
    const newUser = await getUserDetails()

    if (newUser) {
      setUser(newUser)
      router.push(`/${newUser.role}/dashboard`)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    idNumber: '',
    phoneNumber: '',
    address: '',
    role: defaultRole,
    password: '',
    confirmPassword: '',
    organizationName: '',
    captcha: false,
  })

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'הסיסמה חייבת להכיל לפחות 8 תווים'
    }
    if (!/[A-Z]/.test(password)) {
      return 'הסיסמה חייבת להכיל לפחות אות גדולה אחת'
    }
    if (!/[a-z]/.test(password)) {
      return 'הסיסמה חייבת להכיל לפחות אות קטנה אחת'
    }
    if (!/[0-9]/.test(password)) {
      return 'הסיסמה חייבת להכיל לפחות ספרה אחת'
    }
    return ''
  }

  useEffect(() => {
    if (formData.password || formData.confirmPassword) {
      // Validate password when it changes
      const passwordError = validatePassword(formData.password)
      setErrors((prev) => ({ ...prev, password: passwordError }))

      // Check if confirm password matches
      if (
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      ) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: 'הסיסמאות אינן תואמות',
        }))
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }))
      }
    }
  }, [formData.password, formData.confirmPassword])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        idPhoto: e.target.files ? e.target.files[0] : null,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    // Check for validation errors before submitting
    if (
      errors.password ||
      errors.confirmPassword ||
      formData.password !== formData.confirmPassword
    ) {
      return
    }

    setIsSubmitting(true)

    const role = formData.role === 'lawyer-notary' ? 'borrower' : formData.role

    try {
      // Prepare the data for the API request
      const signupData = {
        email: formData.email,
        password: formData.password,
        role: role,
        // You can add other fields as needed by your API
        fullName: formData.fullName,
        idNumber: formData.idNumber,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        organizationName: formData.organizationName,
      }

      // Send the POST request to the signup endpoint using axios
      const response = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        signupData
      )

      // Store the access token in localStorage
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token)
      }

      const user = useConvertUser(response.data.user)
      setUser(user)

      if (user?.role === 'borrower') {
        router.push('/borrower/dashboard')
      } else if (user?.role === 'financier') {
        router.push('/financier/dashboard')
      } else {
        // Default fallback
        router.push('/auth/sign-in')
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      setApiError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'שגיאה בהרשמה. אנא נסה שוב.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <Card className='w-full max-w-4xl'>
        <CardHeader className='text-center'>
          <CardTitle className='text-3xl font-bold text-purple-800'>
            הרשמה
          </CardTitle>
          <CardDescription>צור חשבון חדש ב-OpenCredit</CardDescription>
        </CardHeader>
        <CardContent>
          {apiError && (
            <Alert variant='destructive' className='mb-6'>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label htmlFor='full-name'>שם מלא</Label>
                <Input
                  id='full-name'
                  name='fullName'
                  type='text'
                  placeholder='הכנס שם מלא'
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>דוא"ל</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='הכנס כתובת דואל'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='id-number'>תעודת זהות</Label>
                <Input
                  id='id-number'
                  name='idNumber'
                  type='text'
                  placeholder='הכנס תעודת זהות'
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='phone-number'>מספר טלפון</Label>
                <Input
                  id='phone-number'
                  name='phoneNumber'
                  type='tel'
                  placeholder='הכנס מספר טלפון'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>סיסמה</Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='הכנס סיסמה'
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <Alert variant='destructive' className='mt-2 py-2'>
                    <AlertDescription>{errors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirm-password'>אימות סיסמה</Label>
                <Input
                  id='confirm-password'
                  name='confirmPassword'
                  type='password'
                  placeholder='הכנס סיסמה שוב'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && (
                  <Alert variant='destructive' className='mt-2 py-2'>
                    <AlertDescription>
                      {errors.confirmPassword}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='address'>כתובת מגורים</Label>
                <Input
                  id='address'
                  name='address'
                  type='text'
                  placeholder='הכנס כתובת מגורים'
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='user-type'>סוג משתמש</Label>
                <Select
                  value={formData.role}
                  onValueChange={handleSelectChange}>
                  <SelectTrigger id='user-type'>
                    <SelectValue placeholder='בחר סוג משתמש' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='borrower'>יזם</SelectItem>
                    <SelectItem value='financier'>נותן אשראי</SelectItem>
                    <SelectItem value='lawyer-notary'>עו"ד/נוטריון</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='organization-name'>שם חברה</Label>
                <Input
                  id='organization-name'
                  name='organizationName'
                  type='text'
                  placeholder='הכנס שם חברה'
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='id-photo'>תמונה של תעודת זהות</Label>
                <Input
                  id='id-photo'
                  name='idPhoto'
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  required
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <Checkbox
                  id='captcha'
                  name='captcha'
                  checked={formData.captcha}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      captcha: checked as boolean,
                    }))
                  }
                  required
                />
                <Label htmlFor='captcha' className='mr-2'>
                  אני לא רובוט
                </Label>
              </div>
            </div>

            <Button
              type='submit'
              className='w-full mt-6'
              disabled={
                isSubmitting ||
                !!errors.password ||
                !!errors.confirmPassword ||
                formData.password !== formData.confirmPassword
              }>
              {isSubmitting ? (
                <span className='flex items-center justify-center'>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  מבצע הרשמה...
                </span>
              ) : (
                'הרשמה'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <p className='text-sm text-gray-600'>
            כבר יש לך חשבון?{' '}
            <Link
              href='/auth/sign-in'
              className='text-purple-600 hover:underline'>
              התחבר כאן
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
