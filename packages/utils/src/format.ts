export const formatPhone = (phone: string) =>
  phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');

export const formatCurrency = (amount: number, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);

export const truncate = (str: string, n: number) =>
  str.length > n ? str.slice(0, n) + '...' : str;