// Backend canonical statuses as strings
export type BackendLoanStatus =
  | 'PROCESSING_DOCUMENTS'
  | 'MISSING_DOCUMENTS'
  | 'PENDING_OFFERS'
  | 'WAITING_FOR_OFFERS'
  | 'ACTIVE_LOAN'
  | 'PAID'
  | 'EXPIRED'

// Display labels in Hebrew used in UI
export const backendToDisplayStatus: Record<BackendLoanStatus, string> = {
  PROCESSING_DOCUMENTS: 'מעבד מסמכים',
  MISSING_DOCUMENTS: 'חסרים מסמכים',
  PENDING_OFFERS: 'הצעות ממתינות',
  WAITING_FOR_OFFERS: 'ממתין להצעות',
  ACTIVE_LOAN: 'הלוואה פעילה',
  PAID: 'הושלם',
  EXPIRED: 'פג תוקף',
}

export const displayToBackendStatus: Record<string, BackendLoanStatus> = {
  'מעבד מסמכים': 'PROCESSING_DOCUMENTS',
  'חסרים מסמכים': 'MISSING_DOCUMENTS',
  'הצעות ממתינות': 'PENDING_OFFERS',
  'ממתין להצעות': 'WAITING_FOR_OFFERS',
  'הלוואה פעילה': 'ACTIVE_LOAN',
  'הושלם': 'PAID',
  'פג תוקף': 'EXPIRED',
}

export const backendStatusToCode: Record<BackendLoanStatus, number> = {
  PROCESSING_DOCUMENTS: 0,
  MISSING_DOCUMENTS: 1,
  PENDING_OFFERS: 2,
  WAITING_FOR_OFFERS: 3,
  ACTIVE_LOAN: 4,
  PAID: 5,
  EXPIRED: 6,
}



