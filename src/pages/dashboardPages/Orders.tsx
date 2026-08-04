import { useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  RefreshCw,
  Search,
  ArrowRightLeft,
  Phone,
  Mail,
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type OrderLocation = {
  location_id?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  location_type?: string;
};

type ApiOrder = {
  order_id: number;
  status: string;
  payment_amount?: number | string | null;
  tip_amount?: number | string | null;
  payment_method?: string | null;
  receiving_party?: string | null;
  receiving_party_phone?: string | null;
  cargo_description?: string | null;
  special_instructions?: string | null;
  vehicle_type?: string | null;
  order_type?: string | null;
  schedule_type?: string | null;
  assistance_count?: number | null;
  pickup_datetime?: string | null;
  dropoff_datetime?: string | null;
  transfer_requested?: boolean;
  transfer_request_reason?: string | null;
  transfer_requested_at?: string | null;
  created_at?: string;
  last_lat?: number | null;
  last_lng?: number | null;
  last_location_at?: string | null;
  customer?: {
    user?: { name?: string | null; email?: string | null; phone?: string | null };
  };
  driver?: {
    driver_id?: number;
    user?: { name?: string | null; email?: string | null; phone?: string | null };
    trucks?: Array<{ license_plate?: string | null; truck_type?: string | null }>;
  } | null;
  business?: { company_name?: string | null } | null;
  orderLocations?: OrderLocation[];
  payments?: Array<{
    payment_id?: number;
    status?: string;
    amount?: number | string;
    gateway?: string | null;
  }>;
  review?: { rating?: number | null; comment?: string | null } | null;
};

type ApiDriver = {
  driver_id: number;
  status?: string | null;
  user?: { name?: string | null; email?: string | null; phone?: string | null };
  trucks?: Array<{ license_plate?: string | null; truck_type?: string | null }>;
};

const OrdersManagement = ({ language }: { language: string }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<ApiOrder | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Transfer-order panel state
  const [transferOpen, setTransferOpen] = useState(false);
  const [driverSearch, setDriverSearch] = useState('');
  const [drivers, setDrivers] = useState<ApiDriver[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [transferDriverId, setTransferDriverId] = useState<number | null>(null);
  const [transferNote, setTransferNote] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  const resetTransfer = () => {
    setTransferOpen(false);
    setDriverSearch('');
    setDrivers([]);
    setTransferDriverId(null);
    setTransferNote('');
    setTransferring(false);
    setTransferError(null);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
        status: statusFilter,
      });
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      const { data } = await platformFetch<{
        success: boolean;
        data: ApiOrder[];
        pagination?: { total: number };
      }>(`/api/superuser/orders?${params}`);
      setOrders(Array.isArray(data.data) ? data.data : []);
      setTotal(data.pagination?.total ?? 0);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Failed to load orders',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [statusFilter]);

  const openDetail = async (id: number) => {
    setSelectedId(id);
    setDetail(null);
    setDetailLoading(true);
    try {
      const { data } = await platformFetch<{ success: boolean; data: ApiOrder }>(
        `/api/superuser/orders/${id}`,
      );
      setDetail(data.data);
    } catch (e) {
      // Fall back to list row if detail endpoint fails
      const row = orders.find((o) => o.order_id === id) || null;
      setDetail(row);
      if (!row) {
        setError(
          e instanceof Error
            ? e.message
            : (e as { message?: string }).message || 'Failed to load order',
        );
        setSelectedId(null);
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const loadDrivers = async (search: string) => {
    setDriversLoading(true);
    setTransferError(null);
    try {
      const params = new URLSearchParams({ page: '1', limit: '20', verified: 'true' });
      if (search.trim()) params.set('search', search.trim());
      const { data } = await platformFetch<{ success: boolean; data: ApiDriver[] }>(
        `/api/superuser/drivers?${params}`,
      );
      const rows = Array.isArray(data.data) ? data.data : [];
      setDrivers(rows.filter((d) => d.driver_id !== detail?.driver?.driver_id));
    } catch (e) {
      setTransferError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Failed to load drivers',
      );
    } finally {
      setDriversLoading(false);
    }
  };

  const openTransfer = () => {
    setTransferOpen(true);
    setTransferDriverId(null);
    setTransferError(null);
    void loadDrivers('');
  };

  const submitTransfer = async () => {
    if (selectedId == null || transferDriverId == null) return;
    setTransferring(true);
    setTransferError(null);
    try {
      await platformFetch(`/api/superuser/orders/${selectedId}/reassign`, {
        method: 'POST',
        body: JSON.stringify({
          new_driver_id: transferDriverId,
          ...(transferNote.trim() ? { note: transferNote.trim() } : {}),
        }),
      });
      resetTransfer();
      await openDetail(selectedId);
      void load();
    } catch (e) {
      setTransferring(false);
      setTransferError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Transfer failed',
      );
    }
  };

  const labels = useMemo(
    () =>
      language === 'ar'
        ? {
            title: 'الطلبات',
            search: 'بحث',
            refresh: 'تحديث',
            id: 'المعرّف',
            customer: 'العميل',
            driver: 'السائق',
            status: 'الحالة',
            amount: 'المبلغ',
            created: 'تاريخ الإنشاء',
            pickup: 'الاستلام',
            empty: 'لا توجد طلبات',
            details: 'تفاصيل الطلب',
            locations: 'المواقع',
            payments: 'المدفوعات',
            transfer: 'طلب تحويل',
            callCustomer: 'اتصال بالعميل',
            emailCustomer: 'مراسلة العميل',
            callDriver: 'اتصال بالسائق',
            emailDriver: 'مراسلة السائق',
            transferOrder: 'تحويل الطلب',
            searchDrivers: 'ابحث عن سائق…',
            noDrivers: 'لا يوجد سائقون',
            transferNote: 'ملاحظة (اختياري)',
            confirmTransfer: 'تأكيد التحويل',
            cancel: 'إلغاء',
            select: 'اختيار',
            selected: 'محدّد',
          }
        : {
            title: 'Orders',
            search: 'Search',
            refresh: 'Refresh',
            id: 'ID',
            customer: 'Customer',
            driver: 'Driver',
            status: 'Status',
            amount: 'Amount',
            created: 'Created',
            pickup: 'Pickup',
            empty: 'No orders found',
            details: 'Order details',
            locations: 'Locations',
            payments: 'Payments',
            transfer: 'Transfer requested',
            callCustomer: 'Call customer',
            emailCustomer: 'Email customer',
            callDriver: 'Call driver',
            emailDriver: 'Email driver',
            transferOrder: 'Transfer order',
            searchDrivers: 'Search drivers…',
            noDrivers: 'No drivers found',
            transferNote: 'Note (optional)',
            confirmTransfer: 'Confirm transfer',
            cancel: 'Cancel',
            select: 'Select',
            selected: 'Selected',
          },
    [language],
  );

  const money = (v: number | string | null | undefined) =>
    v != null && v !== '' ? `OMR ${Number(v).toFixed(3)}` : '—';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">
          {labels.title}{' '}
          <span className="text-sm font-normal text-gray-500">({total})</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-8 w-56"
              placeholder={labels.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void load()}
            />
          </div>
          <select
            className="border rounded px-3 py-2 text-sm bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Active">Active</option>
            <option value="OnRoute">On Route</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <Button type="button" variant="outline" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {labels.refresh}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading…
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{labels.id}</TableHead>
                <TableHead>{labels.customer}</TableHead>
                <TableHead>{labels.driver}</TableHead>
                <TableHead>{labels.pickup}</TableHead>
                <TableHead>{labels.status}</TableHead>
                <TableHead>{labels.amount}</TableHead>
                <TableHead>{labels.created}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    {labels.empty}
                  </TableCell>
                </TableRow>
              )}
              {orders.map((o) => {
                const pickup = o.orderLocations?.find(
                  (l) => l.location_type === 'pickup',
                )?.address;
                return (
                  <TableRow
                    key={o.order_id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => void openDetail(o.order_id)}
                  >
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center gap-1">
                        #{o.order_id}
                        {o.transfer_requested ? (
                          <ArrowRightLeft className="h-3.5 w-3.5 text-amber-600" />
                        ) : null}
                      </span>
                    </TableCell>
                    <TableCell>
                      {o.customer?.user?.name ||
                        o.receiving_party ||
                        o.customer?.user?.email ||
                        '—'}
                    </TableCell>
                    <TableCell>{o.driver?.user?.name || '—'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {pickup || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{o.status}</Badge>
                    </TableCell>
                    <TableCell>{money(o.payment_amount)}</TableCell>
                    <TableCell>
                      {o.created_at
                        ? new Date(o.created_at).toLocaleString()
                        : '—'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={selectedId != null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null);
            setDetail(null);
            resetTransfer();
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {labels.details} #{selectedId}
            </DialogTitle>
            <DialogDescription>
              {detail?.status ? (
                <Badge variant="secondary">{detail.status}</Badge>
              ) : null}
              {detail?.transfer_requested ? (
                <Badge className="ml-2 bg-amber-500 hover:bg-amber-500">
                  {labels.transfer}
                </Badge>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          {detailLoading || !detail ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-5 text-sm">
              <div className="flex flex-wrap gap-2">
                {detail.customer?.user?.phone ? (
                  <Button asChild size="sm" variant="outline">
                    <a href={`tel:${detail.customer.user.phone}`}>
                      <Phone className="h-4 w-4 mr-1.5" />
                      {labels.callCustomer}
                    </a>
                  </Button>
                ) : detail.customer?.user?.email ? (
                  <Button asChild size="sm" variant="outline">
                    <a href={`mailto:${detail.customer.user.email}`}>
                      <Mail className="h-4 w-4 mr-1.5" />
                      {labels.emailCustomer}
                    </a>
                  </Button>
                ) : null}
                {detail.driver?.user?.phone ? (
                  <Button asChild size="sm" variant="outline">
                    <a href={`tel:${detail.driver.user.phone}`}>
                      <Phone className="h-4 w-4 mr-1.5" />
                      {labels.callDriver}
                    </a>
                  </Button>
                ) : detail.driver?.user?.email ? (
                  <Button asChild size="sm" variant="outline">
                    <a href={`mailto:${detail.driver.user.email}`}>
                      <Mail className="h-4 w-4 mr-1.5" />
                      {labels.emailDriver}
                    </a>
                  </Button>
                ) : null}
                {detail.status !== 'Completed' && detail.status !== 'Cancelled' ? (
                  <Button
                    size="sm"
                    variant={transferOpen ? 'secondary' : 'default'}
                    onClick={() => (transferOpen ? resetTransfer() : openTransfer())}
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-1.5" />
                    {labels.transferOrder}
                  </Button>
                ) : null}
              </div>

              {transferOpen ? (
                <div className="rounded-md border p-3 space-y-3 bg-gray-50/50">
                  <div className="flex gap-2">
                    <Input
                      className="h-9"
                      placeholder={labels.searchDrivers}
                      value={driverSearch}
                      onChange={(e) => setDriverSearch(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && void loadDrivers(driverSearch)
                      }
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-9"
                      onClick={() => void loadDrivers(driverSearch)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  {driversLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  ) : drivers.length === 0 ? (
                    <p className="text-gray-500 text-center py-2">
                      {labels.noDrivers}
                    </p>
                  ) : (
                    <ul className="max-h-52 overflow-y-auto divide-y rounded border bg-white">
                      {drivers.map((d) => {
                        const truck = d.trucks?.[0];
                        const isSelected = transferDriverId === d.driver_id;
                        return (
                          <li
                            key={d.driver_id}
                            className="flex items-center justify-between gap-2 p-2"
                          >
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {d.user?.name || `#${d.driver_id}`}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {[
                                  d.user?.phone,
                                  truck
                                    ? `${truck.truck_type || ''} ${truck.license_plate || ''}`.trim()
                                    : null,
                                ]
                                  .filter(Boolean)
                                  .join(' · ')}
                              </p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant={isSelected ? 'default' : 'outline'}
                              onClick={() =>
                                setTransferDriverId(isSelected ? null : d.driver_id)
                              }
                            >
                              {isSelected ? labels.selected : labels.select}
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  <Input
                    className="h-9"
                    placeholder={labels.transferNote}
                    value={transferNote}
                    onChange={(e) => setTransferNote(e.target.value)}
                  />
                  {transferError ? (
                    <p className="text-sm text-red-600">{transferError}</p>
                  ) : null}
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={resetTransfer}
                    >
                      {labels.cancel}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={transferDriverId == null || transferring}
                      onClick={() => void submitTransfer()}
                    >
                      {transferring ? (
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      ) : (
                        <ArrowRightLeft className="h-4 w-4 mr-1.5" />
                      )}
                      {labels.confirmTransfer}
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-500">{labels.customer}</p>
                  <p className="font-medium">
                    {detail.customer?.user?.name || '—'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {detail.customer?.user?.phone ||
                      detail.customer?.user?.email ||
                      ''}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">{labels.driver}</p>
                  <p className="font-medium">
                    {detail.driver?.user?.name || '—'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {detail.driver?.trucks?.[0]
                      ? `${detail.driver.trucks[0].truck_type || ''} ${detail.driver.trucks[0].license_plate || ''}`.trim()
                      : detail.driver?.user?.phone || ''}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Recipient</p>
                  <p className="font-medium">{detail.receiving_party || '—'}</p>
                  <p className="text-xs text-gray-500">
                    {detail.receiving_party_phone || ''}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">{labels.amount}</p>
                  <p className="font-medium">{money(detail.payment_amount)}</p>
                  <p className="text-xs text-gray-500">
                    {detail.payment_method || '—'}
                    {detail.tip_amount != null
                      ? ` · tip ${money(detail.tip_amount)}`
                      : ''}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Vehicle / type</p>
                  <p className="font-medium">
                    {[detail.vehicle_type, detail.order_type, detail.schedule_type]
                      .filter(Boolean)
                      .join(' · ') || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Pickup time</p>
                  <p className="font-medium">
                    {detail.pickup_datetime
                      ? new Date(detail.pickup_datetime).toLocaleString()
                      : '—'}
                  </p>
                </div>
              </div>

              {detail.cargo_description || detail.special_instructions ? (
                <div className="space-y-1">
                  {detail.cargo_description ? (
                    <p>
                      <span className="text-gray-500">Cargo: </span>
                      {detail.cargo_description}
                    </p>
                  ) : null}
                  {detail.special_instructions ? (
                    <p>
                      <span className="text-gray-500">Instructions: </span>
                      {detail.special_instructions}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {detail.transfer_requested ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                  <p className="font-medium text-amber-800">{labels.transfer}</p>
                  <p className="text-amber-900 mt-1">
                    {detail.transfer_request_reason || '—'}
                  </p>
                  {detail.transfer_requested_at ? (
                    <p className="text-xs text-amber-700 mt-1">
                      {new Date(detail.transfer_requested_at).toLocaleString()}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div>
                <h4 className="font-semibold mb-2">{labels.locations}</h4>
                <ul className="space-y-2">
                  {(detail.orderLocations || []).map((loc, i) => (
                    <li
                      key={loc.location_id ?? i}
                      className="rounded border p-2"
                    >
                      <Badge variant="outline" className="mb-1">
                        {loc.location_type || 'stop'}
                      </Badge>
                      <p>{loc.address || '—'}</p>
                      {loc.latitude != null && loc.longitude != null ? (
                        <p className="text-xs text-gray-400">
                          {loc.latitude}, {loc.longitude}
                        </p>
                      ) : null}
                    </li>
                  ))}
                  {(detail.orderLocations || []).length === 0 ? (
                    <li className="text-gray-500">—</li>
                  ) : null}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{labels.payments}</h4>
                {(detail.payments || []).length === 0 ? (
                  <p className="text-gray-500">—</p>
                ) : (
                  <ul className="space-y-1">
                    {detail.payments!.map((p, i) => (
                      <li key={p.payment_id ?? i}>
                        #{p.payment_id} · {p.status} · {money(p.amount)}
                        {p.gateway ? ` · ${p.gateway}` : ''}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {detail.review ? (
                <div>
                  <h4 className="font-semibold mb-1">Review</h4>
                  <p>
                    {detail.review.rating != null
                      ? `${detail.review.rating}/5`
                      : '—'}
                    {detail.review.comment
                      ? ` — ${detail.review.comment}`
                      : ''}
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;
