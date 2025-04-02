export type User = {
  id: string
  email: string
  fullName: string
  phoneNumber: string
  role: 'borrower' | 'financier'
  organizationName: string
}
