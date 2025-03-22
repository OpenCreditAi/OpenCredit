import { getAPI } from '../api'
import { convertLoan } from './getLoan'
import { Loan } from './types'

export const getMarketplaceLoans = async (): Promise<Loan[]> => {
  const response = await getAPI().get('/loans/marketplace')

  return JSON.parse(response.data).loans.map((loan: any) => convertLoan(loan))
}
