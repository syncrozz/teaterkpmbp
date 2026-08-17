import { normalizePhone } from './validation';

export function generateWhatsAppLink(
  phone: string,
  studentName?: string,
  customMessage?: string
): string {
  const normalized = normalizePhone(phone);
  if (!normalized) return '#';

  const defaultMessage = studentName
    ? `Assalamualaikum dan salam sejahtera ${studentName}. Saya daripada pihak penganjur Teater KPMBP. Terima kasih kerana mendaftarkan minat anda untuk menyertai komuniti Teater KPMBP. Kami ingin mengesahkan maklumat anda sebelum memasukkan anda ke Group WhatsApp rasmi Teater KPMBP 🎭.`
    : `Assalamualaikum. Saya daripada pihak penganjur Teater KPMBP. Terima kasih kerana mendaftarkan minat anda untuk menyertai komuniti Teater KPMBP. Kami ingin mengesahkan maklumat anda sebelum memasukkan anda ke Group Teater KPMBP 🎭.`;

  const messageToSend = customMessage || defaultMessage;
  const encodedText = encodeURIComponent(messageToSend);

  return `https://wa.me/${normalized}?text=${encodedText}`;
}

export function generateTeamCaptainWhatsAppLink(
  captainPhone: string,
  captainNameOrTeamName: string,
  teamName?: string,
  eventTitle: string = 'Pertandingan Teater KPMBP 2026'
): string {
  const normalized = normalizePhone(captainPhone);
  if (!normalized) return '#';

  const cName = teamName ? captainNameOrTeamName : 'Ketua Pasukan';
  const tName = teamName ? teamName : captainNameOrTeamName;

  const text = `Assalamualaikum ${cName}, tahniah kerana memimpin Kumpulan "${tName}" bagi acara ${eventTitle}! Pihak penganjur Teater KPMBP sedia membantu dalam persiapan skrip, props dan bimbingan rehearsal pentas 🎭.`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}
