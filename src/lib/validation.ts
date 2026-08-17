export function normalizePhone(rawPhone: string): string {
  // Remove all non-digit characters
  let digits = rawPhone.replace(/\D/g, '');
  
  if (!digits) return '';

  // If starts with 01, convert to 601
  if (digits.startsWith('01')) {
    digits = '6' + digits;
  } else if (digits.startsWith('1')) {
    digits = '60' + digits;
  } else if (!digits.startsWith('60') && digits.length >= 9) {
    digits = '60' + digits;
  }

  return digits;
}

export function formatPhoneDisplay(normalizedPhone: string): string {
  if (!normalizedPhone) return '';
  // e.g. 60123456789 -> +60 12-345 6789
  if (normalizedPhone.startsWith('60')) {
    const rest = normalizedPhone.slice(2);
    if (rest.length === 9) {
      return `+60 ${rest.slice(0, 2)}-${rest.slice(2, 5)} ${rest.slice(5)}`;
    } else if (rest.length === 10) {
      return `+60 ${rest.slice(0, 3)}-${rest.slice(3, 6)} ${rest.slice(6)}`;
    }
  }
  return `+${normalizedPhone}`;
}

export function validateStudentId(studentId: string): { isValid: boolean; message?: string } {
  const trimmed = studentId.trim().toUpperCase();
  if (!trimmed) {
    return { isValid: false, message: 'ID Pelajar diperlukan.' };
  }
  if (trimmed.length < 5) {
    return { isValid: false, message: 'Format ID Pelajar terlalu pendek (cth: DIT22001 / DIA24012).' };
  }
  return { isValid: true };
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validateFullName(name: string): { isValid: boolean; cleaned: string; message?: string } {
  const cleaned = name.trim().replace(/\s+/g, ' ');
  if (!cleaned || cleaned.length < 3) {
    return { isValid: false, cleaned: '', message: 'Sila masukkan nama penuh yang sah.' };
  }
  return { isValid: true, cleaned };
}
