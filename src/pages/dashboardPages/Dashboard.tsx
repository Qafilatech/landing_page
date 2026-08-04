import { useEffect, useState } from 'react';
import { Package, BarChart, DollarSign, Users, Loader2 } from 'lucide-react';
import { platformFetch } from '@/lib/platformApi';

type Overview = {
  totalTenants?: number;
  totalUsers?: number;
  totalOrders?: number;
  totalRevenue?: number;
  activeTenants?: number;
};

type Props = {
  language: string;
  adminTexts: Record<string, Record<string, string>>;
  dateRange: string;
  setDateRange: (v: string) => void;
  formatCurrency: (v: number) => string;
};

const Dashboard = ({
  language,
  adminTexts,
  dateRange,
  setDateRange,
  formatCurrency,
}: Props) => {
  const t = adminTexts[language] || adminTexts.en;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [driverCount, setDriverCount] = useState(0);
  const [transferPending, setTransferPending] = useState(0);
  const [editRequests, setEditRequests] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [ov, drivers, transfers, edits] = await Promise.all([
          platformFetch<{ success: boolean; data: Overview }>(
            '/api/superuser/analytics/overview',
          ),
          platformFetch<{ success: boolean; pagination?: { total: number } }>(
            '/api/superuser/drivers?limit=1',
          ),
          platformFetch<{ success: boolean; data: unknown[] }>(
            '/api/superuser/orders/transfer-pending',
          ),
          platformFetch<{ success: boolean; data: unknown[] }>(
            '/api/superuser/driver-edit-requests?status=pending',
          ),
        ]);
        if (cancelled) return;
        setOverview(ov.data.data || null);
        setDriverCount(drivers.data.pagination?.total ?? 0);
        setTransferPending(
          Array.isArray(transfers.data.data) ? transfers.data.data.length : 0,
        );
        setEditRequests(
          Array.isArray(edits.data.data) ? edits.data.data.length : 0,
        );
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : (e as { message?: string }).message || 'Failed to load overview',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  const cards = [
    {
      label: t.totalOrders,
      value: overview?.totalOrders ?? 0,
      icon: Package,
    },
    {
      label: t.totalDrivers,
      value: driverCount,
      icon: Users,
    },
    {
      label: t.totalRevenue,
      value: formatCurrency(Number(overview?.totalRevenue ?? 0)),
      icon: DollarSign,
    },
    {
      label: language === 'ar' ? 'المستخدمون' : 'Users',
      value: overview?.totalUsers ?? 0,
      icon: BarChart,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">{t.welcomeAdmin}</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">{t.filterBy}</span>
          {(['week', 'month', 'year'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDateRange(r)}
              className={`px-3 py-1 rounded ${dateRange === r ? 'bg-primary text-white' : 'bg-white border'}`}
            >
              {t[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{c.label}</span>
              <c.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold mb-2">
            {language === 'ar' ? 'طلبات نقل معلّقة' : 'Transfer requests'}
          </h3>
          <p className="text-3xl font-bold text-primary">{transferPending}</p>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'ar'
              ? 'طلبات سائقين لإعادة التعيين'
              : 'Driver-requested reassignments awaiting ops'}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold mb-2">
            {language === 'ar' ? 'طلبات تعديل السائق' : 'Driver edit requests'}
          </h3>
          <p className="text-3xl font-bold text-primary">{editRequests}</p>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'ar'
              ? 'ملفات تحتاج موافقة'
              : 'Profile / document changes pending approval'}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Live data from qafila-platform · /api/superuser/*
      </p>
    </div>
  );
};

export default Dashboard;
