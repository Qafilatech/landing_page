import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SearchIcon, Filter, Clock, CheckCircle, XCircle, TruckIcon, MapPinIcon, DollarSign, Calendar, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderDate: string;
  customerName: string;
  address: string;
  status: 'Pending' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  driver?: string;
  driverId?: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  amount: number;
  paymentMethod: string;
  source: string;
  items: OrderItem[];
  fees: {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
  };
  customerContact: {
    phone: string;
    email: string;
  };
  specialInstructions?: string;
  timeline: {
    event: string;
    time: string;
  }[];
  location: {
    lat: number;
    lng: number;
  };
}

const OrdersManagement = ({ language }: { language: string }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Mock data for orders
  const ordersList: Order[] = [
    {
      id: 'ORD1234',
      orderDate: '2023-10-05T14:30:00',
      customerName: 'John Smith',
      address: '123 Main St, New York, NY 10001',
      status: 'Delivered',
      driver: 'David Wilson',
      driverId: 'DRV005',
      estimatedDelivery: '2023-10-05T15:30:00',
      actualDelivery: '2023-10-05T15:25:00',
      amount: 45.75,
      paymentMethod: 'Credit Card',
      source: 'Website',
      items: [
        { id: 'ITEM1', name: 'Burger Deluxe', quantity: 2, price: 12.99 },
        { id: 'ITEM2', name: 'French Fries', quantity: 2, price: 4.99 },
        { id: 'ITEM3', name: 'Soda', quantity: 2, price: 2.99 }
      ],
      fees: {
        subtotal: 39.94,
        deliveryFee: 3.99,
        tax: 1.82,
        total: 45.75
      },
      customerContact: {
        phone: '+(968) 123454567',
        email: 'john.smith@example.com'
      },
      specialInstructions: 'Please leave at door. Ring doorbell.',
      timeline: [
        { event: 'Order Placed', time: '2023-10-05T14:30:00' },
        { event: 'Order Confirmed', time: '2023-10-05T14:35:00' },
        { event: 'Preparation Started', time: '2023-10-05T14:40:00' },
        { event: 'Out for Delivery', time: '2023-10-05T15:00:00' },
        { event: 'Delivered', time: '2023-10-05T15:25:00' }
      ],
      location: { lat: 40.7128, lng: -74.006 }
    },
    {
      id: 'ORD1235',
      orderDate: '2023-10-05T13:15:00',
      customerName: 'Sarah Johnson',
      address: '456 Park Ave, New York, NY 10022',
      status: 'Out for Delivery',
      driver: 'Emily Chen',
      driverId: 'DRV004',
      estimatedDelivery: '2023-10-05T14:15:00',
      amount: 32.50,
      paymentMethod: 'PayPal',
      source: 'Mobile App',
      items: [
        { id: 'ITEM4', name: 'Chicken Salad', quantity: 1, price: 14.99 },
        { id: 'ITEM5', name: 'Iced Tea', quantity: 2, price: 3.99 },
        { id: 'ITEM6', name: 'Cheesecake', quantity: 1, price: 6.99 }
      ],
      fees: {
        subtotal: 29.96,
        deliveryFee: 2.99,
        tax: 1.55,
        total: 32.50
      },
      customerContact: {
        phone: '+1 (555) 987-6543',
        email: 'sarah.j@example.com'
      },
      timeline: [
        { event: 'Order Placed', time: '2023-10-05T13:15:00' },
        { event: 'Order Confirmed', time: '2023-10-05T13:20:00' },
        { event: 'Preparation Started', time: '2023-10-05T13:25:00' },
        { event: 'Out for Delivery', time: '2023-10-05T13:50:00' }
      ],
      location: { lat: 40.7631, lng: -73.9712 }
    },
    {
      id: 'ORD1236',
      orderDate: '2023-10-05T15:45:00',
      customerName: 'Michael Rodriguez',
      address: '789 Broadway, New York, NY 10003',
      status: 'Processing',
      estimatedDelivery: '2023-10-05T16:45:00',
      amount: 58.25,
      paymentMethod: 'Cash on Delivery',
      source: 'Phone Order',
      items: [
        { id: 'ITEM7', name: 'Pepperoni Pizza', quantity: 1, price: 18.99 },
        { id: 'ITEM8', name: 'Buffalo Wings', quantity: 2, price: 12.99 },
        { id: 'ITEM9', name: 'Garlic Bread', quantity: 1, price: 5.99 },
        { id: 'ITEM10', name: 'Soda 2L', quantity: 1, price: 3.99 }
      ],
      fees: {
        subtotal: 54.95,
        deliveryFee: 3.99,
        tax: 2.31,
        total: 58.25
      },
      customerContact: {
        phone: '+1 (555) 456-7890',
        email: 'mike.r@example.com'
      },
      specialInstructions: 'Call when arriving, apartment 5B',
      timeline: [
        { event: 'Order Placed', time: '2023-10-05T15:45:00' },
        { event: 'Order Confirmed', time: '2023-10-05T15:50:00' },
        { event: 'Preparation Started', time: '2023-10-05T15:55:00' }
      ],
      location: { lat: 40.7352, lng: -73.9911 }
    },
    {
      id: 'ORD1237',
      orderDate: '2023-10-05T11:20:00',
      customerName: 'Emma Wilson',
      address: '321 5th Ave, New York, NY 10016',
      status: 'Cancelled',
      estimatedDelivery: '2023-10-05T12:20:00',
      amount: 27.50,
      paymentMethod: 'Credit Card',
      source: 'Website',
      items: [
        { id: 'ITEM11', name: 'Breakfast Burrito', quantity: 2, price: 8.99 },
        { id: 'ITEM12', name: 'Coffee', quantity: 2, price: 3.49 }
      ],
      fees: {
        subtotal: 24.96,
        deliveryFee: 2.99,
        tax: 1.55,
        total: 27.50
      },
      customerContact: {
        phone: '+1 (555) 234-5678',
        email: 'emma.w@example.com'
      },
      timeline: [
        { event: 'Order Placed', time: '2023-10-05T11:20:00' },
        { event: 'Order Confirmed', time: '2023-10-05T11:25:00' },
        { event: 'Cancelled by Customer', time: '2023-10-05T11:40:00' }
      ],
      location: { lat: 40.7484, lng: -73.9857 }
    },
    {
      id: 'ORD1238',
      orderDate: '2023-10-05T18:10:00',
      customerName: 'Alex Chen',
      address: '555 W 42nd St, New York, NY 10036',
      status: 'Pending',
      estimatedDelivery: '2023-10-05T19:10:00',
      amount: 42.75,
      paymentMethod: 'Debit Card',
      source: 'Mobile App',
      items: [
        { id: 'ITEM13', name: 'Pad Thai', quantity: 1, price: 16.99 },
        { id: 'ITEM14', name: 'Spring Rolls', quantity: 2, price: 7.99 },
        { id: 'ITEM15', name: 'Thai Iced Tea', quantity: 2, price: 4.99 }
      ],
      fees: {
        subtotal: 38.95,
        deliveryFee: 3.99,
        tax: 1.81,
        total: 42.75
      },
      customerContact: {
        phone: '+1 (555) 345-6789',
        email: 'alex.c@example.com'
      },
      timeline: [
        { event: 'Order Placed', time: '2023-10-05T18:10:00' }
      ],
      location: { lat: 40.7590, lng: -73.9845 }
    }
  ];

  const texts = {
    en: {
      ordersManagement: 'Orders Management',
      search: 'Search orders...',
      all: 'All',
      pending: 'Pending',
      processing: 'Processing',
      outForDelivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      orderId: 'Order ID',
      date: 'Date',
      customer: 'Customer',
      status: 'Status',
      driver: 'Driver',
      amount: 'Amount',
      actions: 'Actions',
      viewDetails: 'View Details',
      orderDetails: 'Order Details',
      customerInfo: 'Customer Information',
      address: 'Address',
      contactInfo: 'Contact Information',
      phone: 'Phone',
      email: 'Email',
      orderItems: 'Order Items',
      quantity: 'Quantity',
      price: 'Price',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      tax: 'Tax',
      total: 'Total',
      paymentMethod: 'Payment Method',
      orderSource: 'Order Source',
      specialInstructions: 'Special Instructions',
      timeline: 'Order Timeline',
      event: 'Event',
      time: 'Time',
      estimatedDelivery: 'Est. Delivery',
      actualDelivery: 'Actual Delivery',
      noDriverAssigned: 'No driver assigned',
      close: 'Close',
      filterByStatus: 'Filter by status',
      filterByDate: 'Filter by date',
      today: 'Today',
      yesterday: 'Yesterday',
      lastWeek: 'Last 7 days',
      lastMonth: 'Last 30 days',
      noOrderSelected: 'Select an order to view details',
      assignDriver: 'Assign Driver',
      updateStatus: 'Update Status',
      viewOnMap: 'View on Map',
      printInvoice: 'Print Invoice'
    },
    ar: {
      ordersManagement: 'إدارة الطلبات',
      search: 'بحث عن الطلبات...',
      all: 'الكل',
      pending: 'قيد الانتظار',
      processing: 'قيد المعالجة',
      outForDelivery: 'خرج للتوصيل',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
      orderId: 'رقم الطلب',
      date: 'التاريخ',
      customer: 'العميل',
      status: 'الحالة',
      driver: 'السائق',
      amount: 'المبلغ',
      actions: 'إجراءات',
      viewDetails: 'عرض التفاصيل',
      orderDetails: 'تفاصيل الطلب',
      customerInfo: 'معلومات العميل',
      address: 'العنوان',
      contactInfo: 'معلومات الاتصال',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      orderItems: 'عناصر الطلب',
      quantity: 'الكمية',
      price: 'السعر',
      subtotal: 'المجموع الفرعي',
      deliveryFee: 'رسوم التوصيل',
      tax: 'الضريبة',
      total: 'الإجمالي',
      paymentMethod: 'طريقة الدفع',
      orderSource: 'مصدر الطلب',
      specialInstructions: 'تعليمات خاصة',
      timeline: 'الجدول الزمني للطلب',
      event: 'الحدث',
      time: 'الوقت',
      estimatedDelivery: 'التوصيل المقدر',
      actualDelivery: 'التوصيل الفعلي',
      noDriverAssigned: 'لم يتم تعيين سائق',
      close: 'إغلاق',
      filterByStatus: 'تصفية حسب الحالة',
      filterByDate: 'تصفية حسب التاريخ',
      today: 'اليوم',
      yesterday: 'الأمس',
      lastWeek: 'آخر 7 أيام',
      lastMonth: 'آخر 30 يوم',
      noOrderSelected: 'اختر طلبًا لعرض التفاصيل',
      assignDriver: 'تعيين سائق',
      updateStatus: 'تحديث الحالة',
      viewOnMap: 'عرض على الخريطة',
      printInvoice: 'طباعة الفاتورة'
    }
  };

  // Filter orders based on search term, status filter, and date filter
  const filteredOrders = ordersList.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase().replace(' ', '') === statusFilter.toLowerCase();
    
    let matchesDate = true;
    const orderDate = new Date(order.orderDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      matchesDate = orderDate >= today && orderDate < tomorrow;
    } else if (dateFilter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      matchesDate = orderDate >= yesterday && orderDate < today;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = orderDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setDate(monthAgo.getDate() - 30);
      matchesDate = orderDate >= monthAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'out for delivery': return 'bg-amber-100 text-amber-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'out for delivery': return <TruckIcon className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatDateTime = (dateTimeStr) => {
    try {
      return format(new Date(dateTimeStr), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      console.error('Date formatting error:', e);
      return dateTimeStr;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'ar-SA', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">{texts[language].ordersManagement}</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder={texts[language].search} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={texts[language].filterByStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{texts[language].all}</SelectItem>
              <SelectItem value="pending">{texts[language].pending}</SelectItem>
              <SelectItem value="processing">{texts[language].processing}</SelectItem>
              <SelectItem value="outfordelivery">{texts[language].outForDelivery}</SelectItem>
              <SelectItem value="delivered">{texts[language].delivered}</SelectItem>
              <SelectItem value="cancelled">{texts[language].cancelled}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={texts[language].filterByDate} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{texts[language].all}</SelectItem>
              <SelectItem value="today">{texts[language].today}</SelectItem>
              <SelectItem value="yesterday">{texts[language].yesterday}</SelectItem>
              <SelectItem value="week">{texts[language].lastWeek}</SelectItem>
              <SelectItem value="month">{texts[language].lastMonth}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>{texts[language].orderId}</TableHead>
              <TableHead>{texts[language].date}</TableHead>
              <TableHead>{texts[language].customer}</TableHead>
              <TableHead>{texts[language].status}</TableHead>
              <TableHead>{texts[language].driver}</TableHead>
              <TableHead>{texts[language].amount}</TableHead>
              <TableHead className="text-right">{texts[language].actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{formatDateTime(order.orderDate)}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Badge variant="outline" className={`flex gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{order.driver || texts[language].noDriverAssigned}</TableCell>
                <TableCell>{formatCurrency(order.amount)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewOrderDetails(order)}
                    className="hover:bg-primary hover:text-white"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    {texts[language].viewDetails}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No orders found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{texts[language].orderDetails} - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6 pt-2">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium mb-2">{texts[language].customerInfo}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{texts[language].customer}</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{texts[language].address}</p>
                    <p className="font-medium">{selectedOrder.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{texts[language].phone}</p>
                    <p className="font-medium">{selectedOrder.customerContact.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{texts[language].email}</p>
                    <p className="font-medium">{selectedOrder.customerContact.email}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Status and Timeline */}
              <div>
                <h3 className="text-lg font-medium mb-2">{texts[language].status} & {texts[language].timeline}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{texts[language].status}</p>
                    <Badge variant="outline" className={`mt-1 ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{texts[language].driver}</p>
                    <p className="font-medium">
                      {selectedOrder.driver || texts[language].noDriverAssigned}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{texts[language].estimatedDelivery}</p>
                    <p className="font-medium">{formatDateTime(selectedOrder.estimatedDelivery)}</p>
                  </div>
                  {selectedOrder.actualDelivery && (
                    <div>
                      <p className="text-sm text-muted-foreground">{texts[language].actualDelivery}</p>
                      <p className="font-medium">{formatDateTime(selectedOrder.actualDelivery)}</p>
                    </div>
                  )}
                </div>

                <h4 className="font-medium mb-2">{texts[language].timeline}</h4>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{texts[language].event}</TableHead>
                        <TableHead>{texts[language].time}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.timeline.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.event}</TableCell>
                          <TableCell>{formatDateTime(item.time)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium mb-2">{texts[language].orderItems}</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{texts[language].orderId}</TableHead>
                        <TableHead>{texts[language].orderItems}</TableHead>
                        <TableHead>{texts[language].quantity}</TableHead>
                        <TableHead>{texts[language].price}</TableHead>
                        <TableHead className="text-right">{texts[language].subtotal}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.quantity * item.price)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-medium">
                          {texts[language].subtotal}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(selectedOrder.fees.subtotal)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-medium">
                          {texts[language].deliveryFee}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(selectedOrder.fees.deliveryFee)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-medium">
                          {texts[language].tax}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(selectedOrder.fees.tax)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-medium">
                          {texts[language].total}
                        </TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(selectedOrder.fees.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator />

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-medium mb-2">{texts[language].orderDetails}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{texts[language].paymentMethod}</p>
                    <p className="font-medium">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{texts[language].orderSource}</p>
                    <p className="font-medium">{selectedOrder.source}</p>
                  </div>
                </div>
                
                {selectedOrder.specialInstructions && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">{texts[language].specialInstructions}</p>
                    <p className="p-3 bg-muted rounded-md mt-1">{selectedOrder.specialInstructions}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button className="flex gap-1 items-center" variant="outline">
                  <TruckIcon className="h-4 w-4" />
                  {texts[language].assignDriver}
                </Button>
                <Button className="flex gap-1 items-center" variant="outline">
                  <Clock className="h-4 w-4" />
                  {texts[language].updateStatus}
                </Button>
                <Button className="flex gap-1 items-center" variant="outline">
                  <MapPinIcon className="h-4 w-4" />
                  {texts[language].viewOnMap}
                </Button>
                <Button className="flex gap-1 items-center" variant="outline">
                  <DollarSign className="h-4 w-4" />
                  {texts[language].printInvoice}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;