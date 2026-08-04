import { useEffect, useMemo, useState } from 'react';
import {
  Headphones,
  Loader2,
  RefreshCw,
  ArrowRightLeft,
  FileEdit,
} from 'lucide-react';
import { platformFetch } from '@/lib/platformApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

type SupportTab = 'transfers' | 'edit_requests';

type TransferOrder = {
  order_id: number;
  status: string;
  transfer_request_reason?: string | null;
  transfer_requested_at?: string | null;
  driver?: {
    driver_id?: number;
    user?: { name?: string | null; phone?: string | null; email?: string | null };
  } | null;
  customer?: {
    user?: { name?: string | null; phone?: string | null };
  } | null;
  orderLocations?: Array<{ address?: string; location_type?: string }>;
};

type EditRequest = {
  request_id: number;
  driver_id: number;
  kind: string;
  status: string;
  payload?: Record<string, unknown>;
  reason?: string | null;
  created_at?: string;
  driver?: {
    user?: { name?: string | null; email?: string | null; phone?: string | null };
  };
};

const SupportManagement = ({
  language,
  initialTab,
}: {
  language: string;
  initialTab?: SupportTab;
}) => {
  const [tab, setTab] = useState<SupportTab>(initialTab ?? 'transfers');

  useEffect(() => {
    if (initialTab) setTab(initialTab);
  }, [initialTab]);

  const labels = useMemo(
    () =>
      language === 'ar'
        ? {
            title: 'الدعم والطلبات',
            subtitle: 'تحويلات السائقين وطلبات تعديل الملف.',
            transfers: 'طلبات التحويل',
            edits: 'تعديلات الملف',
          }
        : {
            title: 'Support & requests',
            subtitle:
              'Driver transfer requests and profile/document change requests.',
            transfers: 'Transfer requests',
            edits: 'Edit requests',
          },
    [language],
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Headphones className="h-5 w-5" />
          {labels.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">{labels.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['transfers', labels.transfers, ArrowRightLeft],
            ['edit_requests', labels.edits, FileEdit],
          ] as const
        ).map(([key, label, Icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
              tab === key
                ? 'bg-primary text-white'
                : 'bg-white border hover:bg-gray-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'transfers' && <TransfersPanel language={language} />}
      {tab === 'edit_requests' && <EditRequestsPanel language={language} />}
    </div>
  );
};

function TransfersPanel({ language }: { language: string }) {
  const [rows, setRows] = useState<TransferOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<TransferOrder | null>(null);
  const [newDriverId, setNewDriverId] = useState('');
  const [availableDrivers, setAvailableDrivers] = useState<
    Array<{
      driver_id: number;
      status?: string | null;
      user?: { name?: string | null; phone?: string | null };
      trucks?: Array<{ license_plate?: string | null; truck_type?: string | null }>;
    }>
  >([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [acting, setActing] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await platformFetch<{
        success: boolean;
        data: TransferOrder[];
      }>('/api/superuser/orders/transfer-pending');
      setRows(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Failed to load transfers',
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableDrivers = async (excludeDriverId?: number) => {
    setDriversLoading(true);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '100',
        status: 'available',
        kyc_status: 'verified',
      });
      const { data } = await platformFetch<{
        success: boolean;
        data: Array<{
          driver_id: number;
          status?: string | null;
          user?: { name?: string | null; phone?: string | null };
          trucks?: Array<{ license_plate?: string | null; truck_type?: string | null }>;
        }>;
      }>(`/api/superuser/drivers?${params}`);
      const list = Array.isArray(data.data) ? data.data : [];
      setAvailableDrivers(
        excludeDriverId
          ? list.filter((d) => d.driver_id !== excludeDriverId)
          : list,
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message ||
              'Failed to load available drivers',
      );
    } finally {
      setDriversLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openReassign = (o: TransferOrder) => {
    setSelected(o);
    setNewDriverId('');
    void loadAvailableDrivers(o.driver?.driver_id);
  };

  const reassign = async () => {
    if (!selected) return;
    const id = parseInt(newDriverId, 10);
    if (!Number.isFinite(id)) {
      setError('Select an available driver');
      return;
    }
    setActing(true);
    setError(null);
    try {
      await platformFetch(
        `/api/superuser/orders/${selected.order_id}/reassign`,
        {
          method: 'POST',
          body: JSON.stringify({ new_driver_id: id }),
        },
      );
      setSelected(null);
      setNewDriverId('');
      await load();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Reassign failed',
      );
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
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
        <div className="rounded-md border bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Current driver</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Requested</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    {language === 'ar'
                      ? 'لا توجد طلبات تحويل'
                      : 'No pending transfer requests'}
                  </TableCell>
                </TableRow>
              )}
              {rows.map((o) => (
                <TableRow
                  key={o.order_id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => openReassign(o)}
                >
                  <TableCell className="font-medium">
                    #{o.order_id}
                    <Badge variant="secondary" className="ml-2">
                      {o.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {o.driver?.user?.name || '—'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {o.driver?.driver_id != null
                        ? `ID #${o.driver.driver_id}`
                        : ''}
                      {o.driver?.user?.phone
                        ? ` · ${o.driver.user.phone}`
                        : o.driver?.user?.email
                          ? ` · ${o.driver.user.email}`
                          : ''}
                    </div>
                  </TableCell>
                  <TableCell>{o.customer?.user?.name || '—'}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {o.transfer_request_reason || '—'}
                  </TableCell>
                  <TableCell>
                    {o.transfer_requested_at
                      ? new Date(o.transfer_requested_at).toLocaleString()
                      : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reassign order #{selected?.order_id}
            </DialogTitle>
            <DialogDescription>
              Current driver: {selected?.driver?.user?.name || '—'}
              {selected?.transfer_request_reason
                ? ` — ${selected.transfer_request_reason}`
                : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Transfer to available driver
            </label>
            {driversLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading drivers…
              </div>
            ) : (
              <select
                className="w-full border rounded px-3 py-2 text-sm bg-white"
                value={newDriverId}
                onChange={(e) => setNewDriverId(e.target.value)}
              >
                <option value="">
                  {availableDrivers.length === 0
                    ? 'No verified available drivers'
                    : 'Select a driver…'}
                </option>
                {availableDrivers.map((d) => {
                  const truck = d.trucks?.[0];
                  const label = [
                    `#${d.driver_id}`,
                    d.user?.name || 'Driver',
                    truck?.license_plate || truck?.truck_type,
                    d.user?.phone,
                  ]
                    .filter(Boolean)
                    .join(' · ');
                  return (
                    <option key={d.driver_id} value={String(d.driver_id)}>
                      {label}
                    </option>
                  );
                })}
              </select>
            )}
            <p className="text-xs text-gray-500">
              Shows verified drivers currently marked available (excludes the
              current driver).
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              disabled={acting}
              onClick={() => void reassign()}
            >
              {acting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Reassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditRequestsPanel({ language }: { language: string }) {
  const [rows, setRows] = useState<EditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<EditRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [acting, setActing] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await platformFetch<{
        success: boolean;
        data: EditRequest[];
      }>('/api/superuser/driver-edit-requests?status=pending');
      setRows(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Failed to load',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const decide = async (action: 'approve' | 'reject') => {
    if (!selected) return;
    setActing(true);
    setError(null);
    try {
      const path =
        action === 'approve'
          ? `/api/superuser/driver-edit-requests/${selected.request_id}/approve`
          : `/api/superuser/driver-edit-requests/${selected.request_id}/reject`;
      await platformFetch(path, {
        method: 'POST',
        body: JSON.stringify(
          action === 'reject' ? { reason: rejectReason || undefined } : {},
        ),
      });
      setSelected(null);
      setRejectReason('');
      await load();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Action failed',
      );
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
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
        <div className="rounded-md border bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500">
                    {language === 'ar'
                      ? 'لا توجد طلبات تعديل'
                      : 'No pending edit requests'}
                  </TableCell>
                </TableRow>
              )}
              {rows.map((r) => (
                <TableRow
                  key={r.request_id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelected(r);
                    setRejectReason('');
                  }}
                >
                  <TableCell>
                    <div className="font-medium">
                      {r.driver?.user?.name || `Driver #${r.driver_id}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {r.driver?.user?.email || r.driver?.user?.phone || ''}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{r.kind}</Badge>
                  </TableCell>
                  <TableCell>
                    {r.created_at
                      ? new Date(r.created_at).toLocaleString()
                      : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selected?.kind} request #{selected?.request_id}
            </DialogTitle>
            <DialogDescription>
              {selected?.driver?.user?.name ||
                (selected ? `Driver #${selected.driver_id}` : '')}
            </DialogDescription>
          </DialogHeader>
          <pre className="text-xs bg-gray-50 border rounded p-3 overflow-auto max-h-60">
            {JSON.stringify(selected?.payload ?? {}, null, 2)}
          </pre>
          <Input
            placeholder="Rejection reason (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="destructive"
              disabled={acting}
              onClick={() => void decide('reject')}
            >
              Reject
            </Button>
            <Button
              type="button"
              disabled={acting}
              onClick={() => void decide('approve')}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SupportManagement;
