import { useConvertUser } from '@/app/api/user/useConvertUser'
import { differenceInCalendarDays } from 'date-fns'
import { Loan, LoanStatus, LoanStatusDetails } from '../../../types/Loan'

const calculateDaysPassed = (dateString: string): number =>
  differenceInCalendarDays(new Date(), new Date(dateString))

const getRandomArrayValue = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)]

const getRandomLoanStatus = (): LoanStatus =>
  getRandomArrayValue(Object.values(LoanStatus))

const getLoanStatusDetails = (loanStatus: LoanStatus): LoanStatusDetails => {
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

export const useConvertLoan = (loan: any): Loan => {
  return {
    id: loan.id,
    companyName: loan.organization_name,
    projectType: loan.project_type,
    projectName: loan.project_name,
    location: loan.address,
    amount: loan.amount,
    borrower: useConvertUser(loan.borrower) ?? undefined,
    daysPassed: calculateDaysPassed(loan.created_at),
    fileNames: loan.file_names,
    ...getLoanStatusDetails(getRandomLoanStatus()),
  }
}
