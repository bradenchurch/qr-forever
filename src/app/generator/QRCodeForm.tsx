export default function QRCodeForm({ type, data, onChange }: { type: string, data: Record<string, unknown>, onChange: (d: Record<string, unknown>) => void }) {
  if (type === 'url') {
    return (
      <input
        type="url"
          value={((data.url as string) as string) || ''}
        onChange={(e) => onChange({ ...data, url: e.target.value })}
        placeholder="Enter URL..."
        className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg"
      />
    );
  }

  if (type === 'wifi') {
    return (
      <div className="space-y-4">
        <input
          type="text"
          value={(data.ssid as string) || ''}
          onChange={(e) => onChange({ ...data, ssid: e.target.value })}
          placeholder="Network Name (SSID)"
          className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          value={(data.password as string) || ''}
          onChange={(e) => onChange({ ...data, password: e.target.value })}
          placeholder="Password"
          className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg"
        />
        <select
          value={(data.encryption as string) || 'WPA'}
          onChange={(e) => onChange({ ...data, encryption: e.target.value })}
          className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg bg-white"
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None</option>
        </select>
      </div>
    );
  }

  if (type === 'vcard') {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <input type="text" value={(data.firstName as string) || ''} onChange={(e) => onChange({ ...data, firstName: e.target.value })} placeholder="First Name" className="w-1/2 text-gray-900 px-4 py-3 border border-gray-300 rounded-lg" />
          <input type="text" value={(data.lastName as string) || ''} onChange={(e) => onChange({ ...data, lastName: e.target.value })} placeholder="Last Name" className="w-1/2 text-gray-900 px-4 py-3 border border-gray-300 rounded-lg" />
        </div>
        <input type="text" value={(data.company as string) || ''} onChange={(e) => onChange({ ...data, company: e.target.value })} placeholder="Company" className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg" />
        <input type="text" value={(data.title as string) || ''} onChange={(e) => onChange({ ...data, title: e.target.value })} placeholder="Title" className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg" />
        <input type="tel" value={(data.phone as string) || ''} onChange={(e) => onChange({ ...data, phone: e.target.value })} placeholder="Phone Number" className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg" />
        <input type="email" value={(data.email as string) || ''} onChange={(e) => onChange({ ...data, email: e.target.value })} placeholder="Email Address" className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg" />
        <input type="url" value={(data.website as string) || ''} onChange={(e) => onChange({ ...data, website: e.target.value })} placeholder="Website" className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg" />
      </div>
    );
  }

  if (type === 'email') {
    return (
      <div className="space-y-4">
        <input type="email" value={(data.email as string) || ''} onChange={(e) => onChange({ ...data, email: e.target.value })} placeholder="Email To" className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg" />
        <input type="text" value={(data.subject as string) || ''} onChange={(e) => onChange({ ...data, subject: e.target.value })} placeholder="Subject" className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg" />
        <textarea value={(data.body as string) || ''} onChange={(e) => onChange({ ...data, body: e.target.value })} placeholder="Body" className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg h-32"></textarea>
      </div>
    );
  }

  if (type === 'sms') {
    return (
      <div className="space-y-4">
        <input type="tel" value={(data.phone as string) || ''} onChange={(e) => onChange({ ...data, phone: e.target.value })} placeholder="Phone Number" className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg" />
        <textarea value={(data.message as string) || ''} onChange={(e) => onChange({ ...data, message: e.target.value })} placeholder="Message" className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg h-32"></textarea>
      </div>
    );
  }

  if (type === 'phone') {
    return (
      <input type="tel" value={(data.phone as string) || ''} onChange={(e) => onChange({ ...data, phone: e.target.value })} placeholder="Phone Number" className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg" />
    );
  }

  if (type === 'crypto') {
    return (
      <div className="space-y-4">
        <select value={(data.cryptoType as string) || 'bitcoin'} onChange={(e) => onChange({ ...data, cryptoType: e.target.value })} className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg bg-white">
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="litecoin">Litecoin</option>
        </select>
        <input type="text" value={(data.address as string) || ''} onChange={(e) => onChange({ ...data, address: e.target.value })} placeholder="Wallet Address" className="w-full text-gray-900 px-4 py-3 border border-gray-300 rounded-lg" />
      </div>
    );
  }

  return null;
}
