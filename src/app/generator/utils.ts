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
TEL:${(data.phone as string) || ''}
EMAIL:${(data.email as string) || ''}
URL:${(data.website as string) || ''}
END:VCARD`;
    case 'email':
      return `mailto:${(data.email as string) || ''}?subject=${encodeURIComponent((data.subject as string) || '')}&body=${encodeURIComponent((data.body as string) || '')}`;
    case 'sms':
      return `sms:${(data.phone as string) || ''}?body=${encodeURIComponent((data.message as string) || '')}`;
    case 'phone':
      return `tel:${(data.phone as string) || ''}`;
    case 'crypto':
      return `${(data.cryptoType as string) || 'bitcoin'}:${(data.address as string) || ''}`;
    default:
      return (data.url as string) || '';
  }
}
