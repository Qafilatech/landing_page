import { useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  RefreshCw,
  Search,
  Phone,
  Mail,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from 'lucide-react';
import { platformFetch } from '@/lib/platformApi';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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

type ApiTruck = {
  truck_id: number;
  license_plate?: string | null;
  truck_type?: string | null;
  vehicle_size?: string | null;
  vehicle_year?: number | null;
  vehicle_detail?: string | null;
  insurance_company_details?: string | null;
  insurance_id?: string | null;
  insurance_expiry?: string | null;
  insurance_card_upload?: string | null;
  vehicle_registration_upload?: string | null;
  vehicle_photo?: string | null;
  truck_photo?: string | null;
};

type ApiDriver = {
  driver_id: number;
  status?: string | null;
  driver_type?: string | null;
  license_number?: string | null;
  is_verified?: boolean;
  kyc_status?: string | null;
  kyc_denied_reason?: string | null;
  id_card_upload?: string | null;
  drivers_license_upload?: string | null;
  vehicle_registration_upload?: string | null;
  insurance_card_upload?: string | null;
  attachment_url?: string | null;
  rating_avg?: number | null;
  user?: {
    name?: string | null;
    display_name?: string | null;
    email?: string | null;
    phone?: string | null;
    created_at?: string;
  };
  trucks?: ApiTruck[];
  business?: { company_name?: string | null } | null;
  edit_requests?: Array<{
    request_id: number;
    kind: string;
    status: string;
    created_at?: string;
  }>;
};

function DocLink({
  label,
  url,
}: {
  label: string;
  url?: string | null;
}) {
  if (!url) {
    return (
      <div className="rounded border border-dashed p-3 text-sm text-gray-400">
        {label}: not uploaded
      </div>
    );
  }
  const isImg = /\.(png|jpe?g|webp|gif)(\?|$)/i.test(url);
  return (
    <div className="rounded border p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
        >
          Open <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      {isImg ? (
        <a href={url} target="_blank" rel="noreferrer">
          <img
            src={url}
            alt={label}
            className="max-h-40 w-full object-contain rounded bg-gray-50"
          />
        </a>
      ) : (
        <p className="text-xs text-gray-500 break-all">{url}</p>
      )}
    </div>
  );
}

const DriversManagement = ({
  language,
  initialVerifiedFilter,
}: {
  language: string;
  initialVerifiedFilter?: 'all' | 'true' | 'false';
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'true' | 'false' | 'denied'>(
    initialVerifiedFilter === 'false'
      ? 'false'
      : initialVerifiedFilter === 'true'
        ? 'true'
        : 'all',
  );
  const [drivers, setDrivers] = useState<ApiDriver[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<ApiDriver | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [acting, setActing] = useState(false);
  const [denyReason, setDenyReason] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [insuranceId, setInsuranceId] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [plate, setPlate] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
        status: statusFilter,
      });
      if (verifiedFilter === 'denied') {
        params.set('kyc_status', 'denied');
      } else if (verifiedFilter === 'false') {
        params.set('kyc_status', 'pending');
      } else if (verifiedFilter === 'true') {
        params.set('kyc_status', 'verified');
      } else {
        params.set('verified', 'all');
      }
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      const { data } = await platformFetch<{
        success: boolean;
        data: ApiDriver[];
        pagination?: { total: number };
      }>(`/api/superuser/drivers?${params}`);
      setDrivers(Array.isArray(data.data) ? data.data : []);
      setTotal(data.pagination?.total ?? 0);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Failed to load drivers',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [statusFilter, verifiedFilter]);

  useEffect(() => {
    if (initialVerifiedFilter) setVerifiedFilter(initialVerifiedFilter);
  }, [initialVerifiedFilter]);

  const openDetail = async (id: number) => {
    setSelectedId(id);
    setDetail(null);
    setDetailLoading(true);
    setDenyReason('');
    try {
      const { data } = await platformFetch<{ success: boolean; data: ApiDriver }>(
        `/api/superuser/drivers/${id}`,
      );
      const d = data.data;
      setDetail(d);
      setLicenseNumber(d.license_number || '');
      const truck = d.trucks?.[0];
      setInsuranceCompany(truck?.insurance_company_details || '');
      setInsuranceId(truck?.insurance_id || '');
      setInsuranceExpiry(
        truck?.insurance_expiry
          ? String(truck.insurance_expiry).slice(0, 10)
          : '',
      );
      setPlate(truck?.license_plate || '');
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Failed to load driver',
      );
      setSelectedId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const submitKyc = async (action: 'approve' | 'deny') => {
    if (!selectedId) return;
    setActing(true);
    setError(null);
    try {
      await platformFetch(`/api/superuser/drivers/${selectedId}/kyc`, {
        method: 'POST',
        body: JSON.stringify({
          action,
          reason: denyReason || undefined,
          fields: { license_number: licenseNumber || undefined },
          truck_fields: {
            truck_id: detail?.trucks?.[0]?.truck_id,
            insurance_company_details: insuranceCompany || undefined,
            insurance_id: insuranceId || undefined,
            insurance_expiry: insuranceExpiry || undefined,
            license_plate: plate || undefined,
          },
        }),
      });
      setSelectedId(null);
      setDetail(null);
      await load();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'KYC action failed',
      );
    } finally {
      setActing(false);
    }
  };

  const labels = useMemo(
    () =>
      language === 'ar'
        ? {
            title: 'السائقون',
            search: 'بحث',
            refresh: 'تحديث',
            name: 'الاسم',
            contact: 'التواصل',
            vehicle: 'المركبة',
            status: 'الحالة',
            type: 'النوع',
            kyc: 'التحقق',
            empty: 'لا يوجد سائقون',
            unverified: 'غير موثّق',
            verified: 'موثّق',
            denied: 'مرفوض',
            needsReview: 'يحتاج مراجعة',
            approve: 'اعتماد',
            deny: 'رفض',
            docs: 'المستندات',
            details: 'تفاصيل السائق',
            license: 'رقم الرخصة',
            insuranceCo: 'شركة التأمين',
            insuranceId: 'رقم التأمين',
            insuranceExp: 'انتهاء التأمين',
            plate: 'لوحة المركبة',
            denyReason: 'سبب الرفض',
            allVerified: 'كل حالات التحقق',
            onlyUnverified: 'بانتظار المراجعة',
            onlyVerified: 'موثّقين',
            onlyDenied: 'مرفوضين',
            id: 'المعرّف',
          }
        : {
            title: 'Drivers',
            search: 'Search',
            refresh: 'Refresh',
            name: 'Name',
            contact: 'Contact',
            vehicle: 'Vehicle',
            status: 'Status',
            type: 'Type',
            kyc: 'KYC',
            empty: 'No drivers found',
            unverified: 'Unverified',
            verified: 'Verified',
            denied: 'Denied',
            needsReview: 'Needs review',
            approve: 'Approve',
            deny: 'Deny',
            docs: 'Uploaded documents',
            details: 'Driver details',
            license: 'License number',
            insuranceCo: 'Insurance company',
            insuranceId: 'Insurance ID',
            insuranceExp: 'Insurance expiry',
            plate: 'License plate',
            denyReason: 'Denial reason',
            allVerified: 'All KYC',
            onlyUnverified: 'Pending review',
            onlyVerified: 'Verified',
            onlyDenied: 'Denied',
            id: 'ID',
          },
    [language],
  );

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
            value={verifiedFilter}
            onChange={(e) =>
              setVerifiedFilter(
                e.target.value as 'all' | 'true' | 'false' | 'denied',
              )
            }
          >
            <option value="all">{labels.allVerified}</option>
            <option value="false">{labels.onlyUnverified}</option>
            <option value="true">{labels.onlyVerified}</option>
            <option value="denied">{labels.onlyDenied}</option>
          </select>
          <select
            className="border rounded px-3 py-2 text-sm bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All status</option>
            <option value="available">Available</option>
            <option value="on_trip">On trip</option>
            <option value="offline">Offline</option>
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
                <TableHead>{labels.name}</TableHead>
                <TableHead>{labels.contact}</TableHead>
                <TableHead>{labels.vehicle}</TableHead>
                <TableHead>{labels.type}</TableHead>
                <TableHead>{labels.kyc}</TableHead>
                <TableHead>{labels.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    {labels.empty}
                  </TableCell>
                </TableRow>
              )}
              {drivers.map((d) => {
                const truck = d.trucks?.[0];
                const kyc =
                  d.kyc_status ||
                  (d.is_verified ? 'verified' : 'pending');
                const needsReview = kyc === 'pending';
                return (
                  <TableRow
                    key={d.driver_id}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      needsReview
                        ? 'bg-amber-50/60'
                        : kyc === 'denied'
                          ? 'bg-slate-50'
                          : ''
                    }`}
                    onClick={() => void openDetail(d.driver_id)}
                  >
                    <TableCell className="font-mono text-sm text-gray-700">
                      #{d.driver_id}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2 flex-wrap">
                        {d.user?.name || `Driver #${d.driver_id}`}
                        {needsReview && (
                          <Badge className="bg-amber-500 hover:bg-amber-500">
                            {labels.needsReview}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm text-gray-600">
                        {d.user?.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {d.user.phone}
                          </div>
                        )}
                        {d.user?.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {d.user.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {truck
                        ? `${truck.truck_type || truck.vehicle_size || 'Vehicle'} · ${truck.license_plate || '—'}`
                        : '—'}
                    </TableCell>
                    <TableCell>{d.driver_type || '—'}</TableCell>
                    <TableCell>
                      {kyc === 'verified' ? (
                        <Badge className="bg-green-600 hover:bg-green-600">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          {labels.verified}
                        </Badge>
                      ) : kyc === 'denied' ? (
                        <Badge className="bg-slate-800 hover:bg-slate-800">
                          <ShieldX className="h-3 w-3 mr-1" />
                          {labels.denied}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <ShieldAlert className="h-3 w-3 mr-1" />
                          {labels.unverified}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{d.status || 'unknown'}</Badge>
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
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{labels.details}</DialogTitle>
            <DialogDescription>
              {detail?.user?.name ||
                (selectedId ? `Driver #${selectedId}` : '')}
              {selectedId != null ? (
                <span className="ms-2 font-mono text-xs text-gray-500">
                  ID #{selectedId}
                </span>
              ) : null}
              {detail &&
              (detail.kyc_status ||
                (detail.is_verified ? 'verified' : 'pending')) === 'pending' ? (
                <Badge className="ml-2 bg-amber-500 hover:bg-amber-500 align-middle">
                  {labels.needsReview}
                </Badge>
              ) : detail?.kyc_status === 'denied' ? (
                <Badge className="ml-2 bg-slate-800 hover:bg-slate-800 align-middle">
                  {labels.denied}
                </Badge>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          {detailLoading || !detail ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Email</span>
                  <p className="font-medium">{detail.user?.email || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone</span>
                  <p className="font-medium">{detail.user?.phone || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Status</span>
                  <p className="font-medium">{detail.status || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Type</span>
                  <p className="font-medium">{detail.driver_type || '—'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Joined</span>
                  <p className="font-medium">
                    {detail.user?.created_at
                      ? new Date(detail.user.created_at).toLocaleString()
                      : '—'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Business</span>
                  <p className="font-medium">
                    {detail.business?.company_name || '—'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{labels.docs}</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <DocLink label="ID card" url={detail.id_card_upload} />
                  <DocLink
                    label="Driving licence"
                    url={detail.drivers_license_upload}
                  />
                  <DocLink
                    label="Vehicle registration"
                    url={
                      detail.vehicle_registration_upload ||
                      detail.trucks?.[0]?.vehicle_registration_upload
                    }
                  />
                  <DocLink
                    label="Insurance card"
                    url={
                      detail.insurance_card_upload ||
                      detail.trucks?.[0]?.insurance_card_upload
                    }
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="license">{labels.license}</Label>
                  <Input
                    id="license"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="plate">{labels.plate}</Label>
                  <Input
                    id="plate"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="insCo">{labels.insuranceCo}</Label>
                  <Input
                    id="insCo"
                    value={insuranceCompany}
                    onChange={(e) => setInsuranceCompany(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="insId">{labels.insuranceId}</Label>
                  <Input
                    id="insId"
                    value={insuranceId}
                    onChange={(e) => setInsuranceId(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="insExp">{labels.insuranceExp}</Label>
                  <Input
                    id="insExp"
                    type="date"
                    value={insuranceExpiry}
                    onChange={(e) => setInsuranceExpiry(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="denyReason">{labels.denyReason}</Label>
                  <Input
                    id="denyReason"
                    value={denyReason}
                    onChange={(e) => setDenyReason(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={acting}
                  onClick={() => void submitKyc('deny')}
                >
                  {acting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {labels.deny}
                </Button>
                <Button
                  type="button"
                  disabled={acting}
                  onClick={() => void submitKyc('approve')}
                >
                  {acting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {labels.approve}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriversManagement;
