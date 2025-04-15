import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Truck, Package, BarChart, Settings, Users } from 'lucide-react';
import Dashboard from './dashboardPages/Dashboard';
import DriversManagement from './dashboardPages/Drivers';
import OrdersManagement from './dashboardPages/Orders';
import SettingsManagement from './dashboardPages/Settings';
import ActiveVehiclesManagement from './dashboardPages/Vehicles';

const isAdmin = () => {
  return localStorage.getItem('userRole') === 'admin';
};

const Admin = () => {
  const { language, texts } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'drivers' | 'vehicles' |'orders' | 'settings'>('dashboard');
  const [dateRange, setDateRange] = useState('week');

  const adminTexts = {
    en: {
      adminPanel: 'Admin Panel',
      dashboard: 'Dashboard',
      drivers: 'Drivers',
      orders: 'Orders',
      settings: 'Settings',
      backToHome: 'Back to home',
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
      todayPerformance: 'Today\'s Performance',
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
      vehicles: 'Vehicles'
    },
    ar: {
      adminPanel: 'لوحة الإدارة',
      dashboard: 'لوحة القيادة',
      drivers: 'السائقين',
      orders: 'الطلبات',
      settings: 'الإعدادات',
      backToHome: 'العودة إلى الصفحة الرئيسية',
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
      vehicles: 'المركبات'
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'ar-SA', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard 
          language={language} 
          adminTexts={adminTexts} 
          dateRange={dateRange} 
          setDateRange={setDateRange} 
          formatCurrency={formatCurrency} 
        />;
      case 'drivers':
        return <DriversManagement language={language} />;
      case 'orders':
        return <OrdersManagement language={language} />;
      case 'settings':
        return <SettingsManagement language={language} />;
      case 'vehicles':
        return <ActiveVehiclesManagement language={language}/>
      default:
        return null;
    }  
  };

  if (!isAdmin()) {
    return <Navigate to="/" />;
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="flex flex-col md:flex-row h-screen">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white p-4 shadow-md md:sticky md:top-0 md:h-screen overflow-y-auto">
          <h1 className="text-xl font-bold mb-8">{adminTexts[language].adminPanel}</h1>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <BarChart className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{adminTexts[language].dashboard}</span>
            </button>
            
            <button
              onClick={() => setActiveTab('drivers')}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'drivers' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <Users className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{adminTexts[language].drivers}</span>
            </button>

            <button
              onClick={() => setActiveTab('vehicles')}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'vehicles' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <Truck className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{adminTexts[language].vehicles}</span>
            </button>
            
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <Package className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{adminTexts[language].orders}</span>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
            >
              <Settings className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              <span>{adminTexts[language].settings}</span>
            </button>
          </nav>
          
          <div className="mt-auto pt-8">
            <Link to="/" className="text-primary hover:text-primary/80 flex items-center">
              <ArrowLeft className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'} ${language === 'ar' ? 'transform rotate-180' : ''}`} />
              {texts[language].backToHome}
            </Link>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;