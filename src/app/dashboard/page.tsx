"use client";

import React from 'react';
import { 
  Package, 
  Wrench, 
  AlertTriangle, 
  Ban, 
  Wallet
} from 'lucide-react';
import { mockDashboardStats, mockActivities } from '@/data/mockData';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statusData = [
  { name: 'ปกติ', value: mockDashboardStats.normal, color: '#10b981' },
  { name: 'รอซ่อม', value: mockDashboardStats.repair, color: '#f59e0b' },
  { name: 'ชำรุด', value: mockDashboardStats.broken, color: '#ef4444' },
  { name: 'สูญหาย', value: mockDashboardStats.lost, color: '#6b7280' },
];

const budgetData = [
  { year: '2565', amount: 35000000 },
  { year: '2566', amount: 38000000 },
  { year: '2567', amount: 42000000 },
  { year: '2568', amount: 45000000 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">ภาพรวมระบบ (Executive Dashboard)</h1>
        <div className="text-sm text-secondary-foreground bg-white px-3 py-1 rounded-md border shadow-sm dark:bg-slate-800 dark:border-slate-700">
          ข้อมูล ณ วันที่: {new Date().toLocaleDateString('th-TH')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">ครุภัณฑ์ทั้งหมด</p>
              <h3 className="text-2xl font-bold mt-1 text-primary">{mockDashboardStats.total.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Package size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">รอซ่อม</p>
              <h3 className="text-2xl font-bold mt-1 text-warning">{mockDashboardStats.repair.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-warning/10 text-warning rounded-lg">
              <Wrench size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">ชำรุดรอจำหน่าย</p>
              <h3 className="text-2xl font-bold mt-1 text-danger">{mockDashboardStats.broken.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-danger/10 text-danger rounded-lg">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">สูญหาย</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-600 dark:text-gray-400">{mockDashboardStats.lost.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-300">
              <Ban size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">มูลค่ารวม (บาท)</p>
              <h3 className="text-2xl font-bold mt-1 text-success">{(mockDashboardStats.totalBudget / 1000000).toFixed(1)}M</h3>
            </div>
            <div className="p-2 bg-success/10 text-success rounded-lg">
              <Wallet size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 lg:col-span-1 dark:bg-slate-800 dark:border-slate-700">
          <h2 className="text-lg font-semibold mb-4 text-foreground">สัดส่วนสถานะครุภัณฑ์</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} รายการ`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 lg:col-span-2 dark:bg-slate-800 dark:border-slate-700">
          <h2 className="text-lg font-semibold mb-4 text-foreground">แนวโน้มงบประมาณจัดซื้อ (ลบ.)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={budgetData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(value) => `${value / 1000000}`} />
                <Tooltip 
                  formatter={(value) => [`${(Number(value ?? 0) / 1000000).toFixed(1)} ล้านบาท`, 'งบประมาณ']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#003366" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-foreground">ความเคลื่อนไหวล่าสุด</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">กิจกรรม</th>
                <th className="px-4 py-3">รายละเอียด</th>
                <th className="px-4 py-3">ผู้ดำเนินการ</th>
                <th className="px-4 py-3">วัน-เวลา</th>
              </tr>
            </thead>
            <tbody>
              {mockActivities.map((activity) => (
                <tr key={activity.id} className="border-b last:border-0 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3 font-medium text-primary dark:text-blue-400">{activity.action}</td>
                  <td className="px-4 py-3">{activity.detail}</td>
                  <td className="px-4 py-3">{activity.user}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(activity.date).toLocaleString('th-TH')}
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
