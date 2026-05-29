"use client";

import React from 'react';
import { ArrowLeftRight, Check, X, Search, FileText } from 'lucide-react';

const mockBorrows = [
  { id: 'BW-2569-001', asset: 'คอมพิวเตอร์โน้ตบุ๊ก Dell Latitude', borrower: 'นายสมปอง งานดี', department: 'กองสารสนเทศ', startDate: '2026-05-25', endDate: '2026-06-01', status: 'pending' },
  { id: 'BW-2569-002', asset: 'โปรเจคเตอร์ Epson', borrower: 'นางสาวสุดใจ นำเสนอ', department: 'กองนโยบาย', startDate: '2026-05-20', endDate: '2026-05-22', status: 'returned' },
  { id: 'BW-2569-003', asset: 'กล้อง DSLR Canon', borrower: 'นายถ่ายรูป สวยงาม', department: 'ประชาสัมพันธ์', startDate: '2026-05-15', endDate: '2026-05-18', status: 'overdue' },
];

export default function BorrowsPage() {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium border border-warning/20">รออนุมัติ</span>;
      case 'approved': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">กำลังยืม</span>;
      case 'returned': return <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium border border-success/20">คืนแล้ว</span>;
      case 'overdue': return <span className="px-2 py-1 bg-danger/10 text-danger rounded-full text-xs font-medium border border-danger/20">เลยกำหนดคืน</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ArrowLeftRight className="text-primary" /> ระบบยืม-คืนครุภัณฑ์
        </h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
          + สร้างรายการยืมใหม่
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหารายการ, ชื่อผู้ยืม..." 
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select className="px-4 py-2 border rounded-md focus:outline-none dark:bg-slate-900 dark:border-slate-700 w-full md:w-auto">
              <option>สถานะทั้งหมด</option>
              <option>รออนุมัติ</option>
              <option>กำลังยืม</option>
              <option>คืนแล้ว</option>
              <option>เลยกำหนด</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b dark:bg-slate-900/50 dark:text-gray-400 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">เลขที่ใบยืม</th>
                <th className="px-4 py-3">รายการครุภัณฑ์</th>
                <th className="px-4 py-3">ผู้ยืม / หน่วยงาน</th>
                <th className="px-4 py-3">วันที่ยืม - วันที่คืน</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {mockBorrows.map((borrow) => (
                <tr key={borrow.id} className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3 font-medium text-primary dark:text-blue-400">{borrow.id}</td>
                  <td className="px-4 py-3 text-foreground">{borrow.asset}</td>
                  <td className="px-4 py-3">
                    <div className="text-foreground">{borrow.borrower}</div>
                    <div className="text-xs text-gray-500">{borrow.department}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-foreground">{new Date(borrow.startDate).toLocaleDateString('th-TH')} -</div>
                    <div className={borrow.status === 'overdue' ? 'text-danger font-medium' : 'text-gray-500'}>
                      {new Date(borrow.endDate).toLocaleDateString('th-TH')}
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(borrow.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md" title="ดูเอกสาร">
                        <FileText size={16} />
                      </button>
                      {borrow.status === 'pending' && (
                        <>
                          <button className="p-1.5 text-success hover:bg-success/10 rounded-md" title="อนุมัติ">
                            <Check size={16} />
                          </button>
                          <button className="p-1.5 text-danger hover:bg-danger/10 rounded-md" title="ปฏิเสธ">
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
