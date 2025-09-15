import type { BackendLoanStatus } from '@/app/api/loans/statusMap'
import { backendStatusToCode } from '@/app/api/loans/statusMap'

export type UpdateLoanStatusResponse = {
  message: string
  loan_id: number
  old_status: string
  new_status: string
  borrower_email_sent: boolean
  financier_email_sent: boolean
  emails_sent: boolean
}

export const updateLoanStatus = async (
  loanId: string | number,
  newStatus: BackendLoanStatus
): Promise<UpdateLoanStatusResponse> => {
  const token = localStorage.getItem('access_token')
  
  // Validate the status before sending
  const validStatuses = [
    'PROCESSING_DOCUMENTS',
    'MISSING_DOCUMENTS', 
    'PENDING_OFFERS',
    'WAITING_FOR_OFFERS',
    'ACTIVE_LOAN',
    'PAID',
    'EXPIRED'
  ]
  
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}. Must be one of: ${validStatuses.join(', ')}`)
  }
  
  const requestBody = JSON.stringify({
    status: newStatus,
    new_status: newStatus,
    status_code: backendStatusToCode[newStatus],
  })
  console.log('🔍 Sending status update:', { 
    url: `http://127.0.0.1:5000/loans/${loanId}/status`,
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token?.substring(0, 20)}...`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: requestBody
  })
  
  const response = await fetch(`http://127.0.0.1:5000/loans/${loanId}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: requestBody
  })

  const result = await response.json()
  console.log('🔍 API Response:', { status: response.status, data: result })
  
  if (response.ok) {
    return result
  } else {
    // Fallback 1: try with string-only field
    if (response.status === 400) {
      const bodyStringOnly = JSON.stringify({ status: newStatus })
      console.log('↩️ Retry with string-only status field')
      const res2 = await fetch(`http://127.0.0.1:5000/loans/${loanId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: bodyStringOnly
      })
      let data2: any
      try { data2 = await res2.json() } catch { data2 = null }
      console.log('↩️ Retry#1 Response:', { status: res2.status, data: data2 })
      if (res2.ok) return data2

      // Fallback 2: numeric status
      const numeric = backendStatusToCode[newStatus]
      const bodyNumeric = JSON.stringify({ status: numeric })
      console.log('↩️ Retry with numeric status code', numeric)
      const res3 = await fetch(`http://127.0.0.1:5000/loans/${loanId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: bodyNumeric
      })
      let data3: any
      try { data3 = await res3.json() } catch { data3 = null }
      console.log('↩️ Retry#2 (numeric) Response:', { status: res3.status, data: data3 })
      if (res3.ok) return data3

      // Fallback 3: querystring with status
      const qsUrl = `http://127.0.0.1:5000/loans/${loanId}/status?status=${encodeURIComponent(newStatus)}`
      console.log('↩️ Retry with query param status', qsUrl)
      const res4 = await fetch(qsUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      let data4: any
      try { data4 = await res4.json() } catch { data4 = null }
      console.log('↩️ Retry#3 (query) Response:', { status: res4.status, data: data4 })
      if (res4.ok) return data4
    }

    console.error('❌ API Error Details:', result)
    throw new Error(result?.error || result?.message || `HTTP ${response.status}: Failed to update status`)
  }
}

 