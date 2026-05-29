"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Download, FileText, Filter, Package, Wrench, ArrowLeftRight } from 'lucide-react';
import {
  getAssets,
  getBorrows,
  getMaintenanceItems,
  type AssetRow,
  type BorrowRow,
  type MaintenanceRow,
} from '@/lib/data';

type ReportError = string | null;

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString('th-TH') : '-';
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [borrows, setBorrows] = useState<BorrowRow[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReportError>(null);
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    Promise.all([getAssets(), getBorrows(), getMaintenanceItems()])
      .then(([assetRows, borrowRows, maintenanceRows]) => {
        setAssets(assetRows);
        setBorrows(borrowRows);
        setMaintenance(maintenanceRows);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(
    () => Array.from(new Set(assets.map((asset) => asset.department).filter(Boolean))).sort(),
    [assets],
  );

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesDepartment = department === 'all' || asset.department === department;
      const matchesStatus = status === 'all' || asset.status === status;
      const assetDate = asset.purchase_date ?? asset.created_at;
      const matchesStart = !startDate || assetDate >= startDate;
      const matchesEnd = !endDate || assetDate <= endDate;
      return matchesDepartment && matchesStatus && matchesStart && matchesEnd;
    });
  }, [assets, department, endDate, startDate, status]);

  const filteredAssetIds = new Set(filteredAssets.map((asset) => asset.id));
  const filteredBorrows = borrows.filter((borrow) => !borrow.asset_id || filteredAssetIds.has(borrow.asset_id));
  const filteredMaintenance = maintenance.filter((item) => !item.asset_id || filteredAssetIds.has(item.asset_id));
  const totalValue = filteredAssets.reduce((sum, asset) => sum + Number(asset.price ?? 0), 0);

  const exportReport = () => {
    downloadCsv('asset-report.csv', [
      ['Asset Code', 'Name', 'Department', 'Category', 'Status', 'Purchase Date', 'Price'],
      ...filteredAssets.map((asset) => [
        asset.asset_code,
        asset.name,
        asset.department,
        asset.category,
        asset.status,
        asset.purchase_date ?? '',
        String(asset.price ?? 0),
      ]),
    ]);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading reports...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-danger/20 bg-danger/10 p-4 text-danger">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="text-primary" /> Reports
          </h1>
          <p className="text-sm text-gray-500">Supabase asset, borrow, and maintenance summary</p>
        </div>
        <button
          onClick={exportReport}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <Package className="mb-3 text-primary" />
          <div className="text-sm text-gray-500">Assets</div>
          <div className="text-2xl font-bold">{filteredAssets.length.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <ArrowLeftRight className="mb-3 text-warning" />
          <div className="text-sm text-gray-500">Borrow Records</div>
          <div className="text-2xl font-bold">{filteredBorrows.length.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <Wrench className="mb-3 text-danger" />
          <div className="text-sm text-gray-500">Maintenance Jobs</div>
          <div className="text-2xl font-bold">{filteredMaintenance.length.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <FileText className="mb-3 text-success" />
          <div className="text-sm text-gray-500">Asset Value</div>
          <div className="text-2xl font-bold">{totalValue.toLocaleString()} THB</div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <div className="mb-4 flex items-center gap-2 font-semibold">
          <Filter size={18} className="text-primary" />
          Filters
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="rounded-md border px-3 py-2 dark:bg-slate-900 dark:border-slate-700">
            <option value="all">All departments</option>
            {departments.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border px-3 py-2 dark:bg-slate-900 dark:border-slate-700">
            <option value="all">All asset statuses</option>
            <option value="normal">Normal</option>
            <option value="repair">Repair</option>
            <option value="broken">Broken</option>
            <option value="lost">Lost</option>
            <option value="sold">Sold</option>
          </select>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-md border px-3 py-2 dark:bg-slate-900 dark:border-slate-700" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-md border px-3 py-2 dark:bg-slate-900 dark:border-slate-700" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-slate-900/50">
              <tr>
                <th className="px-4 py-3">Asset Code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Purchase Date</th>
                <th className="px-4 py-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="border-t dark:border-slate-700">
                  <td className="px-4 py-3 font-medium text-primary">{asset.asset_code}</td>
                  <td className="px-4 py-3">{asset.name}</td>
                  <td className="px-4 py-3">{asset.department}</td>
                  <td className="px-4 py-3 capitalize">{asset.status}</td>
                  <td className="px-4 py-3">{formatDate(asset.purchase_date)}</td>
                  <td className="px-4 py-3 text-right">{Number(asset.price ?? 0).toLocaleString()}</td>
                </tr>
              ))}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No assets match these filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
