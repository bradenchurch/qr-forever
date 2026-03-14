"use client";

import { useState, Suspense, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import QRCodeStyling from 'qr-code-styling';
import { useAuth } from '@/contexts/AuthContext';
import AccountModal from '@/components/AccountModal';
import PremiumBadge from './PremiumBadge';
import PremiumOverlay from './PremiumOverlay';
import QRCodeForm from './QRCodeForm';
import { buildQrValue } from './utils';

const QR_TYPES = [
  { id: 'url', label: 'URL', isPremium: false },
  { id: 'wifi', label: 'WiFi', isPremium: false },
  { id: 'vcard', label: 'vCard', isPremium: false },
  { id: 'email', label: 'Email', isPremium: false },
  { id: 'sms', label: 'SMS', isPremium: false },
  { id: 'phone', label: 'Phone', isPremium: false },
  { id: 'event', label: 'Event', isPremium: false },
  { id: 'crypto', label: 'Crypto', isPremium: true },
];

function GeneratorContent() {
  const { isPremium, isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialUrl = searchParams.get('url') || '';
  const editId = searchParams.get('id');

  const [qrType, setQrType] = useState('url');
  const [formData, setFormData] = useState<Record<string, unknown>>({ url: initialUrl });
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [qrValue, setQrValue] = useState(initialUrl);
  const [qrName, setQrName] = useState('My QR Code');

  // Customization state
  const [fgColor, setFgColor] = useState('#000000');
  const [isGradient, setIsGradient] = useState(false);
  const [fgGradientEnd, setFgGradientEnd] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState('');
  const [dotStyle, setDotStyle] = useState('square');
  const [markerStyle, setMarkerStyle] = useState('square');
  const [frame, setFrame] = useState('none');
  const [batchCsv, setBatchCsv] = useState<File | null>(null);

  // New customization states
  const [fgGradientRotation, setFgGradientRotation] = useState(45);
  const [logoSize, setLogoSize] = useState(0.4);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg' | 'jpeg'>('png');

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing QR if editing
  useEffect(() => {
    const fetchQr = async () => {
      if (!editId || !isLoggedIn) return;
      try {
        const response = await fetch(`/api/qr/${editId}`);
        if (response.ok) {
          const qr = await response.json();
          setQrName(qr.name);
          setQrType(qr.type);
          setFormData(JSON.parse(qr.formData));
          setQrValue(qr.content);

          const styling = JSON.parse(qr.styling);
          setFgColor(styling.fgColor || '#000000');
          setIsGradient(styling.isGradient || false);
          setFgGradientEnd(styling.fgGradientEnd || '#000000');
          setBgColor(styling.bgColor || '#ffffff');
          setLogoUrl(styling.logoUrl || '');
          setDotStyle(styling.dotStyle || 'square');
          setMarkerStyle(styling.markerStyle || 'square');
          setFrame(styling.frame || 'none');
          setFgGradientRotation(styling.fgGradientRotation || 45);
          setLogoSize(styling.logoSize || 0.4);
        }
      } catch (err) {
        console.error("Failed to fetch QR:", err);
      }
    };
    fetchQr();
  }, [editId, isLoggedIn]);

  const saveQrToHistory = async (value: string) => {
    if (!isLoggedIn) return;

    setIsSaving(true);
    try {
      const styling = {
        fgColor,
        isGradient,
        fgGradientEnd,
        bgColor,
        logoUrl,
        dotStyle,
        markerStyle,
        frame,
        fgGradientRotation,
        logoSize
      };

      const payload = {
        name: qrName,
        type: qrType,
        content: value,
        formData: JSON.stringify(formData),
        styling: JSON.stringify(styling)
      };

      let response;
      if (editId) {
        response = await fetch(`/api/qr/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('/api/qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        console.error("Failed to save QR to history");
      }
    } catch (err) {
      console.error("Error saving QR:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const generateQRCode = async () => {
    setError(null);

    const typeObj = QR_TYPES.find(t => t.id === qrType);
    if (typeObj?.isPremium && !isPremium) {
      setError('This is a Premium feature. Please upgrade to use it.');
      return;
    }

    const value = buildQrValue(qrType, formData);
    if (!value.trim()) {
      setError('Please fill in the required fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok && !isPremium) {
        setError(data.error || 'Failed to generate QR code');
        setQrValue('');
      } else {
        setQrValue(value);
        setCanvasReady(false);
        // Save to history automatically if logged in
        if (isLoggedIn) {
          await saveQrToHistory(value);
        }
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = buildQrValue(qrType, formData);
    if (!value.trim()) return;

    if (!isLoggedIn) {
      setShowAccountModal(true);
      return;
    }

    await generateQRCode();
  };

  const handleModalSuccess = async () => {
    setShowAccountModal(false);
    await generateQRCode();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      qrCodeRef.current = new QRCodeStyling({
        width: 220,
        height: 220,
        type: 'canvas',
        data: 'https://qrforever.com',
      });
    }
  }, []);

  useEffect(() => {
    if (!qrCodeRef.current || !qrRef.current) return;

    qrCodeRef.current.append(qrRef.current);
  }, []);

  useEffect(() => {
    if (!qrCodeRef.current) return;

    const usePremium = isPremium;

    qrCodeRef.current.update({
      data: qrValue || 'https://qrforever.com',
      width: 220,
      height: 220,
      image: usePremium && logoUrl ? logoUrl : undefined,
      dotsOptions: {
        type: (usePremium ? dotStyle : 'square') as import('qr-code-styling').DotType,
        color: usePremium && !isGradient ? fgColor : undefined,
        gradient: usePremium && isGradient ? {
          type: 'linear',
          rotation: (fgGradientRotation * Math.PI) / 180,
          colorStops: [
            { offset: 0, color: fgColor },
            { offset: 1, color: fgGradientEnd }
          ]
        } : undefined
      },
      backgroundOptions: {
        color: usePremium ? bgColor : '#ffffff',
      },
      cornersSquareOptions: {
        type: (usePremium ? markerStyle : 'square') as import('qr-code-styling').CornerSquareType,
        color: usePremium && !isGradient ? fgColor : undefined,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
        imageSize: logoSize,
      }
    });

    if (qrValue) {
      setCanvasReady(true);
    }
  }, [qrValue, isPremium, fgColor, isGradient, fgGradientEnd, bgColor, logoUrl, dotStyle, markerStyle, fgGradientRotation, logoSize]);

  const handleDownload = async () => {
    if (!qrCodeRef.current) return;
    
    // We need to render it at high res for download
    const exportQr = new QRCodeStyling({
      width: 1000,
      height: 1000,
      type: downloadFormat === 'svg' ? 'svg' : 'canvas',
      data: qrValue || 'https://qrforever.com',
      image: isPremium && logoUrl ? logoUrl : undefined,
      dotsOptions: {
        type: (isPremium ? dotStyle : 'square') as import('qr-code-styling').DotType,
        color: isPremium && !isGradient ? fgColor : undefined,
        gradient: isPremium && isGradient ? {
          type: 'linear',
          rotation: (fgGradientRotation * Math.PI) / 180,
          colorStops: [
            { offset: 0, color: fgColor },
            { offset: 1, color: fgGradientEnd }
          ]
        } : undefined
      },
      backgroundOptions: {
        color: isPremium ? bgColor : '#ffffff',
      },
      cornersSquareOptions: {
        type: (isPremium ? markerStyle : 'square') as import('qr-code-styling').CornerSquareType,
        color: isPremium && !isGradient ? fgColor : undefined,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 20,
        imageSize: logoSize,
      }
    });

    try {
      const extension = downloadFormat;
      const mimeType = extension === 'jpeg' ? 'image/jpeg' : (extension === 'svg' ? 'image/svg+xml' : 'image/png');
      const blob = await exportQr.getRawData(extension === 'jpeg' ? 'png' : extension);
      if (!blob) return;

      if (downloadFormat === 'svg') {
        let svgText = '';
        if (blob instanceof Blob) {
          svgText = await blob.text();
        } else {
          svgText = blob.toString();
        }

        // Add Frame if selected and premium
        if (isPremium && frame !== 'none') {
          let frameSvg = '';
          const frameColor = '#1f2937'; // dark gray
          if (frame === 'scan-me' || frame === 'phone') {
            frameSvg = `
              <g>
                <rect x="50" y="50" width="900" height="900" rx="40" fill="none" stroke="${frameColor}" stroke-width="24" />
                <rect x="350" y="35" width="300" height="60" fill="white" />
                <text x="500" y="80" font-family="Arial, sans-serif" font-size="40" font-weight="900" fill="${frameColor}" text-anchor="middle" letter-spacing="4">
                  ${frame === 'scan-me' ? 'SCAN ME' : 'CALL US'}
                </text>
              </g>
            `;
          } else if (frame === 'simple') {
            frameSvg = `<rect x="20" y="20" width="960" height="960" fill="none" stroke="#d1d5db" stroke-width="16" />`;
          } else if (frame === 'rounded') {
            frameSvg = `<rect x="20" y="20" width="960" height="960" rx="120" fill="none" stroke="#c7d2fe" stroke-width="20" />`;
          } else if (frame === 'fancy') {
            frameSvg = `<rect x="30" y="30" width="940" height="940" rx="60" fill="none" stroke="#f472b6" stroke-width="20" stroke-dasharray="20,10" />`;
          }
          // Wrap existing content in a group and scale/translate it to fit inside the frame
          svgText = svgText.replace('<svg ', '<svg overflow="visible" ');
          svgText = svgText.replace('>', '><g transform="translate(100, 100) scale(0.8)">');
          svgText = svgText.replace('</svg>', `</g>${frameSvg}</svg>`);
        }

        if (!isPremium) {
          // Inject SVG watermark
          const watermark = `
            <g transform="translate(500, 500)">
              <circle r="160" fill="white" fill-opacity="0.9" stroke="#e5e7eb" stroke-width="6" />
              <text y="-10" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#6b7280" text-anchor="middle">qrforever</text>
              <text y="30" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#6b7280" text-anchor="middle">.com</text>
            </g>
          `;
          svgText = svgText.replace('</svg>', `${watermark}</svg>`);
        }
        const finalBlob = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(finalBlob);
        const link = document.createElement('a');
        link.download = `qrcode.${extension}`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const originalData = e.target?.result as string;

        // Create a new canvas with watermark
        const newCanvas = document.createElement('canvas');
        newCanvas.width = 1000;
        newCanvas.height = 1000;
        const newCtx = newCanvas.getContext('2d');
        if (!newCtx) return;

        // Draw original QR
        const img = new Image();
        img.onload = () => {
          // Add Frame if selected and premium
          if (isPremium && frame !== 'none') {
            newCtx.strokeStyle = '#1f2937';
            if (frame === 'scan-me' || frame === 'phone') {
              newCtx.lineWidth = 24;
              newCtx.strokeRect(50, 50, 900, 900);

              newCtx.fillStyle = 'white';
              newCtx.fillRect(350, 35, 300, 60);

              newCtx.fillStyle = '#1f2937';
              newCtx.font = 'black 40px Arial, sans-serif';
              newCtx.textAlign = 'center';
              newCtx.fillText(frame === 'scan-me' ? 'SCAN ME' : 'CALL US', 500, 80);
            } else if (frame === 'simple') {
              newCtx.lineWidth = 16;
              newCtx.strokeStyle = '#d1d5db';
              newCtx.strokeRect(20, 20, 960, 960);
            } else if (frame === 'rounded') {
              newCtx.lineWidth = 20;
              newCtx.strokeStyle = '#c7d2fe';
              // Draw rounded rect
              newCtx.beginPath();
              newCtx.roundRect(20, 20, 960, 960, 120);
              newCtx.stroke();
            } else if (frame === 'fancy') {
              newCtx.lineWidth = 20;
              newCtx.strokeStyle = '#f472b6';
              newCtx.setLineDash([40, 20]);
              newCtx.strokeRect(30, 30, 940, 940);
              newCtx.setLineDash([]);
            }
          }

          newCtx.drawImage(img, isPremium && frame !== 'none' ? 100 : 0, isPremium && frame !== 'none' ? 100 : 0, isPremium && frame !== 'none' ? 800 : 1000, isPremium && frame !== 'none' ? 800 : 1000);

          if (!isPremium) {
            // Add watermark - semi-transparent white circle in center
            newCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            newCtx.beginPath();
            newCtx.arc(500, 500, 160, 0, 2 * Math.PI);
            newCtx.fill();

            // Border
            newCtx.strokeStyle = '#e5e7eb';
            newCtx.lineWidth = 6;
            newCtx.stroke();

            // Watermark text
            newCtx.fillStyle = '#6b7280';
            newCtx.font = 'bold 36px Arial, sans-serif';
            newCtx.textAlign = 'center';
            newCtx.fillText('qrforever', 500, 490);
            newCtx.font = 'bold 28px Arial, sans-serif';
            newCtx.fillText('.com', 500, 530);
          }

          // Download
          const link = document.createElement('a');
          link.download = `qrcode.${extension}`;
          link.href = newCanvas.toDataURL(mimeType, 0.9);
          link.click();
        };
        img.src = originalData;
      };
      const dataBlob = blob instanceof Blob ? blob : new Blob([blob as BlobPart]);
      reader.readAsDataURL(dataBlob);
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
        
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{editId ? 'Edit QR Code' : 'QR Code Generator'}</h1>
              {isLoggedIn && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={qrName}
                    onChange={(e) => setQrName(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium"
                    placeholder="QR Name"
                  />
                  {isSaving && <span className="text-xs text-gray-400">Saving...</span>}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {QR_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setQrType(type.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border flex items-center gap-1
                    ${qrType === type.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }
                  `}
                >
                  {type.label}
                  {type.isPremium && <PremiumBadge />}
                </button>
              ))}
            </div>

            <form onSubmit={handleGenerate} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <QRCodeForm type={qrType} data={formData} onChange={setFormData} />
              <button
                type="submit"
                className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Generating...' : (editId ? 'Update QR Code' : 'Generate QR Code')}
              </button>
            </form>

            <PremiumOverlay>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 border-b border-gray-100 pb-2">
                  Design Studio <PremiumBadge />
                </h3>

                {/* Colors Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Colors & Gradient</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Foreground</label>
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-full h-10 p-1 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full h-10 p-1 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isGradient"
                        checked={isGradient}
                        onChange={(e) => setIsGradient(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="isGradient" className="text-sm font-medium text-gray-700">Enable Gradient</label>
                    </div>

                    {isGradient && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gradient End</label>
                          <input
                            type="color"
                            value={fgGradientEnd}
                            onChange={(e) => setFgGradientEnd(e.target.value)}
                            className="w-full h-10 p-1 border border-gray-300 rounded-lg cursor-pointer bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rotation ({fgGradientRotation}°)</label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={fgGradientRotation}
                            onChange={(e) => setFgGradientRotation(parseInt(e.target.value))}
                            className="w-full h-10 accent-indigo-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shapes Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Shapes & Styles</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dot Style</label>
                      <select
                        value={dotStyle}
                        onChange={(e) => setDotStyle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="square">Square</option>
                        <option value="dots">Dots</option>
                        <option value="rounded">Rounded</option>
                        <option value="extra-rounded">Extra Rounded</option>
                        <option value="classy">Classy</option>
                        <option value="classy-rounded">Classy Rounded</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marker Style</label>
                      <select
                        value={markerStyle}
                        onChange={(e) => setMarkerStyle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="square">Square</option>
                        <option value="dot">Dot</option>
                        <option value="extra-rounded">Rounded</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Logo Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Logo & Branding</h4>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setLogoUrl(URL.createObjectURL(e.target.files[0]));
                        } else {
                          setLogoUrl('');
                        }
                      }}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100 cursor-pointer mb-3"
                    />
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-gray-500 whitespace-nowrap">Or URL:</span>
                      <input
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {logoUrl && (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo Size ({Math.round(logoSize * 100)}%)</label>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={logoSize}
                          onChange={(e) => setLogoSize(parseFloat(e.target.value))}
                          className="w-full h-10 accent-indigo-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Frame Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Frame Template</h4>
                  <div className="flex flex-wrap gap-2">
                    {['none', 'scan-me', 'phone', 'simple', 'rounded', 'fancy'].map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFrame(f)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize border transition-all ${
                          frame === f
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        {f.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </PremiumOverlay>

            <PremiumOverlay>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 mt-6">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  Batch Generation <PremiumBadge />
                </h3>
                <p className="text-sm text-gray-600">Upload a CSV to generate multiple QR codes at once.</p>
                <div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setBatchCsv(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>
                {batchCsv && (
                  <button
                    type="button"
                    onClick={() => {
                      alert("Batch generation started! (Simulated download)");
                    }}
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition"
                  >
                    Generate & Download All
                  </button>
                )}
              </div>
            </PremiumOverlay>

          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-center font-medium">
              {error}
            </div>
          )}
        </div>

        <div className="w-full md:w-80 flex flex-col items-center">
          <div className="sticky top-8 w-full flex flex-col items-center bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            {qrValue && !error ? (
              <>
                <div className="p-4 border-2 border-gray-100 rounded-2xl mb-6 bg-white shadow-inner">
                  <div className={`relative ${frame !== 'none' && isPremium ? 'p-4 flex flex-col items-center justify-center' : ''}
                    ${frame === 'scan-me' || frame === 'phone' ? 'border-[6px] rounded-xl border-gray-800' : ''}
                    ${frame === 'simple' ? 'border-4 border-gray-300' : ''}
                    ${frame === 'rounded' ? 'border-4 border-indigo-200 rounded-3xl' : ''}
                    ${frame === 'fancy' ? 'border-4 border-double border-pink-400 rounded-xl shadow-lg' : ''}
                  `}>
                    {(frame === 'scan-me' || frame === 'phone') && isPremium && (
                      <div className="absolute top-[-14px] bg-white px-2 font-black text-gray-800 uppercase tracking-widest text-sm">
                        {frame === 'scan-me' ? 'SCAN ME' : 'CALL US'}
                      </div>
                    )}
                    <div ref={qrRef} />
                  </div>
                </div>
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
                    {(['png', 'svg', 'jpeg'] as const).map((format) => (
                      <button
                        key={format}
                        onClick={() => setDownloadFormat(format)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all uppercase ${
                          downloadFormat === format
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleDownload}
                    disabled={!canvasReady}
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download {downloadFormat.toUpperCase()}
                  </button>
                  {isLoggedIn && (
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="w-full px-6 py-2 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 rounded-lg transition"
                    >
                      View in Dashboard
                    </button>
                  )}
                </div>
                {!isPremium && <p className="mt-3 text-xs text-gray-500 font-medium">Free downloads include watermark</p>}
              </>
            ) : (
              <div className="w-[220px] h-[220px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 font-medium mb-6">
                Preview Area
              </div>
            )}
          </div>
        </div>
      </div>
      <AccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSuccess={handleModalSuccess}
        title="Sign in to generate"
        message="Create a free account to generate and save your QR codes."
      />
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <GeneratorContent />
    </Suspense>
  );
}
