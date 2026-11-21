'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Plus, 
  Download, 
  Printer, 
  ExternalLink, 
  Users, 
  CheckCircle, 
  Eye, 
  X 
} from 'lucide-react';
import { ICafeTable } from '@/types';
import { dataStore, defaultCafe } from '@/lib/store';

export const QRCodeManagementTab: React.FC = () => {
  const [tables, setTables] = useState<ICafeTable[]>([]);
  const [newTableNum, setNewTableNum] = useState('');
  const [newCapacity, setNewCapacity] = useState(4);
  const [baseUrl, setBaseUrl] = useState('https://shawarmapalace.com');
  const [qrCodeDataUrls, setQrCodeDataUrls] = useState<Record<string, string>>({});
  const [selectedTableForPrint, setSelectedTableForPrint] = useState<ICafeTable | null>(null);

  const loadTables = async () => {
    try {
      const res = await fetch('/api/tables?cafe=cafe001', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.tables && Array.isArray(json.tables)) {
          setTables(json.tables);
          return;
        }
      }
    } catch (err) {
      console.warn('Tables fetch error:', err);
    }
    const list = dataStore.getTables('cafe001');
    setTables([...list]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
    loadTables();
  }, []);

  // Generate QR codes for all tables
  useEffect(() => {
    const generateAll = async () => {
      const map: Record<string, string> = {};
      for (const t of tables) {
        const targetUrl = `${baseUrl}/menu?cafe=cafe001&table=${t.table_number}`;
        try {
          const url = await QRCode.toDataURL(targetUrl, {
            width: 400,
            margin: 2,
            color: {
              dark: '#1e120c',
              light: '#ffffff',
            },
          });
          map[t.table_number] = url;
        } catch (err) {
          console.error('QR generation error for table:', t.table_number, err);
        }
      }
      setQrCodeDataUrls(map);
    };

    if (tables.length > 0) {
      generateAll();
    }
  }, [tables, baseUrl]);

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNum) return;

    try {
      await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: newTableNum,
          capacity: Number(newCapacity),
          cafe_id: 'cafe001',
        }),
      });
    } catch (err) {
      console.warn('Table add API error:', err);
    }

    dataStore.addTable(newTableNum, Number(newCapacity), 'cafe001');
    setNewTableNum('');
    loadTables();
  };

  const downloadQR = (tableNum: string) => {
    const dataUrl = qrCodeDataUrls[tableNum];
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `QR-Table-${tableNum}-${defaultCafe.slug}.png`;
    link.href = dataUrl;
    link.click();
  };

  const openPrintModal = (table: ICafeTable) => {
    setSelectedTableForPrint(table);
  };

  return (
    <div className="space-y-6">
      {/* HEADER & ADD TABLE BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-coffee-950">
            Table QR Code Generator & Stands
          </h2>
          <p className="text-xs text-coffee-600">
            Each table has a dedicated URL and high-resolution QR code that auto-locks the dining session.
          </p>
        </div>

        {/* Add Table Form */}
        <form onSubmit={handleAddTable} className="flex items-center gap-2">
          <input
            type="text"
            required
            placeholder="e.g. T11"
            value={newTableNum}
            onChange={(e) => setNewTableNum(e.target.value)}
            className="w-24 rounded-xl border border-coffee-300 bg-white px-3 py-2 text-xs text-coffee-950 font-bold uppercase focus:border-amberGold focus:outline-none shadow-sm"
          />
          <select
            value={newCapacity}
            onChange={(e) => setNewCapacity(Number(e.target.value))}
            className="rounded-xl border border-coffee-300 bg-white px-2 py-2 text-xs text-coffee-950 focus:border-amberGold focus:outline-none shadow-sm"
          >
            <option value={2}>2 Persons</option>
            <option value={4}>4 Persons</option>
            <option value={6}>6 Persons</option>
            <option value={8}>8 Persons</option>
          </select>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-coffee-950 px-4 py-2 text-xs font-bold text-cream-100 hover:bg-amberGold transition shadow"
          >
            <Plus className="h-4 w-4" />
            <span>Add Table</span>
          </button>
        </form>
      </div>

      {/* TABLES QR GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {tables.map((table) => {
          const qrUrl = qrCodeDataUrls[table.table_number];
          const targetUrl = `${baseUrl}/menu?cafe=cafe001&table=${table.table_number}`;

          return (
            <div
              key={table.id}
              className="flex flex-col justify-between rounded-2xl border border-coffee-200/80 bg-white p-4 shadow-soft transition-all hover:shadow-premium"
            >
              <div>
                {/* Table Header */}
                <div className="flex items-center justify-between pb-3 border-b border-coffee-100">
                  <div className="flex items-center gap-2">
                    <span className="rounded-xl bg-coffee-950 px-3 py-1 text-xs font-extrabold text-cream-100 shadow-xs">
                      Table {table.table_number}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-coffee-600 font-medium">
                      <Users className="h-3.5 w-3.5 text-coffee-400" />
                      {table.capacity} Seats
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      table.status === 'occupied'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {table.status}
                  </span>
                </div>

                {/* Scannable QR Code Canvas / Image */}
                <div className="py-4 flex flex-col items-center justify-center">
                  <div className="relative h-44 w-44 rounded-xl border-2 border-dashed border-coffee-300 p-2 bg-cream-50/50 shadow-inner flex items-center justify-center">
                    {qrUrl ? (
                      <img
                        src={qrUrl}
                        alt={`QR Code Table ${table.table_number}`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-coffee-400 text-xs">
                        <QrCode className="h-8 w-8 animate-pulse" />
                        <span>Generating QR...</span>
                      </div>
                    )}
                  </div>

                  {/* Scannable Target URL */}
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 text-[10px] text-coffee-500 font-mono flex items-center gap-1 hover:text-amberGold truncate max-w-full"
                    title={targetUrl}
                  >
                    <span>/menu?table={table.table_number}</span>
                    <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-coffee-100 pt-3 flex items-center gap-2">
                <button
                  onClick={() => downloadQR(table.table_number)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-coffee-200 bg-coffee-50 py-2 text-xs font-bold text-coffee-800 hover:bg-coffee-100 transition"
                  title="Download PNG for printing"
                >
                  <Download className="h-3.5 w-3.5 text-coffee-600" />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => openPrintModal(table)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-coffee-950 py-2 text-xs font-bold text-cream-100 hover:bg-amberGold transition shadow-xs"
                  title="Print Table Tent Card"
                >
                  <Printer className="h-3.5 w-3.5 text-amberGold" />
                  <span>Print Stand</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PRINTABLE TABLE TENT CARD MODAL */}
      {selectedTableForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 print:p-0 print:bg-white print:fixed print:inset-0 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl border border-coffee-200 text-center space-y-6 print:shadow-none print:w-full print:border-none">
            
            {/* Close button (Hidden during print) */}
            <button
              onClick={() => setSelectedTableForPrint(null)}
              className="absolute top-4 right-4 print:hidden rounded-full bg-coffee-100 p-2 text-coffee-600 hover:bg-coffee-200 transition"
            >
              <X className="h-4 w-4" />
            </button>

            {/* TENT CARD CONTENT */}
            <div className="border-4 border-double border-coffee-900 rounded-3xl p-6 bg-cream-50/60 space-y-4">
              {/* Brand Logo & Name */}
              <div className="space-y-1">
                <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-2xl border-2 border-amberGold shadow-md">
                  <Image
                    src="/images/cafe/logo_3d.jpeg"
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-serif text-2xl font-extrabold text-coffee-950 pt-1">
                  {defaultCafe.name}
                </h3>
                <p className="text-xs text-amberGold-hover font-semibold">
                  {defaultCafe.tagline}
                </p>
              </div>

              {/* Table Pill */}
              <div className="inline-block rounded-xl bg-coffee-950 px-6 py-2 text-sm font-extrabold text-cream-100 uppercase tracking-widest shadow">
                DINING TABLE {selectedTableForPrint.table_number}
              </div>

              {/* Large High-Res QR Code */}
              <div className="mx-auto h-52 w-52 rounded-2xl border-2 border-coffee-900 bg-white p-3 shadow-md">
                {qrCodeDataUrls[selectedTableForPrint.table_number] && (
                  <img
                    src={qrCodeDataUrls[selectedTableForPrint.table_number]}
                    alt={`Table ${selectedTableForPrint.table_number} QR Code`}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>

              {/* Simple 3-Step Instruction */}
              <div className="space-y-1.5 pt-1 text-left bg-white p-3.5 rounded-xl border border-coffee-200 text-xs text-coffee-800">
                <p className="font-bold text-center text-coffee-950 uppercase text-[11px] tracking-wider mb-1">
                  Scan to Order Without Waiting
                </p>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amberGold text-[10px] font-bold text-white shrink-0">1</span>
                  <span>Point your smartphone camera at the QR code</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amberGold text-[10px] font-bold text-white shrink-0">2</span>
                  <span>Select fresh dishes from our digital menu</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amberGold text-[10px] font-bold text-white shrink-0">3</span>
                  <span>Tap "Place Order" — served straight to your table!</span>
                </div>
              </div>

              <p className="text-[10px] text-coffee-500 font-medium">
                Free High-Speed Cafe Wi-Fi Available
              </p>
            </div>

            {/* Print & Close Controls (Hidden when printing) */}
            <div className="flex gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-coffee-950 py-3 text-xs font-bold text-cream-100 hover:bg-amberGold transition shadow"
              >
                <Printer className="h-4 w-4 text-amberGold" />
                <span>Print Table Stand Now</span>
              </button>
              <button
                onClick={() => setSelectedTableForPrint(null)}
                className="rounded-xl border border-coffee-300 px-5 py-3 text-xs font-bold text-coffee-700 hover:bg-coffee-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
