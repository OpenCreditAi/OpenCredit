import { User } from '@/types/User'
import { getAPI } from '../api'
import { useConvertUser } from './useConvertUser'

export const getUserDetails = async (): Promise<User | null> => {
  const response = await getAPI().get(`/auth/me`)

  return useConvertUser(JSON.parse(response.data).user)
}
