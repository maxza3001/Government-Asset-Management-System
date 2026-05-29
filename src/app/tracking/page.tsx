"use client";

import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { MapPin, Search, Scan, Info, AlertTriangle } from 'lucide-react';
import { mockAssets } from '@/data/mockData';

export default function TrackingPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    
    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      
      scanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          setIsScanning(false);
          if (scanner) {
            scanner.clear();
          }
        },
        () => {
          // ignore scan errors (they happen constantly during scanning)
        }
      );
    }
    
    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.error("Failed to clear scanner", e));
      }
    };
  }, [isScanning]);

  const scannedAsset = scanResult 
    ? mockAssets.find(a => a.assetCode === scanResult || a.id === scanResult)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">ระบบติดตามครุภัณฑ์ (Smart Tracking)</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Scan size={24} />
            </div>
            <h2 className="text-xl font-semibold">สแกนบาร์โค้ด / QR Code</h2>
          </div>
          
          <div className="flex flex-col items-center">
            {isScanning ? (
              <div id="reader" className="w-full max-w-sm rounded-lg overflow-hidden border-2 border-primary/20"></div>
            ) : (
              <div className="w-full text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 dark:bg-slate-900 dark:border-slate-700">
                <Scan size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4 dark:text-gray-400">กดปุ่มด้านล่างเพื่อเปิดกล้องสแกนบาร์โค้ด</p>
                <button 
                  onClick={() => setIsScanning(true)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                >
                  เริ่มสแกน
                </button>
              </div>
            )}
            
            <div className="w-full mt-6 flex items-center gap-4">
              <div className="h-px bg-gray-200 flex-1 dark:bg-slate-700"></div>
              <span className="text-sm text-gray-400">หรือค้นหาด้วยรหัส</span>
              <div className="h-px bg-gray-200 flex-1 dark:bg-slate-700"></div>
            </div>
            
            <div className="w-full mt-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="กรอกรหัสครุภัณฑ์เพื่อค้นหา (เช่น 7440-001-0001)" 
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                onChange={(e) => {
                  if (e.target.value.length > 5) setScanResult(e.target.value);
                  else if (e.target.value === '') setScanResult(null);
                }}
              />
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full dark:bg-slate-800 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Info className="text-primary" size={24} /> 
            ผลการตรวจสอบ
          </h2>
          
          {scanResult ? (
            scannedAsset ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 bg-success rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                  <div>
                    <h3 className="font-bold text-success text-lg">พบข้อมูลครุภัณฑ์</h3>
                    <p className="text-sm text-success/80">ระบบได้ทำการตรวจสอบข้อมูลเรียบร้อยแล้ว</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-4 border-b dark:border-slate-700">
                  <div className="col-span-1 text-gray-500 text-sm">รหัสครุภัณฑ์:</div>
                  <div className="col-span-2 font-medium">{scannedAsset.assetCode}</div>
                  
                  <div className="col-span-1 text-gray-500 text-sm">ชื่อรายการ:</div>
                  <div className="col-span-2 font-medium text-primary dark:text-blue-400">{scannedAsset.name}</div>
                  
                  <div className="col-span-1 text-gray-500 text-sm">ผู้ถือครอง:</div>
                  <div className="col-span-2 font-medium">{scannedAsset.department}</div>
                  
                  <div className="col-span-1 text-gray-500 text-sm">สถานะ:</div>
                  <div className="col-span-2">
                    <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                      ใช้งานปกติ
                    </span>
                  </div>
                </div>
                
                <div className="pt-2 flex gap-3">
                  <button className="flex-1 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors text-sm font-medium dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">
                    ดูประวัติการย้าย
                  </button>
                  <button className="flex-1 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors text-sm font-medium">
                    อัปเดตตำแหน่ง
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <AlertTriangle size={48} className="text-warning mb-4" />
                <p className="font-medium text-lg text-foreground mb-1">ไม่พบข้อมูลครุภัณฑ์</p>
                <p className="text-sm mb-4">รหัส {scanResult} ไม่มีในระบบ หรืออาจพิมพ์ผิด</p>
                <button 
                  onClick={() => setScanResult(null)}
                  className="px-4 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  ค้นหาใหม่
                </button>
              </div>
            )
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-400 dark:text-gray-500">
              <MapPin size={48} className="mb-4 opacity-50" />
              <p>โปรดสแกนบาร์โค้ดหรือค้นหารหัสครุภัณฑ์</p>
              <p className="text-sm">เพื่อดูข้อมูลรายละเอียดและตำแหน่งล่าสุด</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
