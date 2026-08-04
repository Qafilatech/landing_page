import { useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { platformFetch } from '@/lib/platformApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Row = {
  truckId: number;
  plate: string;
  type: string;
  size: string;
  driverName: string;
  driverStatus: string;
  active: boolean;
};

const ActiveVehiclesManagement = ({ language }: { language: string }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await platformFetch<{
        success: boolean;
        data: Array<{
          status?: string | null;
          user?: { name?: string | null };
          trucks?: Array<{
            truck_id: number;
            plate_number?: string | null;
            license_plate?: string | null;
            vehicle_type?: string | null;
            truck_type?: string | null;
            vehicle_size?: string | null;
            is_active?: boolean;
          }>;
        }>;
      }>('/api/superuser/drivers?limit=100');
      const flat: Row[] = [];
      for (const d of data.data || []) {
        for (const t of d.trucks || []) {
          flat.push({
            truckId: t.truck_id,
            plate: t.license_plate || t.plate_number || '—',
            type: t.truck_type || t.vehicle_type || '—',
            size: t.vehicle_size || '—',
            driverName: d.user?.name || '—',
            driverStatus: d.status || '—',
            active: t.is_active !== false,
          });
        }
      }
      setRows(flat);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Failed to load vehicles',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const labels = useMemo(
    () =>
      language === 'ar'
        ? {
            title: 'المركبات',
            plate: 'اللوحة',
            type: 'النوع',
            size: 'الحجم',
            driver: 'السائق',
            status: 'حالة السائق',
            active: 'نشطة',
            empty: 'لا توجد مركبات',
            refresh: 'تحديث',
          }
        : {
            title: 'Vehicles',
            plate: 'Plate',
            type: 'Type',
            size: 'Size',
            driver: 'Driver',
            status: 'Driver status',
            active: 'Active',
            empty: 'No vehicles found',
            refresh: 'Refresh',
          },
    [language],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{labels.title}</h2>
        <Button type="button" variant="outline" onClick={() => void load()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {labels.refresh}
        </Button>
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
                <TableHead>{labels.plate}</TableHead>
                <TableHead>{labels.type}</TableHead>
                <TableHead>{labels.size}</TableHead>
                <TableHead>{labels.driver}</TableHead>
                <TableHead>{labels.status}</TableHead>
                <TableHead>{labels.active}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    {labels.empty}
                  </TableCell>
                </TableRow>
              )}
              {rows.map((r) => (
                <TableRow key={r.truckId}>
                  <TableCell className="font-medium">{r.plate}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.size}</TableCell>
                  <TableCell>{r.driverName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{r.driverStatus}</Badge>
                  </TableCell>
                  <TableCell>{r.active ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ActiveVehiclesManagement;
