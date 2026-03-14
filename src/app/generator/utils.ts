function formatEventDate(dateStr: string): string {
  if (!dateStr) return '';
  // dateStr is in YYYY-MM-DDTHH:mm format from datetime-local input
  return dateStr.replace(/[-:]/g, '') + '00';
}

export function buildQrValue(type: string, data: Record<string, unknown>): string {
  switch (type) {
    case 'url':
      return (data.url as string) || '';
    case 'wifi':
      return `WIFI:T:${(data.encryption as string) || 'WPA'};S:${(data.ssid as string) || ''};P:${(data.password as string) || ''};;`;
    case 'vcard':
      return `BEGIN:VCARD
VERSION:3.0
N:${(data.lastName as string) || ''};${(data.firstName as string) || ''}
FN:${(data.firstName as string) || ''} ${(data.lastName as string) || ''}
ORG:${(data.company as string) || ''}
TITLE:${(data.title as string) || ''}
ADR:${(data.address as string) || ''}
TEL:${(data.phone as string) || ''}
EMAIL:${(data.email as string) || ''}
URL:${(data.website as string) || ''}
END:VCARD`;
    case 'email':
      return `mailto:${(data.email as string) || ''}?subject=${encodeURIComponent((data.subject as string) || '')}&body=${encodeURIComponent((data.body as string) || '')}`;
    case 'sms':
      return `smsto:${(data.phone as string) || ''}:${(data.message as string) || ''}`;
    case 'phone':
      return `tel:${(data.phone as string) || ''}`;
    case 'crypto':
      return `${(data.cryptoType as string) || 'bitcoin'}:${(data.address as string) || ''}`;
    case 'event':
      return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${(data.title as string) || ''}
DTSTART:${formatEventDate((data.startDate as string) || '')}
DTEND:${formatEventDate((data.endDate as string) || '')}
LOCATION:${(data.location as string) || ''}
DESCRIPTION:${(data.description as string) || ''}
END:VEVENT
END:VCALENDAR`;
    default:
      return (data.url as string) || '';
  }
}
