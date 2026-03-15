"use client";

import { useState } from 'react';

interface BatchFormProps {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
}

export default function BatchForm({ data, onChange }: BatchFormProps) {
  const urls = (data.urls as string[]) || [];
  const [isDragging, setIsDragging] = useState(false);

  const [manualValue, setManualValue] = useState(urls.join('\n'));

  const handleManualChange = (val: string) => {
    setManualValue(val);
    const lines = val.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    onChange({ ...data, urls: lines });
  };

  const processFile = async (file: File) => {
    try {
      const text = await file.text();
      // Split by newline or comma
      const lines = text.split(/[\r\n,]+/).map(l => l.trim()).filter(l => l.length > 0);
      onChange({ ...data, urls: lines });
    } catch (err) {
      console.error("Error reading file", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-colors text-center ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'
        }`}
      >
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-indigo-600">Upload a CSV file</span> or drag and drop
          </div>
          <p className="text-xs text-gray-500">CSV or TXT (one URL per line or comma-separated)</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Or enter URLs manually (one per line)</label>
        <textarea
          value={manualValue}
          onChange={(e) => handleManualChange(e.target.value)}
          placeholder="https://example.com&#10;https://google.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg h-32 font-mono text-sm"
        />
      </div>

      {urls.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Preview ({urls.length} URLs)</h4>
            <button
              type="button"
              onClick={() => onChange({ ...data, urls: [] })}
              className="text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg max-h-40 overflow-y-auto p-3">
            <ul className="space-y-1">
              {urls.slice(0, 50).map((url, i) => (
                <li key={i} className="text-xs text-gray-600 truncate font-mono">
                  {i + 1}. {url}
                </li>
              ))}
              {urls.length > 50 && (
                <li className="text-xs text-gray-400 italic">... and {urls.length - 50} more</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
