"use client";

import React, { useState } from 'react';
import { mockAssets } from '@/data/mockData';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssets = mockAssets.filter(asset => 
    asset.name.includes(searchTerm) || 
    asset.assetCode.includes(searchTerm) ||
    asset.department.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'normal': return <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">ปกติ</span>;
      case 'repair': return <span className="px-2 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium">รอซ่อม</span>;
      case 'broken': return <span className="px-2 py-1 bg-danger/10 text-danger rounded-full text-xs font-medium">ชำรุด</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">ไม่ระบุ</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">ทะเบียนครุภัณฑ์</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          <Plus size={18} />
          <span>เพิ่มครุภัณฑ์ใหม่</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between dark:bg-slate-800 dark:border-slate-700">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหา ชื่อ, รหัสครุภัณฑ์, หน่วยงาน..." 
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 text-gray-700 w-full md:w-auto justify-center dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700">
          <Filter size={18} />
          <span>ตัวกรอง</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b dark:bg-slate-900/50 dark:text-gray-400 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">รหัสครุภัณฑ์</th>
                <th className="px-4 py-3">รายการ</th>
                <th className="px-4 py-3">หมวดหมู่</th>
                <th className="px-4 py-3">หน่วยงานที่รับผิดชอบ</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 font-medium text-foreground">{asset.assetCode}</td>
                    <td className="px-4 py-3">
                      <div>{asset.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{asset.brand} {asset.model}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{asset.category}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{asset.department}</td>
                    <td className="px-4 py-3">{getStatusBadge(asset.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/assets/${asset.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md inline-block" title="ดูรายละเอียด">
                          <Eye size={16} />
                        </Link>
                        <button className="p-1.5 text-warning hover:bg-warning/10 rounded-md" title="แก้ไข">
                          <Edit size={16} />
                        </button>
                        <button className="p-1.5 text-danger hover:bg-danger/10 rounded-md" title="ลบ">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    ไม่พบข้อมูลครุภัณฑ์
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500 dark:border-slate-700 dark:text-gray-400">
          <div>แสดง {filteredAssets.length} จาก {mockAssets.length} รายการ</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700">ก่อนหน้า</button>
            <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md">1</button>
            <button className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700">ถัดไป</button>
          </div>
        </div>
      </div>
    </div>
  );
}
