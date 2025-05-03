import { Loan } from '@/types/Loan'
import { getAPI } from '../api'
import { useConvertLoan } from './useConvertLoan'

export const getLoan = async (id: string): Promise<Loan> => {
  const response = await getAPI().get(`/loans/${id}`)

  return useConvertLoan(JSON.parse(response.data).loan)
}
