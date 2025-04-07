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
          ordersLabel: 'Orders',
          revenue: '$',
          comparedTo: 'compared to',
          yesterday: 'yesterday',
          lastWeek: 'last week'
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
          revenue: '$ ',
          comparedTo: 'مقارنة مع',
          yesterday: 'الأمس',
          lastWeek: 'الأسبوع الماضي',
          totalDeliveries: 'التوصيلات'

        }
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
                      <h3 className="text-gray-500">{adminTexts[language].deliver}</h3>
                      <Users className="h-5 w-5 text-blue-500" />
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
                            name={adminTexts[language].ordersLabel}
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
                        <span>{adminTexts[language].ordersLabel}:</span>
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
                        <span>{adminTexts[language].ordersLabel}:</span>
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
            return <DriversManagement language={language} />;
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
                  <Users className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
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
    
    // Let's create the drivers management component
    const DriversManagement = ({ language }) => {
      const [searchTerm, setSearchTerm] = useState('');
      const [statusFilter, setStatusFilter] = useState('all');
      const [selectedDriver, setSelectedDriver] = useState(null);
      const [showDriverModal, setShowDriverModal] = useState(false);
    
      // Mock data for drivers
      const driversList = [
        {
          id: 'DRV001',
          name: 'John Smith',
          phone: '+1 (555) 123-4567',
          email: 'john.smith@example.com',
          vehicle: 'Honda Civic - ABC123',
          status: 'Online',
          dateJoined: '2023-05-15',
          totalDeliveries: 128,
          rating: 4.8,
          location: { lat: 40.7128, lng: -74.006 },
          available: true,
          recentDeliveries: [
            { id: 'ORD1234', date: '2023-10-02', amount: 25.50, status: 'Delivered' },
            { id: 'ORD1212', date: '2023-10-01', amount: 32.75, status: 'Delivered' },
            { id: 'ORD1198', date: '2023-09-30', amount: 18.25, status: 'Delivered' }
          ],
          metrics: {
            onTimeRate: '95%',
            avgDeliveryTime: '28 min',
            totalRevenue: '$1,845.50'
          }
        },
        {
          id: 'DRV002',
          name: 'Sarah Johnson',
          phone: '+1 (555) 987-6543',
          email: 'sarah.j@example.com',
          vehicle: 'Toyota Corolla - XYZ789',
          status: 'On Delivery',
          dateJoined: '2023-06-22',
          totalDeliveries: 95,
          rating: 4.9,
          location: { lat: 40.7282, lng: -73.794 },
          available: false,
          recentDeliveries: [
            { id: 'ORD1255', date: '2023-10-02', amount: 42.30, status: 'In Progress' },
            { id: 'ORD1240', date: '2023-10-01', amount: 29.50, status: 'Delivered' },
            { id: 'ORD1210', date: '2023-09-30', amount: 35.75, status: 'Delivered' }
          ],
          metrics: {
            onTimeRate: '98%',
            avgDeliveryTime: '25 min',
            totalRevenue: '$1,520.75'
          }
        },
        {
          id: 'DRV003',
          name: 'Michael Rodriguez',
          phone: '+1 (555) 456-7890',
          email: 'mike.r@example.com',
          vehicle: 'Ford Focus - DEF456',
          status: 'Offline',
          dateJoined: '2023-03-10',
          totalDeliveries: 156,
          rating: 4.6,
          location: null,
          available: false,
          recentDeliveries: [
            { id: 'ORD1188', date: '2023-09-30', amount: 27.45, status: 'Delivered' },
            { id: 'ORD1175', date: '2023-09-29', amount: 34.20, status: 'Delivered' },
            { id: 'ORD1162', date: '2023-09-28', amount: 19.95, status: 'Delivered' }
          ],
          metrics: {
            onTimeRate: '92%',
            avgDeliveryTime: '30 min',
            totalRevenue: '$2,145.20'
          }
        },
        {
          id: 'DRV004',
          name: 'Emily Chen',
          phone: '+1 (555) 234-5678',
          email: 'emily.c@example.com',
          vehicle: 'Nissan Altima - GHI789',
          status: 'Online',
          dateJoined: '2023-08-05',
          totalDeliveries: 67,
          rating: 4.7,
          location: { lat: 40.7589, lng: -73.985 },
          available: true,
          recentDeliveries: [
            { id: 'ORD1245', date: '2023-10-02', amount: 31.80, status: 'Delivered' },
            { id: 'ORD1232', date: '2023-10-01', amount: 24.50, status: 'Delivered' },
            { id: 'ORD1220', date: '2023-09-30', amount: 29.75, status: 'Delivered' }
          ],
          metrics: {
            onTimeRate: '94%',
            avgDeliveryTime: '27 min',
            totalRevenue: '$975.50'
          }
        },
        {
          id: 'DRV005',
          name: 'David Wilson',
          phone: '+1 (555) 345-6789',
          email: 'david.w@example.com',
          vehicle: 'Honda Accord - JKL012',
          status: 'Break',
          dateJoined: '2023-04-18',
          totalDeliveries: 112,
          rating: 4.5,
          location: { lat: 40.7702, lng: -73.922 },
          available: false,
          recentDeliveries: [
            { id: 'ORD1222', date: '2023-09-30', amount: 38.25, status: 'Delivered' },
            { id: 'ORD1205', date: '2023-09-29', amount: 26.75, status: 'Delivered' },
            { id: 'ORD1190', date: '2023-09-28', amount: 22.50, status: 'Delivered' }
          ],
          metrics: {
            onTimeRate: '90%',
            avgDeliveryTime: '32 min',
            totalRevenue: '$1,685.75'
          }
        }
      ];
    
      const texts = {
        en: {
          driversManagement: 'Drivers Management',
          search: 'Search drivers...',
          all: 'All',
          online: 'Online',
          offline: 'Offline',
          onDelivery: 'On Delivery',
          onBreak: 'On Break',
          driverId: 'Driver ID',
          name: 'Name',
          status: 'Status',
          vehicle: 'Vehicle',
          deliveries: 'Deliveries',
          rating: 'Rating',
          viewDetails: 'View Details',
          driverDetails: 'Driver Details',
          contactInfo: 'Contact Information',
          phone: 'Phone',
          email: 'Email',
          dateJoined: 'Date Joined',
          deliveryHistory: 'Delivery History',
          performanceMetrics: 'Performance Metrics',
          onTimeRate: 'On-time Rate',
          avgDeliveryTime: 'Avg. Delivery Time',
          totalRevenue: 'Total Revenue',
          close: 'Close',
          orderID: 'Order ID',
          date: 'Date',
          amount: 'Amount',
          assignedOrders: 'Assigned Orders',
          noDriverSelected: 'Select a driver to view details',
          actions: 'Actions',
          totalDeliveries: 'Total Deliveries'


        },
        ar: {
          driversManagement: 'إدارة السائقين',
          search: 'بحث عن السائقين...',
          all: 'الكل',
          online: 'متصل',
          offline: 'غير متصل',
          onDelivery: 'في التوصيل',
          onBreak: 'في استراحة',
          driverId: 'معرف السائق',
          name: 'الاسم',
          status: 'الحالة',
          vehicle: 'المركبة',
          deliveries: 'التوصيلات',
          rating: 'التقييم',
          viewDetails: 'عرض التفاصيل',
          driverDetails: 'تفاصيل السائق',
          contactInfo: 'معلومات الاتصال',
          phone: 'الهاتف',
          email: 'البريد الإلكتروني',
          dateJoined: 'تاريخ الانضمام',
          deliveryHistory: 'تاريخ التوصيل',
          performanceMetrics: 'مقاييس الأداء',
          onTimeRate: 'معدل الالتزام بالوقت',
          avgDeliveryTime: 'متوسط وقت التوصيل',
          totalRevenue: 'إجمالي الإيرادات',
          close: 'إغلاق',
          orderID: 'رقم الطلب',
          date: 'التاريخ',
          amount: 'المبلغ',
          assignedOrders: 'الطلبات المخصصة',
          noDriverSelected: 'اختر سائقًا لعرض التفاصيل',
          actions: 'إجراءات',
          totalDeliveries: 'إجمالي التسليمات'


        }
      };
    
      // Filter drivers based on search term and status filter
      const filteredDrivers = driversList.filter(driver => {
        const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              driver.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || driver.status.toLowerCase().includes(statusFilter.toLowerCase());
        return matchesSearch && matchesStatus;
      });
    
      const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
          case 'online': return 'bg-green-500';
          case 'offline': return 'bg-gray-500';
          case 'on delivery': return 'bg-blue-500';
          case 'break': return 'bg-yellow-500';
          default: return 'bg-gray-500';
        }
      };
    
      const handleViewDetails = (driver) => {
        setSelectedDriver(driver);
        setShowDriverModal(true);
      };
    
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{texts[language].driversManagement}</h2>
            <div className="flex items-center mt-4 sm:mt-0">
              <input
                type="text"
                placeholder={texts[language].search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              {texts[language].all}
            </button>
            <button 
              onClick={() => setStatusFilter('online')}
              className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'online' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              {texts[language].online}
            </button>
            <button 
              onClick={() => setStatusFilter('offline')}
              className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'offline' ? 'bg-gray-500 text-white' : 'bg-gray-200'}`}
            >
              {texts[language].offline}
            </button>
            <button 
              onClick={() => setStatusFilter('delivery')}
              className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'delivery' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {texts[language].onDelivery}
            </button>
            <button 
              onClick={() => setStatusFilter('break')}
              className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'break' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            >
              {texts[language].onBreak}
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {texts[language].driverId}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {texts[language].name}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {texts[language].status}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {texts[language].vehicle}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {texts[language].deliveries}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {texts[language].rating}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {texts[language].actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {driver.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {driver.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${getStatusColor(driver.status)} mr-2`}></div>
                          <div className="text-sm text-gray-900">{driver.status}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {driver.vehicle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {driver.totalDeliveries}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-1">{driver.rating}</span>
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewDetails(driver)}
                          className="text-primary hover:text-primary/80"
                        >
                          {texts[language].viewDetails}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    
          {/* Driver Details Modal */}
          {showDriverModal && selectedDriver && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">{texts[language].driverDetails}</h2>
                  <button onClick={() => setShowDriverModal(false)} className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Driver Basic Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-2xl font-bold">
                        {selectedDriver.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">{selectedDriver.name}</h3>
                        <div className="flex items-center mt-1">
                          <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(selectedDriver.status)} mr-2`}></div>
                          <span className="text-gray-600">{selectedDriver.status}</span>
                        </div>
                        <p className="text-gray-600">{selectedDriver.id}</p>
                      </div>
                    </div>
    
                    <div className="space-y-3">
                      <h4 className="font-medium">{texts[language].contactInfo}</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{selectedDriver.phone}</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{selectedDriver.email}</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{texts[language].dateJoined}: {selectedDriver.dateJoined}</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span>{selectedDriver.vehicle}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-4">{texts[language].performanceMetrics}</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{texts[language].onTimeRate}:</span>
                        <span className="font-medium">{selectedDriver.metrics.onTimeRate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{texts[language].avgDeliveryTime}:</span>
                        <span className="font-medium">{selectedDriver.metrics.avgDeliveryTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{texts[language].totalRevenue}:</span>
                        <span className="font-medium">{selectedDriver.metrics.totalRevenue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{texts[language].totalDeliveries}:</span>
                        <span className="font-medium">{selectedDriver.totalDeliveries}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{texts[language].rating}:</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-1">{selectedDriver.rating}</span>
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    
                {/* Delivery History Table */}
                <div className="mt-6">
                  <h4 className="font-medium mb-4">{texts[language].deliveryHistory}</h4>
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {texts[language].orderID}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {texts[language].date}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {texts[language].amount}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {texts[language].status}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedDriver.recentDeliveries.map((delivery) => (
                          <tr key={delivery.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {delivery.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {delivery.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${delivery.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                  delivery.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                {delivery.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
    
                <div className="mt-6 text-right">
                  <button 
                    onClick={() => setShowDriverModal(false)} 
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors"
                  >
                    {texts[language].close}
                  </button>
                </div>
              </div>
            </div>
          )}


      </div>
    );
};

export default Admin;