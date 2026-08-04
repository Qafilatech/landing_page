import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Truck,
  Package,
  BarChart,
  Settings,
  Users,
  LogOut,
  AlertTriangle,
  Headphones,
  Map,
  Bell,
  Wallet,
} from 'lucide-react';
import Dashboard from './dashboardPages/Dashboard';
import DriversManagement from './dashboardPages/Drivers';
import OrdersManagement from './dashboardPages/Orders';
import SettingsManagement from './dashboardPages/Settings';
import ActiveVehiclesManagement from './dashboardPages/Vehicles';
import IncidentsManagement from './dashboardPages/Incidents';
import SupportManagement from './dashboardPages/Support';
import LiveMapManagement from './dashboardPages/LiveMap';
import PaymentsManagement from './dashboardPages/Payments';
import {
  fetchSuperuserMe,
  superuserLogout,
  type SuperuserSession,
} from '@/lib/adminAuth';
import { platformFetch } from '@/lib/platformApi';

type AdminTab =
  | 'dashboard'
  | 'live_map'
  | 'drivers'
  | 'vehicles'
  | 'orders'
  | 'payments'
  | 'incidents'
  | 'support'
  | 'settings';

type OpsSummary = {
  unverified_drivers: number;
  transfer_pending: number;
  edit_requests_pending: number;
  open_incidents: number;
  /** Open reports no admin has looked at yet — drives the red badges. */
  unacked_incidents: number;
  total: number;
};

const emptySummary: OpsSummary = {
  unverified_drivers: 0,
  transfer_pending: 0,
  edit_requests_pending: 0,
  open_incidents: 0,
  unacked_incidents: 0,
  total: 0,
};

const Admin = () => {
  const { language, texts } = useLanguage();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [driversVerifiedFilter, setDriversVerifiedFilter] = useState<
    'all' | 'true' | 'false'
  >('all');
  const [supportInitialTab, setSupportInitialTab] = useState<
    'transfers' | 'edit_requests' | undefined
  >(undefined);
  const [dateRange, setDateRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<SuperuserSession | null>(null);
  const [ops, setOps] = useState<OpsSummary>(emptySummary);
  const [bellOpen, setBellOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const adminTexts = {
    en: {
      adminPanel: 'Admin Panel',
      dashboard: 'Dashboard',
      drivers: 'Drivers',
      liveMap: 'Live map',
      orders: 'Orders',
      payments: 'Payments',
      incidents: 'Incidents',
      support: 'Support',
      settings: 'Settings',
      backToHome: 'Back to home',
      opsSubtitle: 'Operations',
      welcomeAdmin: 'Dashboard Overview',
      overview: 'System Overview',
      totalDrivers: 'Total Drivers',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      completedOrders: 'Completed Orders',
      pendingOrders: 'Pending Orders',
      cancelledOrders: 'Cancelled Orders',
      newDrivers: 'New Drivers',
      newCustomers: 'New Customers',
      avgOrderValue: 'Avg. Order Value',
      orderTrends: 'Order Trends',
      revenueTrends: 'Revenue Trends',
      orderStatus: 'Order Status',
      topDrivers: 'Top Performing Drivers',
      todayPerformance: "Today's Performance",
      weekPerformance: 'Week-to-Date Performance',
      filterBy: 'Filter by:',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      ordersLabel: 'Orders',
      revenue: 'Revenue',
      comparedTo: 'compared to',
      yesterday: 'yesterday',
      lastWeek: 'last week',
      vehicles: 'Vehicles',
      unauthorized: 'Unauthorized access',
      signOut: 'Sign out',
      signedInAs: 'Signed in as',
      notifications: 'Actions needed',
      unverifiedDrivers: 'Unverified drivers',
      transferRequests: 'Transfer requests',
      editRequests: 'Profile/doc requests',
      openIncidents: 'Open reports',
      noActions: 'No pending actions',
    },
    ar: {
      adminPanel: 'لوحة الإدارة',
      dashboard: 'لوحة القيادة',
      drivers: 'السائقين',
      liveMap: 'الخريطة المباشرة',
      orders: 'الطلبات',
      payments: 'المدفوعات',
      incidents: 'الحوادث',
      support: 'الدعم',
      settings: 'الإعدادات',
      backToHome: 'العودة إلى الصفحة الرئيسية',
      opsSubtitle: 'العمليات',
      welcomeAdmin: 'نظرة عامة على لوحة القيادة',
      overview: 'نظرة عامة على النظام',
      totalDrivers: 'إجمالي السائقين',
      totalOrders: 'إجمالي الطلبات',
      totalRevenue: 'إجمالي الإيرادات',
      completedOrders: 'الطلبات المكتملة',
      pendingOrders: 'الطلبات المعلقة',
      cancelledOrders: 'الطلبات الملغاة',
      newDrivers: 'سائقين جدد',
      newCustomers: 'عملاء جدد',
      avgOrderValue: 'متوسط قيمة الطلب',
      orderTrends: 'اتجاهات الطلبات',
      revenueTrends: 'اتجاهات الإيرادات',
      orderStatus: 'حالة الطلب',
      topDrivers: 'أفضل السائقين أداءً',
      todayPerformance: 'أداء اليوم',
      weekPerformance: 'أداء الأسبوع حتى تاريخه',
      filterBy: 'تصفية حسب:',
      week: 'أسبوع',
      month: 'شهر',
      year: 'سنة',
      ordersLabel: 'طلبات',
      revenue: 'الإيرادات ',
      comparedTo: 'مقارنة مع',
      yesterday: 'الأمس',
      lastWeek: 'الأسبوع الماضي',
      totalDeliveries: 'التوصيلات',
      vehicles: 'المركبات',
      unauthorized: 'وصول غير مصرح به',
      signOut: 'تسجيل الخروج',
      signedInAs: 'مسجّل كـ',
      notifications: 'إجراءات مطلوبة',
      unverifiedDrivers: 'سائقون غير موثّقين',
      transferRequests: 'طلبات التحويل',
      editRequests: 'طلبات تعديل الملف',
      openIncidents: 'بلاغات مفتوحة',
      noActions: 'لا توجد إجراءات معلّقة',
    },
  };

  const loadOps = useCallback(async () => {
    try {
      const { data } = await platformFetch<{
        success: boolean;
        data: Partial<OpsSummary>;
      }>('/api/superuser/ops-summary');
      if (data.data) {
        const next = { ...emptySummary, ...data.data };
        // Older API builds may omit unacked_incidents; fall back to open count.
        if (data.data.unacked_incidents == null) {
          next.unacked_incidents = next.open_incidents;
        }
        setOps(next);
      }
    } catch {
      // Non-blocking for shell load
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await fetchSuperuserMe();
        if (cancelled) return;
        if (!me) {
          toast({
            title: adminTexts[language].unauthorized,
            variant: 'destructive',
          });
          navigate('/auth');
          return;
        }
        setAdmin(me);
        await loadOps();
      } catch {
        if (!cancelled) {
          toast({
            title: adminTexts[language].unauthorized,
            variant: 'destructive',
          });
          navigate('/auth');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!admin) return;
    const id = window.setInterval(() => void loadOps(), 30_000);
    return () => window.clearInterval(id);
  }, [admin, loadOps]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'ar-SA', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const onSignOut = async () => {
    await superuserLogout();
    navigate('/auth');
  };

  const goDriversUnverified = () => {
    setDriversVerifiedFilter('false');
    setActiveTab('drivers');
    setBellOpen(false);
  };

  const goSupport = (tab: 'transfers' | 'edit_requests') => {
    setSupportInitialTab(tab);
    setActiveTab('support');
    setBellOpen(false);
  };

  const goIncidents = () => {
    setActiveTab('incidents');
    setBellOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading…
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/auth" replace />;
  }

  const t = adminTexts[language];
  // Incidents live on their own tab (and badge) — Support only covers
  // transfers and edit requests.
  const supportBadge = ops.transfer_pending + ops.edit_requests_pending;

  const NavBadge = ({ count }: { count: number }) =>
    count > 0 ? (
      <span className="ms-auto inline-flex min-w-[1.25rem] h-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
        {count > 99 ? '99+' : count}
      </span>
    ) : null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            language={language}
            adminTexts={adminTexts}
            dateRange={dateRange}
            setDateRange={setDateRange}
            formatCurrency={formatCurrency}
          />
        );
      case 'drivers':
        return (
          <DriversManagement
            language={language}
            initialVerifiedFilter={driversVerifiedFilter}
          />
        );
      case 'live_map':
        return <LiveMapManagement language={language} />;
      case 'orders':
        return <OrdersManagement language={language} />;
      case 'payments':
        return <PaymentsManagement language={language} />;
      case 'incidents':
        return <IncidentsManagement language={language} onOpsChange={loadOps} />;
      case 'support':
        return (
          <SupportManagement
            language={language}
            initialTab={supportInitialTab}
          />
        );
      case 'settings':
        return <SettingsManagement language={language} />;
      case 'vehicles':
        return <ActiveVehiclesManagement language={language} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-64 bg-white p-4 shadow-md md:sticky md:top-0 md:h-screen overflow-y-auto flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <img
                src="/QT-Logo/Dark/LogoDark.png"
                alt="QafilaTech"
                className="h-8 w-auto object-contain mb-1"
              />
              <p className="text-[11px] uppercase tracking-wide text-primary font-semibold">
                {t.opsSubtitle}
              </p>
            </div>
            <div className="relative">
              <button
                type="button"
                className="relative rounded-full p-2 hover:bg-gray-100"
                aria-label={t.notifications}
                onClick={() => {
                  setBellOpen((v) => !v);
                  void loadOps();
                }}
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {ops.total > 0 ? (
                  <span className="absolute -top-0.5 -end-0.5 min-w-[1.1rem] h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center px-1">
                    {ops.total > 99 ? '99+' : ops.total}
                  </span>
                ) : null}
              </button>
              {bellOpen ? (
                <div className="absolute end-0 z-50 mt-1 w-72 rounded-lg border bg-white shadow-lg p-2 text-sm">
                  <p className="px-2 py-1.5 font-semibold text-gray-800">
                    {t.notifications}
                  </p>
                  {ops.total === 0 ? (
                    <p className="px-2 py-3 text-gray-500">{t.noActions}</p>
                  ) : (
                    <ul className="space-y-1">
                      {ops.unverified_drivers > 0 ? (
                        <li>
                          <button
                            type="button"
                            className="w-full text-start rounded px-2 py-2 hover:bg-gray-50 flex justify-between gap-2"
                            onClick={goDriversUnverified}
                          >
                            <span>{t.unverifiedDrivers}</span>
                            <BadgeCount n={ops.unverified_drivers} />
                          </button>
                        </li>
                      ) : null}
                      {ops.transfer_pending > 0 ? (
                        <li>
                          <button
                            type="button"
                            className="w-full text-start rounded px-2 py-2 hover:bg-gray-50 flex justify-between gap-2"
                            onClick={() => goSupport('transfers')}
                          >
                            <span>{t.transferRequests}</span>
                            <BadgeCount n={ops.transfer_pending} />
                          </button>
                        </li>
                      ) : null}
                      {ops.edit_requests_pending > 0 ? (
                        <li>
                          <button
                            type="button"
                            className="w-full text-start rounded px-2 py-2 hover:bg-gray-50 flex justify-between gap-2"
                            onClick={() => goSupport('edit_requests')}
                          >
                            <span>{t.editRequests}</span>
                            <BadgeCount n={ops.edit_requests_pending} />
                          </button>
                        </li>
                      ) : null}
                      {ops.unacked_incidents > 0 ? (
                        <li>
                          <button
                            type="button"
                            className="w-full text-start rounded px-2 py-2 hover:bg-gray-50 flex justify-between gap-2"
                            onClick={goIncidents}
                          >
                            <span>{t.openIncidents}</span>
                            <BadgeCount n={ops.unacked_incidents} />
                          </button>
                        </li>
                      ) : null}
                    </ul>
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-6 truncate">
            {t.signedInAs} {admin.email}
          </p>

          <nav className="space-y-2">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <BarChart className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{t.dashboard}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDriversVerifiedFilter('all');
                setActiveTab('drivers');
              }}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'drivers' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <Users className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{t.drivers}</span>
              <NavBadge count={ops.unverified_drivers} />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('live_map')}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'live_map' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <Map className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{t.liveMap}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vehicles')}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'vehicles' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <Truck className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{t.vehicles}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <Package className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{t.orders}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'payments' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <Wallet className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{t.payments}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('incidents')}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'incidents' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <AlertTriangle className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{t.incidents}</span>
              <NavBadge count={ops.unacked_incidents} />
            </button>

            <button
              type="button"
              onClick={() => {
                setSupportInitialTab(undefined);
                setActiveTab('support');
              }}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'support' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <Headphones className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{t.support}</span>
              <NavBadge count={supportBadge} />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <Settings className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{t.settings}</span>
            </button>
          </nav>

          <div className="mt-auto pt-8 space-y-3">
            <button
              type="button"
              onClick={onSignOut}
              className="w-full flex items-center text-sm text-red-600 hover:text-red-700"
            >
              <LogOut className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t.signOut}
            </button>
            <Link to="/" className="text-primary hover:text-primary/80 flex items-center text-sm">
              <ArrowLeft
                className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'} ${language === 'ar' ? 'transform rotate-180' : ''}`}
              />
              {texts[language].backToHome}
            </Link>
          </div>
        </div>

        <div
          className={`flex-1 overflow-auto ${activeTab === 'live_map' ? 'p-3' : 'p-6'}`}
          onClick={() => setBellOpen(false)}
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

function BadgeCount({ n }: { n: number }) {
  return (
    <span className="inline-flex min-w-[1.25rem] h-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
      {n}
    </span>
  );
}

export default Admin;
