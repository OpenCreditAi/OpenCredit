import { User } from '@/types/User'

export enum LoanStatus {
  New = 'חדש',
  GotOffers = 'בטיפול',
  Active = 'הלוואה פעילה',
  Complete = 'הושלם',
  Rejected = 'נדחה',
}

export type LoanStatusDetails = {
  status: LoanStatus
  statusColor: string
  progress: number
}

export type Loan = {
  id: string
  companyName: string
  projectType: string
  projectName: string
  location: string
  amount: number
  daysPassed: number
  borrower?: User
  fileNames: string[]
} & LoanStatusDetails
