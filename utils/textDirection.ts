export const getTextDirection = (text: string): 'rtl' | 'ltr' => {
  const RTL_REGEX = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  const LTR_REGEX = /[a-zA-Z]/;
  
  // Check first non-space character
  const firstChar = text.trim().charAt(0);
  
  if (RTL_REGEX.test(firstChar)) return 'rtl';
  if (LTR_REGEX.test(firstChar)) return 'ltr';
  
  // If no clear direction is detected, default to ltr
  return 'ltr';
};