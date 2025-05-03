import { Loan } from '../../../types/Loan'
import { getAPI } from '../api'
import { useConvertLoan } from './useConvertLoan'

export const getMarketplaceLoans = async (): Promise<Loan[]> => {
  const response = await getAPI().get('/loans/marketplace')

  return JSON.parse(response.data).loans.map((loan: any) => useConvertLoan(loan))
}
