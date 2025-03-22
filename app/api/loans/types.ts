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
  borrower?: Borrower
} & LoanStatusDetails

export type Borrower = {
  id: string
  email: string
  name: string
  phoneNumber: string
}

export const getLoanStatusDetails = (
  loanStatus: LoanStatus
): LoanStatusDetails => {
  const LoanStatuses: LoanStatusDetails[] = [
    {
      status: LoanStatus.New,
      statusColor: 'green',
      progress: 25,
    },
    {
      status: LoanStatus.GotOffers,
      statusColor: 'yellow',
      progress: 60,
    },
    {
      status: LoanStatus.Active,
      statusColor: 'green',
      progress: 85,
    },
    {
      status: LoanStatus.Complete,
      statusColor: 'gray',
      progress: 100,
    },
    {
      status: LoanStatus.Rejected,
      statusColor: 'red',
      progress: 0,
    },
  ]

  return LoanStatuses.find(
    (loanStatusDetails) => loanStatusDetails.status === loanStatus
  )!
}
