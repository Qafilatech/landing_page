import { useEffect, useMemo, useState } from 'react';
import { Loader2, Mail, Phone, RefreshCw, Search } from 'lucide-react';
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

type ApiIncident = {
  incident_id: string;
  order_id?: number | null;
  category?: string | null;
  subcategory?: string | null;
  description?: string | null;
  user_comments?: string | null;
  status: string;
  images?: string[];
  created_at?: string;
  resolved_at?: string | null;
  acknowledged_at?: string | null;
  user?: {
    user_id: number;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    user_type?: string | null;
  };
};

const STATUS_OPTIONS = ['all', 'open', 'in_progress', 'resolved', 'closed'] as const;

const IncidentsManagement = ({
  language,
  onOpsChange,
}: {
  language: string;
  onOpsChange?: () => void | Promise<void>;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [incidents, setIncidents] = useState<ApiIncident[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<ApiIncident | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
        status: statusFilter,
        role: roleFilter,
      });
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      const { data } = await platformFetch<{
        success: boolean;
        data: ApiIncident[];
        pagination?: { total: number };
      }>(`/api/superuser/incidents?${params}`);
      setIncidents(Array.isArray(data.data) ? data.data : []);
      setTotal(data.pagination?.total ?? 0);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Failed to load incidents',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [statusFilter, roleFilter]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const { data } = await platformFetch<{
        success: boolean;
        data: ApiIncident;
      }>(`/api/superuser/incidents/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (data.data) {
        setIncidents((prev) =>
          prev.map((inc) => (inc.incident_id === id ? data.data : inc)),
        );
        setSelected((prev) =>
          prev?.incident_id === id ? data.data : prev,
        );
      } else {
        await load();
      }
      void onOpsChange?.();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Failed to update incident',
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const openIncident = async (inc: ApiIncident) => {
    setSelected(inc);
    if (inc.acknowledged_at) return;
    try {
      const { data } = await platformFetch<{
        success: boolean;
        data: ApiIncident;
      }>(`/api/superuser/incidents/${encodeURIComponent(inc.incident_id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ acknowledged: true }),
      });
      if (data.data) {
        setIncidents((prev) =>
          prev.map((row) =>
            row.incident_id === inc.incident_id ? data.data : row,
          ),
        );
        setSelected(data.data);
      }
      void onOpsChange?.();
    } catch {
      // Opening the dialog still works even if acknowledge fails.
    }
  };

  const labels = useMemo(
    () =>
      language === 'ar'
        ? {
            title: 'إدارة الحوادث',
            search: 'بحث',
            refresh: 'تحديث',
            empty: 'لا توجد حوادث',
            reporter: 'المبلّغ',
            role: 'الدور',
            category: 'الفئة',
            order: 'الطلب',
            status: 'الحالة',
            created: 'تاريخ الإنشاء',
            actions: 'إجراءات',
            all: 'الكل',
            customers: 'العملاء',
            drivers: 'السائقون',
            open: 'مفتوح',
            in_progress: 'قيد المعالجة',
            resolved: 'محلول',
            closed: 'مغلق',
            total: 'الإجمالي',
            details: 'تفاصيل البلاغ',
            contact: 'بيانات التواصل',
            description: 'الوصف',
            comments: 'تعليقات المستخدم',
            handling: 'ما يجب فعله',
            handlingHint:
              'راجع وصف البلاغ والتواصل مع المبلّغ. حدّث الحالة أثناء المتابعة وأغلقها عند الحل.',
            noPhone: 'لا يوجد رقم هاتف',
            noEmail: 'لا يوجد بريد',
            newBadge: 'جديد',
            clickHint: 'انقر لعرض التفاصيل',
          }
        : {
            title: 'Incident Management',
            search: 'Search',
            refresh: 'Refresh',
            empty: 'No incidents found',
            reporter: 'Reporter',
            role: 'Role',
            category: 'Category',
            order: 'Order',
            status: 'Status',
            created: 'Created',
            actions: 'Actions',
            all: 'All',
            customers: 'Customers',
            drivers: 'Drivers',
            open: 'Open',
            in_progress: 'In progress',
            resolved: 'Resolved',
            closed: 'Closed',
            total: 'Total',
            details: 'Incident details',
            contact: 'Contact details',
            description: 'Description',
            comments: 'User comments',
            handling: 'How to handle',
            handlingHint:
              'Review the report details and contact the reporter. Update the status as you work the case, then mark resolved or closed when done.',
            noPhone: 'No phone on file',
            noEmail: 'No email on file',
            newBadge: 'New',
            clickHint: 'Click a row for details',
          },
    [language],
  );

  const statusLabel = (s: string) =>
    (labels as Record<string, string>)[s] || s;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{labels.title}</h2>
          <p className="text-sm text-gray-500">
            {labels.total}: {total}
            <span className="ms-2 text-gray-400">· {labels.clickHint}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={labels.search}
              className="w-48"
              onKeyDown={(e) => {
                if (e.key === 'Enter') void load();
              }}
            />
            <Button type="button" variant="outline" onClick={() => void load()}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <select
            className="border rounded px-2 py-2 text-sm bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? labels.all : statusLabel(s)}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-2 text-sm bg-white"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">{labels.all}</option>
            <option value="customer">{labels.customers}</option>
            <option value="driver">{labels.drivers}</option>
          </select>
          <Button type="button" variant="outline" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 whitespace-pre-wrap">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{labels.reporter}</TableHead>
                <TableHead>{labels.role}</TableHead>
                <TableHead>{labels.category}</TableHead>
                <TableHead>{labels.order}</TableHead>
                <TableHead>{labels.status}</TableHead>
                <TableHead>{labels.created}</TableHead>
                <TableHead>{labels.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    {labels.empty}
                  </TableCell>
                </TableRow>
              )}
              {incidents.map((inc) => {
                const isNew =
                  !inc.acknowledged_at &&
                  (inc.status === 'open' || inc.status === 'in_progress');
                return (
                  <TableRow
                    key={inc.incident_id}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      isNew ? 'bg-amber-50/60' : ''
                    }`}
                    onClick={() => void openIncident(inc)}
                  >
                    <TableCell>
                      <div className="font-medium flex items-center gap-2">
                        {inc.user?.name || `User #${inc.user?.user_id ?? '—'}`}
                        {isNew ? (
                          <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-[10px]">
                            {labels.newBadge}
                          </Badge>
                        ) : null}
                      </div>
                      <div className="text-xs text-gray-500">
                        {inc.user?.email || inc.user?.phone || '—'}
                      </div>
                      {inc.description && (
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2 max-w-xs">
                          {inc.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {inc.user?.user_type || '—'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {[inc.category, inc.subcategory]
                        .filter(Boolean)
                        .join(' / ') || '—'}
                    </TableCell>
                    <TableCell>
                      {inc.order_id != null ? `#${inc.order_id}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {statusLabel(inc.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {inc.created_at
                        ? new Date(inc.created_at).toLocaleString()
                        : '—'}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <select
                        className="border rounded px-2 py-1 text-sm bg-white"
                        value={inc.status}
                        disabled={updatingId === inc.incident_id}
                        onChange={(e) =>
                          void updateStatus(inc.incident_id, e.target.value)
                        }
                      >
                        {STATUS_OPTIONS.filter((s) => s !== 'all').map((s) => (
                          <option key={s} value={s}>
                            {statusLabel(s)}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>
                );
              })}
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
            <DialogTitle>{labels.details}</DialogTitle>
            <DialogDescription>
              {[selected?.category, selected?.subcategory]
                .filter(Boolean)
                .join(' / ') || '—'}
              {' · '}
              {selected ? statusLabel(selected.status) : ''}
            </DialogDescription>
          </DialogHeader>

          {selected ? (
            <div className="space-y-4 text-sm">
              <div className="rounded-md border bg-gray-50 p-3 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {labels.contact}
                </p>
                <p className="font-medium">
                  {selected.user?.name ||
                    `User #${selected.user?.user_id ?? '—'}`}
                  {selected.user?.user_type ? (
                    <Badge variant="outline" className="ms-2">
                      {selected.user.user_type}
                    </Badge>
                  ) : null}
                </p>
                <div className="flex flex-col gap-1.5">
                  {selected.user?.phone ? (
                    <a
                      href={`tel:${selected.user.phone}`}
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {selected.user.phone}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-gray-400">
                      <Phone className="h-3.5 w-3.5" />
                      {labels.noPhone}
                    </span>
                  )}
                  {selected.user?.email ? (
                    <a
                      href={`mailto:${selected.user.email}`}
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {selected.user.email}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-gray-400">
                      <Mail className="h-3.5 w-3.5" />
                      {labels.noEmail}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">{labels.order}</p>
                  <p className="font-medium">
                    {selected.order_id != null
                      ? `#${selected.order_id}`
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{labels.created}</p>
                  <p className="font-medium">
                    {selected.created_at
                      ? new Date(selected.created_at).toLocaleString()
                      : '—'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  {labels.description}
                </p>
                <p className="whitespace-pre-wrap rounded border p-3 bg-white">
                  {selected.description || '—'}
                </p>
              </div>

              {selected.user_comments ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    {labels.comments}
                  </p>
                  <p className="whitespace-pre-wrap rounded border p-3 bg-white">
                    {selected.user_comments}
                  </p>
                </div>
              ) : null}

              <div className="rounded-md border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-1">
                  {labels.handling}
                </p>
                <p className="text-blue-900/80">{labels.handlingHint}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">{labels.status}</p>
                <select
                  className="border rounded px-2 py-2 text-sm bg-white w-full"
                  value={selected.status}
                  disabled={updatingId === selected.incident_id}
                  onChange={(e) =>
                    void updateStatus(selected.incident_id, e.target.value)
                  }
                >
                  {STATUS_OPTIONS.filter((s) => s !== 'all').map((s) => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncidentsManagement;
