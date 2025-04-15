import React, {useState, useEffect} from 'react';
import { ArrowLeft, Truck, Package, BarChart, Settings, DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  XCircle,
  UserPlus,
  Users,
  Map } from 'lucide-react';
import { LineChart, Line, BarChart as ReBarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";


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
      { name: 'Completed', value: 2890, color: '#4CAF50' },
      { name: 'Pending', value: 345, color: '#2196F3' },
      { name: 'Cancelled', value: 221, color: '#F44336' },
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


const Dashboard = ({ language, adminTexts, dateRange, setDateRange, formatCurrency }) =>{
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{adminTexts[language].welcomeAdmin}</h2>
        <div className="flex space-x-2 bg-white rounded-lg shadow">
            <button 
              onClick={() => setDateRange('week')} 
              className={`px-4 py-2 rounded-l-lg ${dateRange === 'week' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}> 
              {adminTexts[language].week} 
              </button>
            <button 
              onClick={() => setDateRange('month')} 
              className={`px-4 py-2  ${dateRange === 'month' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}> 
              {adminTexts[language].month} 
              </button>

            <button 
            onClick={() => setDateRange('year')} 
            className={`px-4 py-2 rounded-r-lg ${dateRange === 'year' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
            {adminTexts[language].year}
            </button>
          </div>
      </div>

      {/* KPI Cards - Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-500">{adminTexts[language].totalDrivers}</h3>
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
            <ReBarChart
                      data={mockData.orderStatus}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >

                 <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => value} />
                      <Legend />
                      <Bar dataKey="value" name={adminTexts[language].ordersLabel}>
                    {mockData.orderStatus.map((entry, index) =>(
                      <Cell key={`cell-${index}`} fill={entry.color || STATUS_COLORS[entry.name]}/>
                    ))}
                  </Bar>
              </ReBarChart>
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
};

export default Dashboard;


