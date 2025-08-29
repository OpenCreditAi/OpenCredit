export enum LoanStatus {
  PROCESSING_DOCUMENTS = 'מעבד מסמכים',
  MISSING_DOCUMENTS = 'חסרים מסמכים',
  PENDING_OFFERS = 'הצעות ממתינות',
  WAITING_FOR_OFFERS = 'ממתין להצעות',
  ACTTVE_LOAN = 'הלוואה פעילה',
  PAID = 'הושלם',
  EXPIRED = 'פג תוקף',
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
  borrower?: Borrower
  recommendationOrder?: number
  file_names: string[]
} & LoanStatusDetails

export type Borrower = {
  id: string
  email: string
  name: string
  phoneNumber: string
}

export const getLoanStatusDetails = (
  loanStatus: Number | string
): LoanStatusDetails => {

  const LoanStatuses: LoanStatusDetails[] = [
    {
      status: LoanStatus.PROCESSING_DOCUMENTS,
      statusColor: 'gray',
      progress: 30,
    },
    {
      status: LoanStatus.MISSING_DOCUMENTS,
      statusColor: 'yellow',
      progress: 11,
    },
    {
      status: LoanStatus.PENDING_OFFERS,
      statusColor: 'yellow',
      progress: 70,
    },
    {
      status: LoanStatus.WAITING_FOR_OFFERS,
      statusColor: 'gray',
      progress: 50,
    },
    {
      status: LoanStatus.ACTTVE_LOAN,
      statusColor: 'green',
      progress: 90,
    },
    {
      status: LoanStatus.PAID,
      statusColor: 'gray',
      progress: 100,
    },
    {
      status: LoanStatus.EXPIRED,
      statusColor: 'red',
      progress: 0,
    },
  ]

  return LoanStatuses[loanStatus as number]
}
