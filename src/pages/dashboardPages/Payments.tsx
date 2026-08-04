import { useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  RefreshCw,
  Search,
  Wallet,
  Banknote,
  CreditCard,
} from 'lucide-react';
import { platformFetch } from '@/lib/platformApi';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type PaymentRow = {
  payment_id: number;
  order_id: number;
  amount: number | string;
  status: string;
  gateway?: string | null;
  gateway_ref?: string | null;
  gateway_txn_id?: string | null;
  paid_at?: string | null;
  created_at?: string;
  order?: {
    status?: string;
    payment_method?: string | null;
    customer?: { user?: { name?: string | null; email?: string | null } };
    driver?: { user?: { name?: string | null } } | null;
  };
};

type EarningRow = {
  earning_id: number;
  order_id: number;
  driver_id: number;
  fare_amount: number | string;
  tip_amount?: number | string;
  commission_amount: number | string;
  net_amount: number | string;
  is_cash?: boolean;
  payment_method?: string | null;
  status: string;
  created_at?: string;
  paid_at?: string | null;
  driver?: { user?: { name?: string | null; phone?: string | null; email?: string | null } };
  order?: { status?: string; payment_method?: string | null };
};

type PayoutReady = {
  driver_id: number;
  pending_count: number;
  pending_net: number;
  driver?: { user?: { name?: string | null; phone?: string | null; email?: string | null } } | null;
};

const money = (v: number | string | null | undefined) =>
  v != null && v !== '' ? `OMR ${Number(v).toFixed(3)}` : '—';

const PaymentsManagement = ({ language }: { language: string }) => {
  const [subTab, setSubTab] = useState<'held' | 'payouts'>('held');
  const labels = useMemo(
    () =>
      language === 'ar'
        ? {
            title: 'المدفوعات',
            subtitle:
              'يتم الاحتفاظ بمدفوعات العميل حتى اكتمال التوصيل، ثم تُحوَّل للسائق.',
            held: 'مدفوعات العملاء',
            payouts: 'تحويلات السائقين',
            refresh: 'تحديث',
            search: 'بحث',
          }
        : {
            title: 'Payments',
            subtitle:
              'Customer payments are held until delivery is completed, then released to the driver.',
            held: 'Customer payments',
            payouts: 'Driver payouts',
            refresh: 'Refresh',
            search: 'Search',
          },
    [language],
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          {labels.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">{labels.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSubTab('held')}
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
            subTab === 'held'
              ? 'bg-primary text-white'
              : 'bg-white border hover:bg-gray-50'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          {labels.held}
        </button>
        <button
          type="button"
          onClick={() => setSubTab('payouts')}
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
            subTab === 'payouts'
              ? 'bg-primary text-white'
              : 'bg-white border hover:bg-gray-50'
          }`}
        >
          <Banknote className="h-4 w-4" />
          {labels.payouts}
        </button>
      </div>

      {subTab === 'held' ? (
        <CustomerPaymentsPanel language={language} />
      ) : (
        <DriverPayoutsPanel language={language} />
      )}
    </div>
  );
};

function CustomerPaymentsPanel({ language }: { language: string }) {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [meta, setMeta] = useState({
    pending_count: 0,
    pending_amount: 0,
    paid_count: 0,
    paid_amount: 0,
    failed_count: 0,
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
        status,
      });
      if (search.trim()) params.set('search', search.trim());
      const { data } = await platformFetch<{
        success: boolean;
        data: PaymentRow[];
        meta?: typeof meta;
        pagination?: { total: number };
      }>(`/api/superuser/payments?${params}`);
      setRows(Array.isArray(data.data) ? data.data : []);
      if (data.meta) setMeta(data.meta);
      setTotal(data.pagination?.total ?? 0);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Failed to load payments',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [status]);

  const statusBadge = (s: string) => {
    if (s === 'paid')
      return <Badge className="bg-green-600 hover:bg-green-600">held / paid</Badge>;
    if (s === 'failed') return <Badge variant="destructive">failed</Badge>;
    if (s === 'pending')
      return <Badge className="bg-amber-500 hover:bg-amber-500">pending</Badge>;
    return <Badge variant="secondary">{s}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label={language === 'ar' ? 'بانتظار التأكيد' : 'Awaiting confirmation'}
          value={`${meta.pending_count}`}
          sub={money(meta.pending_amount)}
        />
        <StatCard
          label={language === 'ar' ? 'محجوز (مدفوع)' : 'Held (captured)'}
          value={`${meta.paid_count}`}
          sub={money(meta.paid_amount)}
        />
        <StatCard
          label={language === 'ar' ? 'فشل' : 'Failed'}
          value={`${meta.failed_count}`}
        />
        <StatCard label={language === 'ar' ? 'الإجمالي' : 'Listed'} value={`${total}`} />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-8 w-56"
            placeholder={language === 'ar' ? 'بحث' : 'Order / payment / customer'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void load()}
          />
        </div>
        <select
          className="border rounded px-3 py-2 text-sm bg-white"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Held / paid</option>
          <option value="failed">Failed</option>
        </select>
        <Button type="button" variant="outline" onClick={() => void load()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500">
                    No payments found
                  </TableCell>
                </TableRow>
              )}
              {rows.map((p) => (
                <TableRow key={p.payment_id}>
                  <TableCell className="font-medium">#{p.payment_id}</TableCell>
                  <TableCell>
                    #{p.order_id}
                    <div className="text-xs text-gray-500">
                      {p.order?.status || ''}
                    </div>
                  </TableCell>
                  <TableCell>
                    {p.order?.customer?.user?.name ||
                      p.order?.customer?.user?.email ||
                      '—'}
                  </TableCell>
                  <TableCell>{p.order?.driver?.user?.name || '—'}</TableCell>
                  <TableCell>{money(p.amount)}</TableCell>
                  <TableCell>{statusBadge(p.status)}</TableCell>
                  <TableCell className="text-xs">
                    {p.gateway || '—'}
                    {p.gateway_ref ? (
                      <div className="text-gray-400 truncate max-w-[120px]">
                        {p.gateway_ref}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-xs">
                    {p.paid_at
                      ? new Date(p.paid_at).toLocaleString()
                      : p.created_at
                        ? new Date(p.created_at).toLocaleString()
                        : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function DriverPayoutsPanel({ language }: { language: string }) {
  const [status, setStatus] = useState('pending');
  const [rows, setRows] = useState<EarningRow[]>([]);
  const [payouts, setPayouts] = useState<PayoutReady[]>([]);
  const [meta, setMeta] = useState({
    pending_owe_driver_count: 0,
    pending_owe_driver_amount: 0,
    pending_owe_platform_count: 0,
    pending_owe_platform_amount: 0,
    paid_count: 0,
    paid_net: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settleTarget, setSettleTarget] = useState<PayoutReady | null>(null);
  const [acting, setActing] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
        status,
      });
      const { data } = await platformFetch<{
        success: boolean;
        data: EarningRow[];
        payouts_ready?: PayoutReady[];
        meta?: typeof meta;
      }>(`/api/superuser/earnings?${params}`);
      setRows(Array.isArray(data.data) ? data.data : []);
      setPayouts(Array.isArray(data.payouts_ready) ? data.payouts_ready : []);
      if (data.meta) setMeta(data.meta);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Failed to load earnings',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [status]);

  const settle = async () => {
    if (!settleTarget) return;
    setActing(true);
    setError(null);
    try {
      await platformFetch(
        `/api/superuser/drivers/${settleTarget.driver_id}/earnings/settle`,
        { method: 'POST', body: JSON.stringify({}) },
      );
      setSettleTarget(null);
      await load();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Settle failed',
      );
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label={language === 'ar' ? 'مستحق للسائقين' : 'Owed to drivers'}
          value={money(meta.pending_owe_driver_amount)}
          sub={`${meta.pending_owe_driver_count} orders`}
        />
        <StatCard
          label={language === 'ar' ? 'عمولة مستحقة' : 'Drivers owe platform'}
          value={money(Math.abs(meta.pending_owe_platform_amount))}
          sub={`${meta.pending_owe_platform_count} cash jobs`}
        />
        <StatCard
          label={language === 'ar' ? 'تم التسوية' : 'Already settled'}
          value={`${meta.paid_count}`}
          sub={money(meta.paid_net)}
        />
        <StatCard
          label={language === 'ar' ? 'سائقون بانتظار التحويل' : 'Drivers ready'}
          value={`${payouts.length}`}
        />
      </div>

      <p className="text-sm text-gray-600 bg-white border rounded-lg p-3">
        {language === 'ar'
          ? 'بعد اكتمال التوصيل، سجّل التحويل للسائق من هنا. هذا يسجّل التسوية في الدفاتر بعد تحويل المبلغ فعلياً.'
          : 'After delivery completes, mark a driver settled here once you have transferred their share. This is bookkeeping after the offline/bank transfer — it does not auto-disburse via Paymob.'}
      </p>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">
          {language === 'ar' ? 'جاهز للتحويل' : 'Ready to settle'}
        </h3>
        <div className="flex gap-2">
          <select
            className="border rounded px-3 py-2 text-sm bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending ledger</option>
            <option value="paid">Settled</option>
            <option value="all">All</option>
          </select>
          <Button type="button" variant="outline" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Pending jobs</TableHead>
                  <TableHead>Net</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No drivers with pending settlement
                    </TableCell>
                  </TableRow>
                )}
                {payouts.map((p) => (
                  <TableRow key={p.driver_id}>
                    <TableCell>
                      <div className="font-medium">
                        {p.driver?.user?.name || `Driver #${p.driver_id}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {p.driver?.user?.phone || p.driver?.user?.email || ''}
                      </div>
                    </TableCell>
                    <TableCell>{p.pending_count}</TableCell>
                    <TableCell>
                      <span
                        className={
                          p.pending_net >= 0 ? 'text-green-700' : 'text-amber-700'
                        }
                      >
                        {money(p.pending_net)}
                      </span>
                      <div className="text-[10px] text-gray-400">
                        {p.pending_net >= 0
                          ? 'pay driver'
                          : 'collect commission'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setSettleTarget(p)}
                      >
                        Mark settled
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <h3 className="font-semibold pt-2">
            {language === 'ar' ? 'سجل الأرباح' : 'Earnings ledger'}
          </h3>
          <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Net</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
                      No earnings rows
                    </TableCell>
                  </TableRow>
                )}
                {rows.map((e) => (
                  <TableRow key={e.earning_id}>
                    <TableCell>#{e.order_id}</TableCell>
                    <TableCell>
                      {e.driver?.user?.name || `#${e.driver_id}`}
                    </TableCell>
                    <TableCell>{money(e.fare_amount)}</TableCell>
                    <TableCell>{money(e.commission_amount)}</TableCell>
                    <TableCell>{money(e.net_amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={e.status === 'paid' ? 'secondary' : 'default'}
                        className={
                          e.status === 'pending'
                            ? 'bg-amber-500 hover:bg-amber-500'
                            : ''
                        }
                      >
                        {e.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {e.paid_at
                        ? new Date(e.paid_at).toLocaleString()
                        : e.created_at
                          ? new Date(e.created_at).toLocaleString()
                          : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <Dialog
        open={!!settleTarget}
        onOpenChange={(open) => {
          if (!open) setSettleTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm settlement</DialogTitle>
            <DialogDescription>
              Mark all pending earnings for{' '}
              {settleTarget?.driver?.user?.name ||
                `driver #${settleTarget?.driver_id}`}{' '}
              as paid after you transfer {money(settleTarget?.pending_net)}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSettleTarget(null)}
            >
              Cancel
            </Button>
            <Button type="button" disabled={acting} onClick={() => void settle()}>
              {acting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm settled
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900 mt-0.5">{value}</p>
      {sub ? <p className="text-xs text-gray-400 mt-0.5">{sub}</p> : null}
    </div>
  );
}

export default PaymentsManagement;
