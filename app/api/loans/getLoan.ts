import { differenceInCalendarDays } from 'date-fns'
import { getAPI } from '../api'
import { Borrower, Loan, LoanStatus, getLoanStatusDetails } from './types'

const calculateDaysPassed = (dateString: string): number =>
  differenceInCalendarDays(new Date(), new Date(dateString))

const getRandomArrayValue = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)]

const getRandomLoanStatus = (): LoanStatus =>
  getRandomArrayValue(Object.values(LoanStatus))

export const convertLoan = (loan: any): Loan => {
  let borrower: Borrower | undefined = undefined

  if (loan.borrower) {
    borrower = {
      id: loan.borrower.id,
      email: loan.borrower.email,
      name: loan.borrower.full_name,
      phoneNumber: loan.borrower.phone_number,
    }
  }

  return {
    id: loan.id,
    companyName: loan.organization_name,
    projectType: loan.project_type,
    projectName: loan.project_name,
    location: loan.address,
    amount: loan.amount,
    borrower,
    recommendationOrder: loan.recommendation_order ?? null,
    daysPassed: calculateDaysPassed(loan.created_at),
    file_names: loan.file_names,
    ...getLoanStatusDetails(loan.status),
  }
}

export const getLoan = async (id: string): Promise<Loan> => {
  const response = await getAPI().get(`/loans/${id}`)

  return convertLoan(JSON.parse(response.data).loan)
}
