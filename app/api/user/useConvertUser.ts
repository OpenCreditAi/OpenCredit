import { User } from '@/types/User'

export const useConvertUser = (user: any): User | null => {
  return !user
    ? null
    : {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phoneNumber: user.phone_number,
        role: user.role,
        organizationName: user.organization,
      }
}
