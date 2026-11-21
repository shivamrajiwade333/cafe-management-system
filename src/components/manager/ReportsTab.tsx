'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  ShoppingBag, 
  DollarSign, 
  Award, 
  Download, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';
import { ISalesReport } from '@/types';
import { dataStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export const ReportsTab: React.FC = () => {
  const [report, setReport] = useState<ISalesReport | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch('/api/reports?cafe=cafe001', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.report) {
            setReport(json.report);
            return;
          }
        }
      } catch (err) {
        console.warn('Reports fetch error, falling back:', err);
      }
      const data = dataStore.getSalesReport('cafe001');
      setReport(data);
    }
    fetchReport();
  }, []);

  if (!report) {
    return (
      <div className="p-8 text-center text-xs text-coffee-500">
        Loading analytics engine...
      </div>
    );
  }

  // Export Sales Report to CSV
  const exportToCSV = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Today Sales (INR)', report.today_sales],
      ['Today Orders', report.today_orders],
      ['Weekly Sales (INR)', report.weekly_sales],
      ['Monthly Sales (INR)', report.monthly_sales],
      ['Average Order Value (INR)', report.average_order_value],
      ['Pending Orders', report.pending_orders],
      ['Kitchen Preparing Orders', report.preparing_orders],
      ['Completed Orders', report.completed_orders],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Cafe_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* HEADER & EXPORT */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-coffee-950">
            Sales Performance & Business Analytics
          </h2>
          <p className="text-xs text-coffee-600">
            Real-time financial metrics, daily turnover, and customer preference intelligence.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-coffee-950 px-4 py-2 text-xs font-bold text-cream-100 hover:bg-amberGold transition shadow"
        >
          <Download className="h-4 w-4 text-amberGold" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* 4 TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="rounded-2xl border border-coffee-200/80 bg-white p-5 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-coffee-500 font-semibold uppercase tracking-wider">
            <span>Today's Sales</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-extrabold text-coffee-950">
            {formatCurrency(report.today_sales)}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+18.4% vs yesterday</span>
          </div>
        </div>

        {/* Total Orders Today */}
        <div className="rounded-2xl border border-coffee-200/80 bg-white p-5 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-coffee-500 font-semibold uppercase tracking-wider">
            <span>Total Orders Today</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-extrabold text-coffee-950">
            {report.today_orders} orders
          </p>
          <p className="text-[11px] text-coffee-500">
            {report.completed_orders} served • {report.pending_orders + report.preparing_orders} in pipeline
          </p>
        </div>

        {/* Weekly Sales */}
        <div className="rounded-2xl border border-coffee-200/80 bg-white p-5 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-coffee-500 font-semibold uppercase tracking-wider">
            <span>Weekly Sales</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-extrabold text-coffee-950">
            {formatCurrency(report.weekly_sales)}
          </p>
          <p className="text-[11px] text-coffee-500">Last 7 calendar days total</p>
        </div>

        {/* Monthly Projection */}
        <div className="rounded-2xl border border-coffee-200/80 bg-white p-5 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-coffee-500 font-semibold uppercase tracking-wider">
            <span>Monthly Run-Rate</span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-extrabold text-coffee-950">
            {formatCurrency(report.monthly_sales)}
          </p>
          <p className="text-[11px] text-coffee-500">Avg ticket: {formatCurrency(report.average_order_value)}</p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend Chart (7 Days) */}
        <div className="lg:col-span-7 rounded-2xl border border-coffee-200/80 bg-white p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-coffee-950">
                7-Day Revenue Velocity
              </h3>
              <p className="text-[11px] text-coffee-500">
                Daily sales gross in Indian Rupees (₹)
              </p>
            </div>
            <span className="rounded-lg bg-coffee-100 px-2.5 py-1 text-[11px] font-bold text-coffee-800">
              Past Week
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={report.daily_trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3ebe0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7c4e33' }} />
                <YAxis tick={{ fontSize: 10, fill: '#7c4e33' }} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  formatter={(val: number) => [`₹${val}`, 'Daily Revenue']}
                  contentStyle={{ backgroundColor: '#1e120c', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#d97706" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Ordered Dishes */}
        <div className="lg:col-span-5 rounded-2xl border border-coffee-200/80 bg-white p-5 shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amberGold/15 p-1.5 text-amberGold">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-coffee-950">
                Top Ordered Dishes
              </h3>
              <p className="text-[11px] text-coffee-500">
                Customer favorites by volume & revenue
              </p>
            </div>
          </div>

          <div className="divide-y divide-coffee-100">
            {report.top_items.map((it, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coffee-100 text-[10px] font-extrabold text-coffee-700">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-coffee-950 max-w-[180px] truncate">
                      {it.name}
                    </p>
                    <p className="text-[10px] text-coffee-500">
                      {it.count} portions sold
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-extrabold text-coffee-950">
                    {formatCurrency(it.revenue)}
                  </p>
                  <span className="text-[9px] text-emerald-600 font-bold uppercase">
                    Bestseller
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
