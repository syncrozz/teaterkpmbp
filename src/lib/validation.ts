/**
 * Live Input Masking, Normalization & Validation Utilities
 * Principle: "USER MASUKKAN DATA, SISTEM URUSKAN FORMAT."
 */

// 1. NAMA / FULL NAME
export function formatLiveName(input: string): string {
  // Live typing: convert to uppercase and collapse multiple consecutive spaces to a single space
  return input.toUpperCase().replace(/\s{2,}/g, ' ');
}

export function normalizeFullName(input: string): string {
  // Normalization on submit/blur: uppercase, trim edges, collapse multiple spaces
  return input.trim().toUpperCase().replace(/\s+/g, ' ');
}

export function validateFullName(name: string): { isValid: boolean; cleaned: string; message?: string } {
  const cleaned = normalizeFullName(name);
  if (!cleaned || cleaned.length < 3) {
    return { 
      isValid: false, 
      cleaned: '', 
      message: 'Sila masukkan nama penuh yang sah (cth: NUR AINA BATRISYIA BINTI ZULHILMI).' 
    };
  }
  return { isValid: true, cleaned };
}

// 2. ID PELAJAR (XXX-XXXX-XXX)
export function maskStudentId(input: string): string {
  if (!input) return '';

  // Extract all characters except letters and digits, auto-uppercase
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!clean) return '';

  // Extract up to 3 leading letters
  let letters = '';
  let i = 0;
  while (i < clean.length && letters.length < 3) {
    const ch = clean[i];
    if (/[A-Z]/.test(ch)) {
      letters += ch;
    }
    i++;
  }

  // The rest are digits (max 7 digits: 4 middle, 3 end)
  const digits = clean.slice(i).replace(/[^0-9]/g, '').slice(0, 7);

  if (digits.length === 0) {
    if (letters.length === 3 && input.endsWith('-')) {
      return `${letters}-`;
    }
    return letters;
  }

  const midDigits = digits.slice(0, 4);
  const endDigits = digits.slice(4, 7);

  if (endDigits.length > 0) {
    return `${letters}-${midDigits}-${endDigits}`;
  }
  if (midDigits.length === 4 && input.endsWith('-')) {
    return `${letters}-${midDigits}-`;
  }
  return `${letters}-${midDigits}`;
}

export function validateStudentId(studentId: string): { isValid: boolean; message?: string } {
  const trimmed = studentId.trim().toUpperCase();
  if (!trimmed) {
    return { isValid: false, message: 'ID Pelajar diperlukan.' };
  }
  const idRegex = /^[A-Z]{3}-[0-9]{4}-[0-9]{3}$/;
  if (!idRegex.test(trimmed)) {
    return { 
      isValid: false, 
      message: 'Format ID Pelajar tidak sah. Sila gunakan format XXX-XXXX-XXX (cth: PDA-2502-011).' 
    };
  }
  return { isValid: true };
}

// 3. NO. KAD PENGENALAN / NO. ISI (XXXXXX-XX-XXXX)
export function maskICNumber(input: string): string {
  if (!input) return '';
  const digits = input.replace(/\D/g, '').slice(0, 12);
  if (!digits) return '';

  if (digits.length <= 6) {
    if (digits.length === 6 && input.endsWith('-')) {
      return `${digits}-`;
    }
    return digits;
  }

  const part1 = digits.slice(0, 6);
  const part2 = digits.slice(6, 8);
  const part3 = digits.slice(8, 12);

  if (part3.length > 0) {
    return `${part1}-${part2}-${part3}`;
  }
  if (part2.length === 2 && input.endsWith('-')) {
    return `${part1}-${part2}-`;
  }
  return `${part1}-${part2}`;
}

export function validateICNumber(ic: string): { isValid: boolean; message?: string } {
  const trimmed = ic.trim();
  if (!trimmed) {
    return { isValid: false, message: 'No. Kad Pengenalan diperlukan.' };
  }
  const icRegex = /^[0-9]{6}-[0-9]{2}-[0-9]{4}$/;
  if (!icRegex.test(trimmed)) {
    return { 
      isValid: false, 
      message: 'Format No. Isi tidak sah. Sila gunakan format XXXXXX-XX-XXXX (cth: 861115-46-5305).' 
    };
  }
  return { isValid: true };
}

// 4. NO. TELEFON (01X-XXXXXXX / 601X-XXXXXXX)
export function maskPhoneNumber(input: string): string {
  if (!input) return '';
  const hasPlus = input.trim().startsWith('+');
  let digits = input.replace(/\D/g, '').slice(0, 13);
  if (!digits) return '';

  const prefixPlus = hasPlus ? '+' : '';

  // Prefix 601X (e.g. 60145313756 -> 6014-5313756)
  if (digits.startsWith('601')) {
    if (digits.length <= 4) {
      if (digits.length === 4 && input.endsWith('-')) {
        return `${prefixPlus}${digits}-`;
      }
      return `${prefixPlus}${digits}`;
    }
    const prefix = digits.slice(0, 4);
    const rest = digits.slice(4);
    return `${prefixPlus}${prefix}-${rest}`;
  }

  // Prefix 01X (e.g. 0145313756 -> 014-5313756, 01112345678 -> 011-12345678)
  if (digits.startsWith('01')) {
    if (digits.length <= 3) {
      if (digits.length === 3 && input.endsWith('-')) {
        return `${prefixPlus}${digits}-`;
      }
      return `${prefixPlus}${digits}`;
    }
    const prefix = digits.slice(0, 3);
    const rest = digits.slice(3);
    return `${prefixPlus}${prefix}-${rest}`;
  }

  // Fallback for numbers without 0 or 60 prefix (e.g. 145313756)
  if (digits.startsWith('1')) {
    if (digits.length <= 2) {
      return `${prefixPlus}${digits}`;
    }
    const prefix = digits.slice(0, 2);
    const rest = digits.slice(2);
    return `${prefixPlus}${prefix}-${rest}`;
  }

  if (digits.length > 3) {
    return `${prefixPlus}${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${prefixPlus}${digits}`;
}

export function normalizePhone(rawPhone: string): string {
  let digits = rawPhone.replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('01')) {
    digits = '6' + digits;
  } else if (digits.startsWith('1')) {
    digits = '60' + digits;
  } else if (!digits.startsWith('60') && digits.length >= 9) {
    digits = '60' + digits;
  }

  return digits;
}

export function formatPhoneDisplay(phoneStr: string): string {
  if (!phoneStr) return '';
  return maskPhoneNumber(phoneStr);
}

export function validatePhone(phone: string): { isValid: boolean; message?: string } {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { isValid: false, message: 'No. Telefon diperlukan.' };
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 12) {
    return { 
      isValid: false, 
      message: 'Format No. Telefon tidak sah. Sila masukkan nombor telefon yang lengkap (cth: 014-5313756 atau 6014-5313756).' 
    };
  }
  return { isValid: true };
}

// 5. EMAIL
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

