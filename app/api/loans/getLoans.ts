import { getAPI } from '../api'
import { convertLoan } from './getLoan'
import { Loan } from './types'

export const getLoans = async (): Promise<Loan[]> => {
  const response = await getAPI().get('loans')

  return JSON.parse(response.data).loans.map((loan: any) => convertLoan(loan))
}
