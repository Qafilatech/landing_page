import React, {useState, useEffect} from 'react';
import {Navigate, Link} from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import {useToast} from '@/hooks/use-toast';
import { ArrowLeft, Truck, Package, BarChart, Settings, DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  XCircle,
  UserPlus,
  Users,
  Map } from 'lucide-react';
import { LineChart, Line, BarChart as ReBarChart, Bar, PieChart, 
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// Mock admin check - in a real app, this would be tied to authentication
const isAdmin = () => {
    // For demo purposes, check localStorage for admin status
    return localStorage.getItem('userRole') === 'admin';
  };


// Mock data for the dashboard
const mockData = {
  totalDrivers: 128,
  totalOrders: 3456,
  totalRevenue: 87950,
  completedOrders: 2890,
  pendingOrders: 345,
  cancelledOrders: 221,
  newDrivers: 15,
  newCustomers: 87,
  averageOrderValue: 25.45,
  
  orderTrends: [
    { name: 'Mon', orders: 145 },
    { name: 'Tue', orders: 132 },
    { name: 'Wed', orders: 164 },
    { name: 'Thu', orders: 142 },
    { name: 'Fri', orders: 190 },
    { name: 'Sat', orders: 210 },
    { name: 'Sun', orders: 178 },
  ],
  
  revenueTrends: [
    { name: 'Mon', revenue: 3625 },
    { name: 'Tue', revenue: 3300 },
    { name: 'Wed', revenue: 4100 },
    { name: 'Thu', revenue: 3550 },
    { name: 'Fri', revenue: 4750 },
    { name: 'Sat', revenue: 5250 },
    { name: 'Sun', revenue: 4450 },
  ],
  
  orderStatus: [
    { name: 'Completed', value: 2890 },
    { name: 'Pending', value: 345 },
    { name: 'Cancelled', value: 221 },
  ],
  
  topDrivers: [
    { name: 'John D.', deliveries: 78 },
    { name: 'Sarah K.', deliveries: 65 },
    { name: 'Mike T.', deliveries: 59 },
    { name: 'Emma R.', deliveries: 52 },
    { name: 'David L.', deliveries: 48 },
  ],
  
  todayStats: {
    orders: 32,
    revenue: 780,
    avgOrderValue: 24.38,
    comparedToYesterday: '+12%'
  },
  
  weekStats: {
    orders: 215,
    revenue: 5380,
    avgOrderValue: 25.02,
    comparedToLastWeek: '+8%'
  }
};

// Chart colors
const COLORS = ['#4CAF50', '#2196F3', '#F44336', '#FFC107', '#9C27B0'];
const STATUS_COLORS = {
  Completed: '#4CAF50',
  Pending: '#2196F3',
  Cancelled: '#F44336'
};

  
const Admin = () => {
    const {language, texts} = useLanguage();
    const {toast} = useToast();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'drivers' | 'orders' | 'settings'>('dashboard');
    const [dateRange, setDateRange] = useState('week'); // week, month, year
   
    // Admin texts for different languages
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
          orderCount: 'Orders',
          revenue: '$',
          comparedTo: 'compared to',
          yesterday: 'yesterday',
          lastWeek: 'last week'
        },
        ar: {
          adminPanel: 'لوحة الإدارة',
          dashboard: 'لوحة القيادة',
          drivers: 'المستخدمين',
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
          orderCount: 'طلبات',
          revenue: '$ ',
          comparedTo: 'مقارنة مع',
          yesterday: 'الأمس',
          lastWeek: 'الأسبوع الماضي'
        }
    };

    if(!isAdmin()){
        toast({
            title: language === 'en' ? "Access Denied": "تم رفض الوصول",
            description: language === 'en' ? "You don't have permission to view this page" : "ليس لديك إذن لعرض هذه الصفحة",
            variant: "destructive",
        });
        return <Navigate to="/" />;
    }

    // Demo data for admin dashboard
    const stats = {
        totalDrivers: 1245,
        totalOrders: 834,
        revenue: '$42,582'
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'ar-SA', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    };

    const renderTabContent = () => {
        switch(activeTab) {
          case 'dashboard':
            return (
              <div className="space-y-6">
                <div className="flex flex-wrap justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">{adminTexts[language].welcomeAdmin}</h2>
                  <div className="flex space-x-2 bg-white rounded-lg shadow">
                    <button 
                      onClick={() => setDateRange('week')} 
                      className={`px-4 py-2 rounded-l-lg ${dateRange === 'week' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    >
                      {adminTexts[language].week}
                    </button>
                    <button 
                      onClick={() => setDateRange('month')} 
                      className={`px-4 py-2 ${dateRange === 'month' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    >
                      {adminTexts[language].month}
                    </button>
                    <button 
                      onClick={() => setDateRange('year')} 
                      className={`px-4 py-2 rounded-r-lg ${dateRange === 'year' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    >
                      {adminTexts[language].year}
                    </button>
                  </div>
                </div>
                {/* KPI Cards - Top Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500">{adminTexts[language].totalDrivers}</h3>
                      <BarChart className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold">{mockData.totalDrivers}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500">{adminTexts[language].totalOrders}</h3>
                      <Package className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold">{mockData.totalOrders}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500">{adminTexts[language].totalRevenue}</h3>
                      <DollarSign className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(mockData.totalRevenue)}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500">{adminTexts[language].avgOrderValue}</h3>
                      <BarChart className="h-5 w-5 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(mockData.averageOrderValue)}</p>
                  </div>
                </div>

                {/* KPI Cards - Middle Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500">{adminTexts[language].completedOrders}</h3>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold">{mockData.completedOrders}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500">{adminTexts[language].pendingOrders}</h3>
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold">{mockData.pendingOrders}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500">{adminTexts[language].cancelledOrders}</h3>
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <p className="text-2xl font-bold">{mockData.cancelledOrders}</p>
                  </div>
                </div>
                
                {/* KPI Cards - Bottom Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500">{adminTexts[language].newDrivers}</h3>
                      <UserPlus className="h-5 w-5 text-indigo-500" />
                    </div>
                    <p className="text-2xl font-bold">{mockData.newDrivers}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-gray-500">{adminTexts[language].newCustomers}</h3>
                      <Users className="h-5 w-5 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold">{mockData.newCustomers}</p>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Trends Chart */}
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-medium mb-4">{adminTexts[language].orderTrends}</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockData.orderTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="orders" 
                            stroke="#2196F3" 
                            activeDot={{ r: 8 }} 
                            name={adminTexts[language].orderCount}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Revenue Trends Chart */}
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-medium mb-4">{adminTexts[language].revenueTrends}</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockData.revenueTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#4CAF50" 
                            activeDot={{ r: 8 }} 
                            name={adminTexts[language].revenue}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* More Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Status Chart */}
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-medium mb-4">{adminTexts[language].orderStatus}</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mockData.orderStatus}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {mockData.orderStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => value} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Top Performing Drivers */}
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-medium mb-4">{adminTexts[language].topDrivers}</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart
                          data={mockData.topDrivers}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={80} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="deliveries" fill="#8884d8" />
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Today's Performance */}
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-medium mb-4">{adminTexts[language].todayPerformance}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>{adminTexts[language].orderCount}:</span>
                        <div className="flex items-center">
                          <span className="font-semibold">{mockData.todayStats.orders}</span>
                          <span className="text-green-500 ml-2">{mockData.todayStats.comparedToYesterday}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{adminTexts[language].revenue}:</span>
                        <div className="flex items-center">
                          <span className="font-semibold">{formatCurrency(mockData.todayStats.revenue)}</span>
                          <span className="text-green-500 ml-2">{mockData.todayStats.comparedToYesterday}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{adminTexts[language].avgOrderValue}:</span>
                        <span className="font-semibold">{formatCurrency(mockData.todayStats.avgOrderValue)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Week-to-Date Performance */}
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-medium mb-4">{adminTexts[language].weekPerformance}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>{adminTexts[language].orderCount}:</span>
                        <div className="flex items-center">
                          <span className="font-semibold">{mockData.weekStats.orders}</span>
                          <span className="text-green-500 ml-2">{mockData.weekStats.comparedToLastWeek}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{adminTexts[language].revenue}:</span>
                        <div className="flex items-center">
                          <span className="font-semibold">{formatCurrency(mockData.weekStats.revenue)}</span>
                          <span className="text-green-500 ml-2">{mockData.weekStats.comparedToLastWeek}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{adminTexts[language].avgOrderValue}:</span>
                        <span className="font-semibold">{formatCurrency(mockData.weekStats.avgOrderValue)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          case 'drivers':
            return <div className="p-4 bg-white rounded-lg shadow"><p>Drivers management would go here</p></div>;
          case 'orders':
            return <div className="p-4 bg-white rounded-lg shadow"><p>Orders management would go here</p></div>;
          case 'settings':
            return <div className="p-4 bg-white rounded-lg shadow"><p>Admin settings would go here</p></div>;
          default:
            return null;
        }
    };
      
    return (
      <div className={`min-h-screen bg-gray-100 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white p-4 shadow-md md:min-h-screen">
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
                <Truck className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                <span>{adminTexts[language].drivers}</span>
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