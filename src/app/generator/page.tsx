"use client";

import { useState, Suspense, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '@/contexts/AuthContext';
import AccountModal from '@/components/AccountModal';

function GeneratorContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url') || '';
  const [url, setUrl] = useState(initialUrl);
  const { isLoggedIn } = useAuth();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [qrValue, setQrValue] = useState(initialUrl);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    setError(null);
    if (!url.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate QR code');
        setQrValue('');
      } else {
        setQrValue(url);
        setCanvasReady(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

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
    if (qrValue && canvasRef.current) {
      const timer = setTimeout(() => setCanvasReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [qrValue]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get the original QR data
    const originalData = canvas.toDataURL('image/png');
    
    // Create a new canvas with watermark
    const newCanvas = document.createElement('canvas');
    newCanvas.width = 500;
    newCanvas.height = 500;
    const newCtx = newCanvas.getContext('2d');
    if (!newCtx) return;
    
    // Draw original QR
    const img = new Image();
    img.onload = () => {
      newCtx.drawImage(img, 0, 0, 500, 500);
      
      // Add watermark - semi-transparent white circle in center
      newCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      newCtx.beginPath();
      newCtx.arc(250, 250, 80, 0, 2 * Math.PI);
      newCtx.fill();
      
      // Border
      newCtx.strokeStyle = '#e5e7eb';
      newCtx.lineWidth = 3;
      newCtx.stroke();
      
      // Watermark text
      newCtx.fillStyle = '#6b7280';
      newCtx.font = 'bold 18px Arial, sans-serif';
      newCtx.textAlign = 'center';
      newCtx.fillText('qrforever', 250, 245);
      newCtx.font = 'bold 14px Arial, sans-serif';
      newCtx.fillText('.com', 250, 265);
      
      // Download
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = newCanvas.toDataURL('image/png');
      link.click();
    };
    img.src = originalData;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">QR Code Generator</h1>
        
        <form onSubmit={handleGenerate} className="flex gap-3 mb-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
            disabled={loading}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-center">
            {error}
          </div>
        )}
        
        {qrValue && !error && (
          <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg">
            <div className="p-4 border-2 border-gray-100 rounded-xl mb-4">
              <QRCodeSVG 
                value={qrValue} 
                size={250} 
                level="H" 
                includeMargin
              />
            </div>
            <div style={{ position: 'absolute', left: '-9999px' }}>
              <QRCodeCanvas
                ref={canvasRef}
                value={qrValue}
                size={500}
                level="H"
                includeMargin
              />
            </div>
            <button
              onClick={handleDownload}
              disabled={!canvasReady}
              className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              Download PNG (watermarked)
            </button>
            <p className="mt-2 text-xs text-gray-500">Free downloads include watermark</p>
          </div>
        )}
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
