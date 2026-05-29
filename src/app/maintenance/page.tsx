"use client";

import React from 'react';
import { Wrench, Search, Paperclip, MessageSquare } from 'lucide-react';

const mockRepairs = [
  { id: 'RP-2569-001', asset: 'เครื่องพิมพ์เลเซอร์ HP LaserJet Pro', issue: 'กระดาษติดบ่อย และพิมพ์สีซีด', reporter: 'กองบริหารทั่วไป', date: '2026-05-27', urgency: 'สูง', status: 'pending' },
  { id: 'RP-2569-002', asset: 'แอร์ห้องประชุม 1', issue: 'แอร์ไม่เย็น มีน้ำหยด', reporter: 'ส่วนอาคารสถานที่', date: '2026-05-26', urgency: 'ปานกลาง', status: 'fixing' },
  { id: 'RP-2569-003', asset: 'จอคอมพิวเตอร์ Dell 24"', issue: 'เปิดไม่ติด หน้าจอมืด', reporter: 'กองสารสนเทศ', date: '2026-05-20', urgency: 'ต่ำ', status: 'completed' },
];

export default function MaintenancePage() {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-1 bg-danger/10 text-danger rounded-full text-xs font-medium border border-danger/20">รอรับเรื่อง</span>;
      case 'fixing': return <span className="px-2 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium border border-warning/20">กำลังซ่อม</span>;
      case 'completed': return <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium border border-success/20">ซ่อมเสร็จ/ปิดงาน</span>;
      default: return null;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch(urgency) {
      case 'สูง': return <span className="text-danger font-medium">{urgency}</span>;
      case 'ปานกลาง': return <span className="text-warning font-medium">{urgency}</span>;
      default: return <span className="text-gray-500">{urgency}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Wrench className="text-primary" /> ระบบแจ้งซ่อม (Maintenance)
        </h1>
        <button className="px-4 py-2 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors font-medium">
          + แจ้งซ่อมครุภัณฑ์
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาใบแจ้งซ่อม..." 
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select className="px-4 py-2 border rounded-md focus:outline-none dark:bg-slate-900 dark:border-slate-700">
              <option>สถานะทั้งหมด</option>
              <option>รอรับเรื่อง</option>
              <option>กำลังซ่อม</option>
              <option>ซ่อมเสร็จ</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRepairs.map((repair) => (
            <div key={repair.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-slate-900 dark:border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                  {repair.id}
                </span>
                {getStatusBadge(repair.status)}
              </div>
              <h3 className="font-bold text-lg text-foreground mt-2 line-clamp-1" title={repair.asset}>{repair.asset}</h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2 dark:text-gray-400">{repair.issue}</p>
              
              <div className="mt-4 pt-4 border-t dark:border-slate-700 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">หน่วยงานแจ้ง:</span>
                  <span className="font-medium">{repair.reporter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ความเร่งด่วน:</span>
                  <span>{getUrgencyBadge(repair.urgency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">วันที่แจ้ง:</span>
                  <span>{new Date(repair.date).toLocaleDateString('th-TH')}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 py-1.5 border rounded text-sm hover:bg-gray-50 flex items-center justify-center gap-1 dark:border-slate-600 dark:hover:bg-slate-800">
                  <MessageSquare size={14} /> อัปเดตงาน
                </button>
                <button className="py-1.5 px-3 border rounded text-sm hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-800" title="ไฟล์แนบ (รูปภาพ/วิดีโอ)">
                  <Paperclip size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
