import React, { useState, useEffect } from "react";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Smartphone,
  Building,
  Filter,
  Search,
  Eye,
  ShieldCheck,
  Download,
  DollarSign
} from "lucide-react";
import { StatCard } from "../components/common/StatCard";
import { Badge } from "../components/common/Badge";
import { PaymentReceipt } from "../components/payment/PaymentReceipt";

export const PaymentDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    successfulPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    totalAmount: 0,
    successRate: 0,
    methods: { upi: 0, card: 0, netbanking: 0 }
  });
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectPayment, setInspectPayment] = useState(null);

  const fetchPaymentData = async () => {
    try {
      const [resHistory, resStats] = await Promise.all([
        fetch("/api/payment/history"),
        fetch("/api/payment/stats")
      ]);

      const jsonHistory = await resHistory.json();
      const jsonStats = await resStats.json();

      if (jsonHistory.success) setPayments(jsonHistory.payments);
      if (jsonStats.success) setStats(jsonStats.stats);
    } catch (e) {
      console.error("Error fetching payment telemetry:", e);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const matchesMethod = methodFilter === "all" || p.method?.toLowerCase() === methodFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || p.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      (p.id && p.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.bookingId && p.bookingId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.customerName && p.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.paymentId && p.paymentId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesMethod && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Razorpay Payment Management & Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time transaction tracking, gateway settlement audit, and payment method statistics
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Sandbox Test Mode</span>
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions}
          subtitle="All payment attempts"
          icon={CreditCard}
          color="blue"
        />
        <StatCard
          title="Successful"
          value={stats.successfulPayments}
          subtitle="Verified via HMAC-SHA256"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Failed Payments"
          value={stats.failedPayments}
          subtitle="Declined / Rejected"
          icon={XCircle}
          color="rose"
        />
        <StatCard
          title="Pending Verification"
          value={stats.pendingPayments}
          subtitle="Awaiting gateway OTP"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Total Volume"
          value={`₹${stats.totalAmount.toLocaleString()}`}
          subtitle={`${stats.successRate}% Success Rate`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Payment Method Distribution */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">Payment Method Telemetry</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">UPI Payments</p>
                <p className="text-[11px] text-slate-500">GPay, PhonePe, Paytm</p>
              </div>
            </div>
            <span className="text-xl font-black text-blue-700">{stats.methods.upi}</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Debit & Credit Cards</p>
                <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay</p>
              </div>
            </div>
            <span className="text-xl font-black text-purple-700">{stats.methods.card}</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Net Banking</p>
                <p className="text-[11px] text-slate-500">HDFC, ICICI, SBI</p>
              </div>
            </div>
            <span className="text-xl font-black text-amber-700">{stats.methods.netbanking}</span>
          </div>
        </div>
      </div>

      {/* Transactions Table & Filters */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4">
        {/* Table Toolbar */}
        <div className="p-6 pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Payment ID, Order ID, or Booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Methods</option>
              <option value="upi">UPI</option>
              <option value="card">Cards</option>
              <option value="netbanking">Net Banking</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="success">Successful</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Payment ID</th>
                <th className="px-6 py-3.5">Booking ID</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date & Time</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-400">
                    No transactions matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{p.id}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-800">{p.bookingId}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{p.customerName || "Customer"}</p>
                      <p className="text-[10px] text-slate-400">{p.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4 uppercase font-bold text-slate-700">
                      {p.method || "UPI"}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">₹{p.amount}</td>
                    <td className="px-6 py-4">
                      <Badge status={p.status}>{p.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">
                      {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setInspectPayment(p)}
                        className="px-3 py-1 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect / Receipt Modal */}
      {inspectPayment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <PaymentReceipt
            payment={inspectPayment}
            booking={{ id: inspectPayment.bookingId, title: "Online Booking Reservation", fare: inspectPayment.amount }}
            onClose={() => setInspectPayment(null)}
          />
        </div>
      )}
    </div>
  );
};
