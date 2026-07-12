'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import styles from '@/app/admin/page.module.css';

interface SoldItem {
  id: number;
  quantity: number;
  price: number;
  productId: number;
  product: {
    title: string;
  } | null;
  order: {
    createdAt: string;
  };
}

interface SoldReportTableProps {
  initialItems: SoldItem[];
}

type Timeframe = 'all' | 'today' | 'week' | 'month';

export default function SoldReportTable({ initialItems }: SoldReportTableProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('all');

  // Filter items based on selected timeframe
  const getFilteredItems = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Start of this week (Monday)
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);

    // Start of this month
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return initialItems.filter(item => {
      const itemDate = new Date(item.order.createdAt);
      if (timeframe === 'today') {
        return itemDate >= startOfToday;
      }
      if (timeframe === 'week') {
        return itemDate >= startOfThisWeek;
      }
      if (timeframe === 'month') {
        return itemDate >= startOfThisMonth;
      }
      return true;
    });
  };

  const filteredItems = getFilteredItems();

  // Aggregate by product
  const soldMap: Record<string, { title: string; count: number; price: number }> = {};
  filteredItems.forEach(item => {
    if (!item.product) return;
    const key = item.productId.toString();
    if (!soldMap[key]) {
      soldMap[key] = { title: item.product.title, count: 0, price: item.price };
    }
    soldMap[key].count += item.quantity;
  });

  const soldReport = Object.values(soldMap).sort((a, b) => b.count - a.count);

  const exportToExcel = () => {
    if (soldReport.length === 0) return;

    // 1. Prepare structured data
    const dataToExport = soldReport.map((item, idx) => ({
      'No': idx + 1,
      'Nama Produk': item.title,
      'Jumlah Terjual (pcs)': item.count,
      'Harga Satuan (IDR)': item.price,
      'Total Omset (IDR)': item.count * item.price,
    }));

    // 2. Convert to sheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // 3. Set widths
    const nameWidth = Math.max(
      ...soldReport.map(item => item.title.length),
      15
    );
    worksheet['!cols'] = [
      { wch: 6 },                   // No
      { wch: nameWidth + 5 },       // Nama Produk
      { wch: 22 },                  // Jumlah Terjual
      { wch: 22 },                  // Harga Satuan
      { wch: 24 }                   // Total Omset
    ];

    // 4. Create workbook and write
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Produk Terjual');

    let fileName = 'Laporan_Produk_Terjual';
    if (timeframe === 'today') fileName += '_Harian';
    else if (timeframe === 'week') fileName += '_Mingguan';
    else if (timeframe === 'month') fileName += '_Bulanan';
    else fileName += '_Semua_Waktu';

    const dateStr = new Date().toISOString().slice(0, 10);
    fileName += `_${dateStr}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className={styles.recentActivity}>
      <div className={styles.reportHeader}>
        <h2 className={styles.sectionTitleNoMargin}>Laporan Produk Terjual</h2>
        <div className={styles.reportControls}>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as Timeframe)}
            className={styles.filterSelect}
            aria-label="Filter periode laporan"
          >
            <option value="all">Semua Waktu</option>
            <option value="today">Hari Ini (Harian)</option>
            <option value="week">Minggu Ini (Mingguan)</option>
            <option value="month">Bulan Ini (Bulanan)</option>
          </select>

          <button
            onClick={exportToExcel}
            className={styles.exportBtn}
            disabled={soldReport.length === 0}
            title="Ekspor Laporan ke Excel"
          >
            <svg
              className={styles.excelIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th>Jumlah Terjual</th>
              <th>Total Omset</th>
            </tr>
          </thead>
          <tbody>
            {soldReport.map((item, idx) => (
              <tr key={idx}>
                <td>{item.title}</td>
                <td>
                  <strong>{item.count} pcs</strong>
                </td>
                <td>{`${(item.count * item.price).toLocaleString('id-ID')} IDR`}</td>
              </tr>
            ))}
            {soldReport.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>
                  Belum ada produk terjual pada periode ini
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
