import React, { useState } from 'react';
import { Users, Phone, Mail, Calendar, Shield, Star, X, ChevronLeft, MapPin, Truck } from 'lucide-react';

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
      phone: '+(968) 123454567',
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
        totalRevenue: '1,845.50'
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
        totalRevenue: '1,520.75'
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
        totalRevenue: '2,145.20'
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
        totalRevenue: '975.50'
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
        totalRevenue: '1,685.75'
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
      totalDeliveries: 'Total Deliveries',
      currentLocation: 'Current Location',
      available: 'Available',
      notAvailable: 'Not Available',
      viewOnMap: 'View on Map'
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
      totalDeliveries: 'إجمالي التسليمات',
      currentLocation: 'الموقع الحالي',
      available: 'متاح',
      notAvailable: 'غير متاح',
      viewOnMap: 'عرض على الخريطة'
    }
  };

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
              <button 
                onClick={() => setShowDriverModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
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
                    <div className="mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedDriver.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedDriver.available ? texts[language].available : texts[language].notAvailable}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">{texts[language].contactInfo}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                      <span>{selectedDriver.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                      <span>{selectedDriver.email}</span>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                      <span>{texts[language].dateJoined}: {selectedDriver.dateJoined}</span>
                    </div>
                    <div className="flex items-start">
                      <Truck className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                      <span>{selectedDriver.vehicle}</span>
                    </div>
                    {selectedDriver.location && (
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                        <span>
                          {texts[language].currentLocation}: 
                          <button className="ml-2 text-primary hover:underline">
                            {texts[language].viewOnMap}
                          </button>
                        </span>
                      </div>
                    )}
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
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
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
                          {delivery.amount.toFixed(2)}
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

export default DriversManagement;