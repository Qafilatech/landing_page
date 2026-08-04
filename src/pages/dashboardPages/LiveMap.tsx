import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import {
  Loader2,
  RefreshCw,
  MapPin,
  Phone,
  X,
  Truck,
  Package,
} from 'lucide-react';
import { platformFetch, getApiBase } from '@/lib/platformApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import 'leaflet/dist/leaflet.css';

type OrderLocation = {
  location_id: number;
  address: string;
  latitude: number;
  longitude: number;
  location_type: string;
};

type FleetDriver = {
  driver_id: number;
  status?: string | null;
  driver_type?: string | null;
  rating_avg?: number | null;
  last_lat?: number | null;
  last_lng?: number | null;
  last_heading?: number | null;
  last_location_at?: string | null;
  location_source?: string | null;
  user?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  trucks?: Array<{
    license_plate?: string | null;
    truck_type?: string | null;
    vehicle_size?: string | null;
  }>;
  business?: { company_name?: string | null } | null;
  active_order?: {
    order_id: number;
    status: string;
    receiving_party?: string | null;
    receiving_party_phone?: string | null;
    payment_amount?: number | string | null;
    locations?: OrderLocation[];
  } | null;
};

const MUSCAT: [number, number] = [23.588, 58.3829];
const POLL_MS = 10_000;

function sortStops(locs: OrderLocation[]): OrderLocation[] {
  const rank = (t: string) => {
    const s = t.toLowerCase();
    if (s.includes('pick')) return 0;
    if (s.includes('way') || s.includes('stop')) return 1;
    if (s.includes('drop') || s.includes('deliv')) return 2;
    return 1;
  };
  return [...locs].sort((a, b) => rank(a.location_type) - rank(b.location_type));
}

function FitToPoints({
  pointsKey,
  points,
}: {
  pointsKey: string;
  points: [number, number][];
}) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14, { animate: true });
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], animate: true });
    // pointsKey intentionally drives re-fit when selection / fleet snapshot changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, pointsKey]);
  return null;
}

function driverDotColor(status?: string | null, hasOrder?: boolean) {
  if (hasOrder || status === 'on_trip') return '#2563eb';
  return '#16a34a';
}

const LiveMapManagement = ({ language }: { language: string }) => {
  const [drivers, setDrivers] = useState<FleetDriver[]>([]);
  const [meta, setMeta] = useState({ total: 0, with_location: 0, with_order: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [routeLine, setRouteLine] = useState<[number, number][]>([]);
  const [routeLoading, setRouteLoading] = useState(false);

  const labels = useMemo(
    () =>
      language === 'ar'
        ? {
            title: 'خريطة الأسطول',
            subtitle: 'السائقون المتصلون والمتاحون',
            search: 'بحث عن سائق…',
            refresh: 'تحديث',
            online: 'متصل',
            onMap: 'على الخريطة',
            withOrder: 'مع طلب',
            available: 'متاح',
            onTrip: 'في رحلة',
            noGps: 'لا موقع',
            showAll: 'عرض الكل',
            details: 'تفاصيل السائق',
            order: 'الطلب النشط',
            vehicle: 'المركبة',
            phone: 'الهاتف',
            route: 'المسار',
            empty: 'لا يوجد سائقون متصلون',
            loadingRoute: 'جاري تحميل المسار…',
            noRoute: 'لا يوجد مسار لهذا الطلب بعد',
            recipient: 'المستلم',
          }
        : {
            title: 'Live fleet map',
            subtitle: 'Online & available drivers',
            search: 'Search drivers…',
            refresh: 'Refresh',
            online: 'Online',
            onMap: 'On map',
            withOrder: 'With order',
            available: 'Available',
            onTrip: 'On trip',
            noGps: 'No GPS',
            showAll: 'Show all',
            details: 'Driver details',
            order: 'Active order',
            vehicle: 'Vehicle',
            phone: 'Phone',
            route: 'Route',
            empty: 'No online drivers',
            loadingRoute: 'Loading route…',
            noRoute: 'No route stops for this order yet',
            recipient: 'Recipient',
          },
    [language],
  );

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const { data } = await platformFetch<{
        success: boolean;
        data: FleetDriver[];
        meta?: { total: number; with_location: number; with_order: number };
      }>('/api/superuser/fleet');
      setDrivers(Array.isArray(data.data) ? data.data : []);
      setMeta({
        total: data.meta?.total ?? 0,
        with_location: data.meta?.with_location ?? 0,
        with_order: data.meta?.with_order ?? 0,
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message || 'Failed to load fleet',
      );
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(true), POLL_MS);
    return () => window.clearInterval(id);
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return drivers;
    return drivers.filter((d) => {
      const name = d.user?.name?.toLowerCase() ?? '';
      const phone = d.user?.phone?.toLowerCase() ?? '';
      const email = d.user?.email?.toLowerCase() ?? '';
      const plate = d.trucks?.[0]?.license_plate?.toLowerCase() ?? '';
      return (
        name.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        plate.includes(q) ||
        String(d.driver_id).includes(q)
      );
    });
  }, [drivers, search]);

  const selected = useMemo(
    () => (selectedId == null ? null : drivers.find((d) => d.driver_id === selectedId) ?? null),
    [drivers, selectedId],
  );

  const visibleDrivers = useMemo(() => {
    if (selectedId == null) return filtered.filter((d) => d.last_lat != null && d.last_lng != null);
    return filtered.filter(
      (d) =>
        d.driver_id === selectedId && d.last_lat != null && d.last_lng != null,
    );
  }, [filtered, selectedId]);

  const fitPoints = useMemo(() => {
    const pts: [number, number][] = [];
    for (const d of visibleDrivers) {
      if (d.last_lat != null && d.last_lng != null) {
        pts.push([d.last_lat, d.last_lng]);
      }
    }
    for (const p of routeLine) pts.push(p);
    if (selected?.active_order?.locations) {
      for (const loc of selected.active_order.locations) {
        pts.push([loc.latitude, loc.longitude]);
      }
    }
    return pts;
  }, [visibleDrivers, routeLine, selected]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setRouteLine([]);
      const order = selected?.active_order;
      if (!order?.locations || order.locations.length < 2) return;

      const stops = sortStops(order.locations).filter(
        (l) => Number.isFinite(l.latitude) && Number.isFinite(l.longitude),
      );
      if (stops.length < 2) return;

      setRouteLoading(true);
      try {
        const origin = stops[0];
        const dest = stops[stops.length - 1];
        const mid = stops.slice(1, -1);
        const params = new URLSearchParams({
          origin_lat: String(origin.latitude),
          origin_lng: String(origin.longitude),
          dest_lat: String(dest.latitude),
          dest_lng: String(dest.longitude),
        });
        if (mid.length) {
          params.set(
            'waypoints',
            mid.map((m) => `${m.latitude},${m.longitude}`).join(';'),
          );
        }

        // Prefer platform maps proxy; fall back to public OSRM if it fails.
        let line: [number, number][] = [];
        try {
          const { data } = await platformFetch<{
            success: boolean;
            data: { polyline?: [number, number][] };
          }>(`/api/maps/route?${params}`);
          const poly = data.data?.polyline ?? [];
          // API returns [lng, lat]
          line = poly.map(([lng, lat]) => [lat, lng] as [number, number]);
        } catch {
          const coords = stops
            .map((s) => `${s.longitude},${s.latitude}`)
            .join(';');
          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
          const res = await fetch(osrmUrl);
          if (res.ok) {
            const body = (await res.json()) as {
              routes?: Array<{ geometry?: { coordinates?: [number, number][] } }>;
            };
            const coordsGeo = body.routes?.[0]?.geometry?.coordinates ?? [];
            line = coordsGeo.map(([lng, lat]) => [lat, lng] as [number, number]);
          }
        }
        if (!cancelled) setRouteLine(line);
      } finally {
        if (!cancelled) setRouteLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selected?.driver_id, selected?.active_order?.order_id]);

  const truckLabel = (d: FleetDriver) => {
    const t = d.trucks?.[0];
    if (!t) return '—';
    return [t.truck_type, t.license_plate].filter(Boolean).join(' · ') || '—';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] min-h-[560px] gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{labels.title}</h2>
          <p className="text-sm text-gray-500">{labels.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="secondary">
            {labels.online}: {meta.total}
          </Badge>
          <Badge variant="secondary">
            {labels.onMap}: {meta.with_location}
          </Badge>
          <Badge variant="secondary">
            {labels.withOrder}: {meta.with_order}
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void load()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ms-2">{labels.refresh}</span>
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-1 min-h-0 gap-3 flex-col lg:flex-row">
        <div className="w-full lg:w-80 shrink-0 flex flex-col bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-3 border-b space-y-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={labels.search}
            />
            {selectedId != null ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setSelectedId(null)}
              >
                <X className="h-4 w-4 me-1" />
                {labels.showAll}
              </Button>
            ) : null}
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">{labels.empty}</p>
            ) : (
              <ul className="divide-y">
                {filtered.map((d) => {
                  const active = d.driver_id === selectedId;
                  const hasGps = d.last_lat != null && d.last_lng != null;
                  const hasOrder = !!d.active_order;
                  return (
                    <li key={d.driver_id}>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedId((prev) =>
                            prev === d.driver_id ? null : d.driver_id,
                          )
                        }
                        className={`w-full text-start px-3 py-3 hover:bg-gray-50 transition ${
                          active ? 'bg-primary/5 ring-inset ring-1 ring-primary/30' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {d.user?.name || `Driver #${d.driver_id}`}
                            </p>
                            <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                              <Truck className="h-3 w-3 shrink-0" />
                              {truckLabel(d)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <Badge
                              className={
                                hasOrder || d.status === 'on_trip'
                                  ? 'bg-blue-600'
                                  : 'bg-green-600'
                              }
                            >
                              {hasOrder || d.status === 'on_trip'
                                ? labels.onTrip
                                : labels.available}
                            </Badge>
                            {!hasGps ? (
                              <span className="text-[10px] text-amber-600">
                                {labels.noGps}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        {hasOrder ? (
                          <p className="text-xs text-blue-700 mt-1.5 flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            #{d.active_order!.order_id} · {d.active_order!.status}
                          </p>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="relative flex-1 min-h-[360px] rounded-lg border overflow-hidden bg-slate-100 shadow-sm">
          <MapContainer
            center={MUSCAT}
            zoom={11}
            className="h-full w-full z-0"
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <FitToPoints
              pointsKey={
                selectedId != null
                  ? `sel-${selectedId}-${routeLine.length}`
                  : `all-${visibleDrivers.map((d) => d.driver_id).join(',')}`
              }
              points={fitPoints}
            />

            {visibleDrivers.map((d) => {
              const lat = d.last_lat!;
              const lng = d.last_lng!;
              const color = driverDotColor(d.status, !!d.active_order);
              return (
                <CircleMarker
                  key={d.driver_id}
                  center={[lat, lng]}
                  radius={selectedId === d.driver_id ? 11 : 8}
                  pathOptions={{
                    color: '#fff',
                    weight: 2,
                    fillColor: color,
                    fillOpacity: 0.95,
                  }}
                  eventHandlers={{
                    click: () => setSelectedId(d.driver_id),
                  }}
                >
                  <Popup>
                    <strong>{d.user?.name || `Driver #${d.driver_id}`}</strong>
                    <br />
                    {truckLabel(d)}
                    {d.active_order ? (
                      <>
                        <br />
                        Order #{d.active_order.order_id} ({d.active_order.status})
                      </>
                    ) : null}
                  </Popup>
                </CircleMarker>
              );
            })}

            {selected?.active_order?.locations?.map((loc) => (
              <Marker
                key={loc.location_id}
                position={[loc.latitude, loc.longitude]}
                icon={L.divIcon({
                  className: 'qafila-stop-marker',
                  html: `<div style="background:${
                    loc.location_type.toLowerCase().includes('pick')
                      ? '#059669'
                      : '#dc2626'
                  };color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:999px;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);white-space:nowrap">${
                    loc.location_type.toLowerCase().includes('pick') ? 'P' : 'D'
                  }</div>`,
                  iconSize: [24, 20],
                  iconAnchor: [12, 10],
                })}
              >
                <Popup>
                  <strong>{loc.location_type}</strong>
                  <br />
                  {loc.address}
                </Popup>
              </Marker>
            ))}

            {routeLine.length > 1 ? (
              <Polyline
                positions={routeLine}
                pathOptions={{ color: '#1d4ed8', weight: 5, opacity: 0.85 }}
              />
            ) : null}
          </MapContainer>

          {selected ? (
            <div className="absolute top-3 end-3 z-[500] w-[min(100%-1.5rem,320px)] rounded-lg bg-white/95 backdrop-blur border shadow-lg p-4 text-sm">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {labels.details}
                  </p>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {selected.user?.name || `Driver #${selected.driver_id}`}
                  </h3>
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-700"
                  onClick={() => setSelectedId(null)}
                  aria-label={labels.showAll}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  {selected.user?.phone || '—'}
                </p>
                <p className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-gray-400" />
                  {truckLabel(selected)}
                </p>
                {selected.business?.company_name ? (
                  <p className="text-xs text-gray-500">
                    {selected.business.company_name}
                  </p>
                ) : null}
                {selected.last_location_at ? (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {new Date(selected.last_location_at).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-xs text-amber-600">{labels.noGps}</p>
                )}
              </div>

              {selected.active_order ? (
                <div className="mt-3 pt-3 border-t space-y-1">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {labels.order}
                  </p>
                  <p className="font-medium">
                    #{selected.active_order.order_id}{' '}
                    <Badge variant="outline">{selected.active_order.status}</Badge>
                  </p>
                  {selected.active_order.receiving_party ? (
                    <p className="text-xs text-gray-600">
                      {labels.recipient}: {selected.active_order.receiving_party}
                      {selected.active_order.receiving_party_phone
                        ? ` · ${selected.active_order.receiving_party_phone}`
                        : ''}
                    </p>
                  ) : null}
                  <p className="text-xs text-gray-500">
                    {labels.route}:{' '}
                    {routeLoading
                      ? labels.loadingRoute
                      : routeLine.length > 1
                        ? `${routeLine.length} pts`
                        : labels.noRoute}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <p className="text-[11px] text-gray-400">
        Tiles: OpenStreetMap / CARTO · Routing: {getApiBase()}/api/maps/route (OSRM
        fallback) · Poll {POLL_MS / 1000}s
      </p>
    </div>
  );
};

export default LiveMapManagement;
