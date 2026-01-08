// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (mínimo 8 caracteres, al menos una mayúscula y un número)
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// DNI validation (solo números, 7-8 dígitos)
export const isValidDNI = (dni: string | number): boolean => {
  const dniStr = String(dni);
  const dniRegex = /^\d{7,8}$/;
  return dniRegex.test(dniStr);
};

// Phone validation (solo números, 10 dígitos)
export const isValidPhone = (phone: string | number): boolean => {
  const phoneStr = String(phone);
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phoneStr);
};

// Card number validation (16 dígitos)
export const isValidCardNumber = (cardNumber: string | number): boolean => {
  const cardStr = String(cardNumber).replace(/\s/g, '');
  return /^\d{16}$/.test(cardStr);
};

// CVV validation (3-4 dígitos)
export const isValidCVV = (cvv: string | number): boolean => {
  const cvvStr = String(cvv);
  return /^\d{3,4}$/.test(cvvStr);
};

// Expiration date validation (MM/YY format)
export const isValidExpirationDate = (date: string): boolean => {
  const dateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const [month, year] = date.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expYear = parseInt(year, 10);
  const expMonth = parseInt(month, 10);

  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;

  return true;
};

// Amount validation (debe ser positivo y tener máximo 2 decimales)
export const isValidAmount = (amount: number | string): boolean => {
  const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(amountNum) && amountNum > 0 && /^\d+(\.\d{1,2})?$/.test(String(amount));
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};

// Format date
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
};

// Format datetime
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

// Mask card number (muestra solo los últimos 4 dígitos)
export const maskCardNumber = (cardNumber: string | number): string => {
  const cardStr = String(cardNumber);
  return `**** **** **** ${cardStr.slice(-4)}`;
};
