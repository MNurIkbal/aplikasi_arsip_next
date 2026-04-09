export const created_at = (date: Date = new Date()) => {
  const parts = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const p = Object.fromEntries(parts.map(p => [p.type, p.value]));

  // Membuat objek Date "palsu" yang angkanya sesuai WIB
  // Format: YYYY-MM-DD HH:mm:ss
  return new Date(`${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`);
};