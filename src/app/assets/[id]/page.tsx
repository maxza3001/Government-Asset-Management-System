"use client";

import React from 'react';
import { ArrowLeft, Printer, Download, MapPin, Image as ImageIcon, History, FileText, Wrench } from 'lucide-react';
import Link from 'next/link';
import { mockAssets } from '@/data/mockData';
import { useParams } from 'next/navigation';

export default function AssetDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const asset = mockAssets.find((item) => item.id === id || item.assetCode === id) ?? mockAssets[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/assets" className="p-2 bg-white rounded-md border text-gray-500 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">รายละเอียดครุภัณฑ์</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700">
            <Printer size={18} />
            <span className="hidden sm:inline">พิมพ์ Label</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            <Wrench size={18} />
            <span className="hidden sm:inline">แจ้งซ่อม</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-sm text-primary font-medium mb-1">{asset.assetCode}</div>
                <h2 className="text-xl font-bold text-foreground">{asset.name}</h2>
                <div className="text-sm text-gray-500 mt-1 dark:text-gray-400">{asset.brand} {asset.model}</div>
              </div>
              <span className="px-3 py-1.5 bg-success/10 text-success rounded-full text-sm font-medium border border-success/20">
                ใช้งานปกติ
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 pt-4 border-t dark:border-slate-700">
              <div>
                <div className="text-xs text-gray-500 mb-1 dark:text-gray-400">หมวดหมู่</div>
                <div className="font-medium text-foreground">{asset.category}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1 dark:text-gray-400">หมายเลขเครื่อง (S/N)</div>
                <div className="font-medium text-foreground">{asset.serialNumber}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1 dark:text-gray-400">ราคาจัดซื้อ</div>
                <div className="font-medium text-foreground">฿{asset.price.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1 dark:text-gray-400">วันที่ตรวจรับ</div>
                <div className="font-medium text-foreground">{new Date(asset.purchaseDate).toLocaleDateString('th-TH')}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1 dark:text-gray-400">หน่วยงานที่รับผิดชอบ</div>
                <div className="font-medium text-foreground">{asset.department}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1 dark:text-gray-400">ผู้ถือครอง/รับผิดชอบ</div>
                <div className="font-medium text-foreground">นายสมชาย ใจดี</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
              <History className="text-primary" size={20} />
              ประวัติการทำรายการ (Timeline)
            </h3>
            
            <div className="space-y-4">
              <div className="relative pl-6 pb-4 border-l-2 border-primary/20 last:border-0 last:pb-0">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-slate-800"></div>
                <div className="text-sm font-medium text-foreground">ย้ายแผนกรับผิดชอบ</div>
                <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">20 พฤษภาคม 2569 10:30 น.</div>
                <div className="text-sm mt-2 text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100 dark:bg-slate-900/50 dark:border-slate-700 dark:text-gray-300">
                  ย้ายจาก <span className="font-medium">กองบริหารทั่วไป</span> ไปยัง <span className="font-medium">กองสารสนเทศ</span>
                </div>
              </div>
              <div className="relative pl-6 pb-4 border-l-2 border-primary/20 last:border-0 last:pb-0">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-warning border-4 border-white dark:border-slate-800"></div>
                <div className="text-sm font-medium text-foreground">แจ้งซ่อม (บำรุงรักษา)</div>
                <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">15 มกราคม 2569 14:15 น.</div>
                <div className="text-sm mt-2 text-gray-600 dark:text-gray-400">ทำความสะอาดและอัปเดตระบบปฏิบัติการ (เสร็จสิ้น)</div>
              </div>
              <div className="relative pl-6 pb-4 border-l-2 border-primary/20 last:border-0 last:pb-0">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-success border-4 border-white dark:border-slate-800"></div>
                <div className="text-sm font-medium text-foreground">ลงทะเบียนรับเข้าใหม่</div>
                <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">10 พฤษภาคม 2566 09:00 น.</div>
                <div className="text-sm mt-2 text-gray-600 dark:text-gray-400">รับเข้าจากโครงการจัดซื้อคอมพิวเตอร์ ปีงบประมาณ 2566</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
          {/* QR Code */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center dark:bg-slate-800 dark:border-slate-700">
            <h3 className="text-sm font-semibold mb-4 w-full text-left text-foreground">QR Code & Barcode</h3>
            <div className="w-40 h-40 bg-white border border-gray-200 p-2 rounded-lg flex items-center justify-center mb-4">
              {/* Mock QR Code Image using standard SVG */}
              <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="white"/>
                <path d="M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z" fill="black"/>
                <path d="M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z" fill="black"/>
                <path d="M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z" fill="black"/>
                <rect x="40" y="10" width="20" height="10" fill="black"/>
                <rect x="10" y="40" width="30" height="20" fill="black"/>
                <rect x="50" y="40" width="40" height="10" fill="black"/>
                <rect x="40" y="60" width="10" height="30" fill="black"/>
                <rect x="70" y="60" width="20" height="30" fill="black"/>
                <rect x="60" y="80" width="10" height="10" fill="black"/>
              </svg>
            </div>
            <div className="text-xs font-mono text-center mb-2 bg-gray-100 px-3 py-1 rounded dark:bg-slate-900 dark:text-gray-300">
              {asset.assetCode}
            </div>
            <button className="text-sm text-primary hover:underline mt-2">ดาวน์โหลดรูปภาพ</button>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-foreground">
              <MapPin size={16} className="text-gray-400" />
              ตำแหน่งที่ตั้ง (Location)
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1 dark:text-gray-400">อาคาร/สถานที่</div>
                <div className="font-medium text-sm text-foreground">อาคารศูนย์ราชการ (ทิศใต้)</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1 dark:text-gray-400">ชั้น</div>
                  <div className="font-medium text-sm text-foreground">ชั้น 5</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 dark:text-gray-400">ห้อง</div>
                  <div className="font-medium text-sm text-foreground">501-A</div>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700">
              ดูบนแผนที่
            </button>
          </div>

          {/* Attachments */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-foreground">
              <FileText size={16} className="text-gray-400" />
              เอกสารแนบ
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md border border-transparent hover:border-gray-100 transition-colors dark:hover:bg-slate-900 dark:hover:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-600 rounded">
                    <FileText size={14} />
                  </div>
                  <span className="text-sm truncate w-32 dark:text-gray-300">ใบเสร็จรับเงิน.pdf</span>
                </div>
                <button className="text-gray-400 hover:text-primary"><Download size={14} /></button>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md border border-transparent hover:border-gray-100 transition-colors dark:hover:bg-slate-900 dark:hover:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 text-green-600 rounded">
                    <ImageIcon size={14} />
                  </div>
                  <span className="text-sm truncate w-32 dark:text-gray-300">รูปถ่ายตอนรับมอบ.jpg</span>
                </div>
                <button className="text-gray-400 hover:text-primary"><Download size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
