import { DocumentCategory } from '@/types/DocumentCategory'

export const getDocumentCategories = (): DocumentCategory[] => [
  {
    id: 'tabo_document',
    description: 'נסח טאבו עדכני',
  },
  {
    id: 'united_home_document',
    description: 'תקנון הבית המשותף',
  },
  {
    id: 'original_tama_document',
    description: 'הסכם התמ"א המקורי',
  },
  {
    id: 'project_list_document',
    description: 'רשימת הפרויקטים של היזם',
  },
  {
    id: 'company_crt_document',
    description: 'תעודת התאגדות של החברה היזמית',
  },
  {
    id: 'tama_addons_document',
    description: 'תוספות להסכם התמ"א',
  },
  {
    id: 'reject_status_document',
    description: 'סטטוס סרבנים - פרטיהם, פירוט תביעות ופירוט פסקי דין',
  },
  {
    id: 'building_permit',
    description: 'היתר בניה, לרבות בקשה לקבלת היתר ותיקונים לו',
  },
  {
    id: 'objection_status',
    description: 'סטטוס התנגדויות',
  },
  { id: 'zero_document', description: 'דו"ח אפס' },
  {
    id: 'bank_account_confirm_document',
    description: 'אישור ניהול חשבון',
  },
]
