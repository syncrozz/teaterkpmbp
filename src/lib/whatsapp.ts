import { normalizePhone } from './validation';
import { Student } from '../types';

export function generateStudentRegistrationWhatsAppLink(
  student: Student,
  actionType: 'PENGESAHAN_PENDAFTARAN' | 'JEMPUT_GROUP' = 'PENGESAHAN_PENDAFTARAN',
  assignedTeamName?: string
): string {
  const normalized = normalizePhone(student.phone);
  if (!normalized) return '#';

  const nicknameStr = student.nickname ? ` (${student.nickname})` : '';
  const interestsStr = student.interests && student.interests.length > 0 ? student.interests.join(', ') : 'Pelakon / Krew';
  const teamStr = assignedTeamName ? assignedTeamName : (student.group_status || 'Belum mempunyai kumpulan');

  let text = '';

  if (actionType === 'PENGESAHAN_PENDAFTARAN') {
    text = `*PENGESAHAN PENDAFTARAN KELAB TEATER KPMBP 🎭*

Assalamualaikum & Salam Sejahtera, *${student.full_name}*${nicknameStr}.

Pihak pengurusan Teater KPMBP telah menerima pendaftaran minat anda. Berikut adalah perincian profil anda dalam rekod rasmi kami:

📋 *MAKLUMAT PENDAFTARAN:*
• *Nama Penuh:* ${student.full_name}${nicknameStr}
• *No. Pelajar:* ${student.student_id}
• *Program:* ${student.programme}
• *Kelas & Semester:* ${student.class_name} (Semester ${student.semester})
• *No. Telefon:* ${student.phone}
• *Emel:* ${student.email || '-'}
• *Minat / Bidang:* ${interestsStr}
• *Tahap Pengalaman:* ${student.experience_level}
• *Status Kumpulan:* ${teamStr}
${student.motivation ? `• *Motivasi:* "${student.motivation}"\n` : ''}
Sila sahkan sekiranya butiran peribadi di atas adalah tepat. Kami amat berbesar hati mengalu-alukan penyertaan anda ke dalam keluarga Teater KPMBP! 🎬✨

Terima kasih.
_Urus Setia Pentadbir Kelab Teater KPMBP_`;
  } else {
    text = `*JEMPUTAN KUMPULAN TEATER KPMBP 🎭*

Assalamualaikum *${student.full_name}*${nicknameStr} (${student.student_id}),

Tahniah! Anda telah dimasukkan ke dalam kumpulan produksi: *${teamStr}* bagi aktiviti Teater KPMBP.

📋 *Profil:* ${student.programme} (${student.class_name}) | ${interestsStr}

Sila sahkan kesediaan anda untuk memulakan latihan.

Terima kasih.
_Urus Setia Kelab Teater KPMBP_`;
  }

  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

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

