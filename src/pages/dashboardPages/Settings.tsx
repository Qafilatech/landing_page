
import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { 
  Building2, 
  Clock, 
  DollarSign, 
  Map, 
  Users, 
  PackageCheck, 
  Bell, 
  Cog, 
  Plug, 
  Save, 
  Trash2
} from "lucide-react";

// Define schemas for the different settings sections
const generalSettingsSchema = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }),
  contactEmail: z.string().email({ message: "Invalid email address" }),
  contactPhone: z.string().min(6, { message: "Valid phone number required" }),
  address: z.string().min(1, { message: "Address is required" }),
  timeZone: z.string().min(1, { message: "Time zone is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  defaultMapZoom: z.string().min(1, { message: "Map zoom level is required" }),
});

const driverSettingsSchema = z.object({
  requiredDocuments: z.string().min(1, { message: "Required documents list needed" }),
  commissionRate: z.string().min(1, { message: "Commission rate is required" }),
  payoutMethod: z.string().min(1, { message: "Payout method is required" }),
  minDeliveriesForPayout: z.string().min(1, { message: "Minimum deliveries setting required" }),
  customStatuses: z.string().min(1, { message: "Driver statuses are required" }),
});

const orderSettingsSchema = z.object({
  orderStatuses: z.string().min(1, { message: "Order statuses are required" }),
  baseFee: z.string().min(1, { message: "Base fee is required" }),
  perKmFee: z.string().min(1, { message: "Per km fee is required" }),
  minimumOrderValue: z.string().min(1, { message: "Minimum order value is required" }),
  cancellationTimeLimit: z.string().min(1, { message: "Cancellation time limit is required" }),
  cancellationFee: z.string().min(1, { message: "Cancellation fee is required" }),
  notifyCustomerOnStatusChange: z.boolean(),
  notifyDriverOnAssignment: z.boolean(),
});

const integrationSettingsSchema = z.object({
  paymentGatewayApiKey: z.string().min(1, { message: "Payment gateway API key is required" }),
  paymentGatewaySecret: z.string().min(1, { message: "Payment gateway secret key is required" }),
  mapsApiKey: z.string().min(1, { message: "Maps API key is required" }),
  smsApiKey: z.string().min(1, { message: "SMS API key is required" }),
  emailServiceApiKey: z.string().min(1, { message: "Email service API key is required" }),
});

const notificationSettingsSchema = z.object({
  alertOnNewOrder: z.boolean(),
  alertOnCancelledOrder: z.boolean(),
  alertOnDelayedDelivery: z.boolean(),
  alertOnDriverUnavailable: z.boolean(),
  alertOnLowInventory: z.boolean(),
  dailyReportEmail: z.boolean(),
  weeklyReportEmail: z.boolean(),
});

const userManagementSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Valid email is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  passwordConfirm: z.string().min(6, { message: "Password confirmation is required" }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
});

// Mock data for admin users
const mockAdminUsers = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'Super Admin' },
  { id: 2, username: 'manager', email: 'manager@example.com', role: 'Manager' },
  { id: 3, username: 'operator', email: 'operator@example.com', role: 'Operator' },
];

const SettingsManagement = ({ language }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [adminUsers, setAdminUsers] = useState(mockAdminUsers);
  
  // Define language texts
  const settingsTexts = {
    en: {
      settings: 'Settings',
      general: 'General',
      drivers: 'Drivers',
      orders: 'Orders',
      users: 'Users',
      integrations: 'Integrations',
      notifications: 'Notifications',
      companyInfo: 'Company Information',
      companyName: 'Company Name',
      contactEmail: 'Contact Email',
      contactPhone: 'Contact Phone',
      address: 'Address',
      timeZone: 'Time Zone',
      currency: 'Currency',
      defaultMapZoom: 'Default Map Zoom',
      driverSettings: 'Driver Settings',
      requiredDocuments: 'Required Documents',
      commissionRate: 'Commission Rate (%)',
      payoutMethod: 'Payout Method',
      minDeliveriesForPayout: 'Min. Deliveries for Payout',
      customStatuses: 'Custom Driver Statuses',
      orderSettings: 'Order Settings',
      orderStatuses: 'Order Statuses',
      baseFee: 'Base Delivery Fee',
      perKmFee: 'Fee per Kilometer',
      minimumOrderValue: 'Minimum Order Value',
      cancellationTimeLimit: 'Cancellation Time Limit (min)',
      cancellationFee: 'Cancellation Fee',
      notifyCustomerOnStatusChange: 'Notify Customer on Status Change',
      notifyDriverOnAssignment: 'Notify Driver on Assignment',
      userManagement: 'User Management',
      username: 'Username',
      email: 'Email',
      role: 'Role',
      actions: 'Actions',
      addUser: 'Add User',
      password: 'Password',
      passwordConfirm: 'Confirm Password',
      integrationSettings: 'Integration Settings',
      paymentGatewayApiKey: 'Payment Gateway API Key',
      paymentGatewaySecret: 'Payment Gateway Secret',
      mapsApiKey: 'Maps API Key',
      smsApiKey: 'SMS API Key',
      emailServiceApiKey: 'Email Service API Key',
      notificationSettings: 'Notification Settings',
      alertOnNewOrder: 'Alert on New Order',
      alertOnCancelledOrder: 'Alert on Cancelled Order',
      alertOnDelayedDelivery: 'Alert on Delayed Delivery',
      alertOnDriverUnavailable: 'Alert on Driver Unavailable',
      alertOnLowInventory: 'Alert on Low Inventory',
      dailyReportEmail: 'Daily Report Email',
      weeklyReportEmail: 'Weekly Report Email',
      save: 'Save Changes',
      saveSuccessful: 'Settings saved successfully!',
      delete: 'Delete',
      edit: 'Edit',
      cancel: 'Cancel',
      addNewUser: 'Add New User',
      deleteUser: 'Delete User',
      userDeletedSuccess: 'User deleted successfully',
      userAddedSuccess: 'User added successfully',
      settingsSavedSuccess: 'Settings saved successfully',
    },
    ar: {
      settings: 'الإعدادات',
      general: 'عام',
      drivers: 'السائقين',
      orders: 'الطلبات',
      users: 'المستخدمين',
      integrations: 'التكاملات',
      notifications: 'الإشعارات',
      companyInfo: 'معلومات الشركة',
      companyName: 'اسم الشركة',
      contactEmail: 'البريد الإلكتروني للتواصل',
      contactPhone: 'رقم الهاتف للتواصل',
      address: 'العنوان',
      timeZone: 'المنطقة الزمنية',
      currency: 'العملة',
      defaultMapZoom: 'تكبير الخريطة الافتراضي',
      driverSettings: 'إعدادات السائق',
      requiredDocuments: 'المستندات المطلوبة',
      commissionRate: 'نسبة العمولة (%)',
      payoutMethod: 'طريقة الدفع',
      minDeliveriesForPayout: 'الحد الأدنى للتوصيلات للدفع',
      customStatuses: 'حالات السائق المخصصة',
      orderSettings: 'إعدادات الطلب',
      orderStatuses: 'حالات الطلب',
      baseFee: 'رسوم التوصيل الأساسية',
      perKmFee: 'الرسوم لكل كيلومتر',
      minimumOrderValue: 'الحد الأدنى لقيمة الطلب',
      cancellationTimeLimit: 'الحد الزمني للإلغاء (دقيقة)',
      cancellationFee: 'رسوم الإلغاء',
      notifyCustomerOnStatusChange: 'إخطار العميل عند تغيير الحالة',
      notifyDriverOnAssignment: 'إخطار السائق عند التعيين',
      userManagement: 'إدارة المستخدمين',
      username: 'اسم المستخدم',
      email: 'البريد الإلكتروني',
      role: 'الدور',
      actions: 'الإجراءات',
      addUser: 'إضافة مستخدم',
      password: 'كلمة المرور',
      passwordConfirm: 'تأكيد كلمة المرور',
      integrationSettings: 'إعدادات التكامل',
      paymentGatewayApiKey: 'مفتاح API لبوابة الدفع',
      paymentGatewaySecret: 'سر بوابة الدفع',
      mapsApiKey: 'مفتاح API للخرائط',
      smsApiKey: 'مفتاح API للرسائل القصيرة',
      emailServiceApiKey: 'مفتاح API لخدمة البريد الإلكتروني',
      notificationSettings: 'إعدادات الإشعارات',
      alertOnNewOrder: 'تنبيه عند طلب جديد',
      alertOnCancelledOrder: 'تنبيه عند إلغاء الطلب',
      alertOnDelayedDelivery: 'تنبيه عند تأخير التوصيل',
      alertOnDriverUnavailable: 'تنبيه عند عدم توفر السائق',
      alertOnLowInventory: 'تنبيه عند انخفاض المخزون',
      dailyReportEmail: 'تقرير يومي بالبريد الإلكتروني',
      weeklyReportEmail: 'تقرير أسبوعي بالبريد الإلكتروني',
      save: 'حفظ التغييرات',
      saveSuccessful: 'تم حفظ الإعدادات بنجاح!',
      delete: 'حذف',
      edit: 'تعديل',
      cancel: 'إلغاء',
      addNewUser: 'إضافة مستخدم جديد',
      deleteUser: 'حذف المستخدم',
      userDeletedSuccess: 'تم حذف المستخدم بنجاح',
      userAddedSuccess: 'تم إضافة المستخدم بنجاح',
      settingsSavedSuccess: 'تم حفظ الإعدادات بنجاح',
    }
  };
  
  const t = settingsTexts[language];
  
  // Forms
  const generalForm = useForm({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: 'Fast Delivery Inc.',
      contactEmail: 'contact@fastdelivery.com',
      contactPhone: '+(968) 1234 54567',
      address: 'Ghala Muscat, Oman',
      timeZone: 'UTC-8 (Pacific Standard Time)',
      currency: 'OMR',
      defaultMapZoom: '12',
    },
  });

  const driverForm = useForm({
    resolver: zodResolver(driverSettingsSchema),
    defaultValues: {
      requiredDocuments: 'ID, Driver License, Insurance, Vehicle Registration',
      commissionRate: '15',
      payoutMethod: 'Bank Transfer, PayPal, Cash',
      minDeliveriesForPayout: '10',
      customStatuses: 'Available, On Delivery, Break, Offline, Suspended',
    },
  });

  const orderForm = useForm({
    resolver: zodResolver(orderSettingsSchema),
    defaultValues: {
      orderStatuses: 'Pending, Processing, Out for Delivery, Delivered, Cancelled',
      baseFee: '5.00',
      perKmFee: '0.50',
      minimumOrderValue: '15.00',
      cancellationTimeLimit: '15',
      cancellationFee: '3.00',
      notifyCustomerOnStatusChange: true,
      notifyDriverOnAssignment: true,
    },
  });

  const integrationForm = useForm({
    resolver: zodResolver(integrationSettingsSchema),
    defaultValues: {
      paymentGatewayApiKey: 'pk_test_example',
      paymentGatewaySecret: 'sk_test_example',
      mapsApiKey: 'AIzaXXXXXXXXXXXXXXXXXXXXXX',
      smsApiKey: 'SMS_API_KEY_EXAMPLE',
      emailServiceApiKey: 'EMAIL_SERVICE_KEY_EXAMPLE',
    },
  });

  const notificationForm = useForm({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      alertOnNewOrder: true,
      alertOnCancelledOrder: true,
      alertOnDelayedDelivery: true,
      alertOnDriverUnavailable: false,
      alertOnLowInventory: false,
      dailyReportEmail: true,
      weeklyReportEmail: true,
    },
  });

  const userForm = useForm({
    resolver: zodResolver(userManagementSchema),
    defaultValues: {
      username: '',
      email: '',
      role: 'Operator',
      password: '',
      passwordConfirm: '',
    },
  });

  const onGeneralSubmit = (data) => {
    console.log('General Settings:', data);
    toast({
      title: t.settingsSavedSuccess,
      description: t.companyInfo,
    });
  };

  const onDriverSubmit = (data) => {
    console.log('Driver Settings:', data);
    toast({
      title: t.settingsSavedSuccess,
      description: t.driverSettings,
    });
  };

  const onOrderSubmit = (data) => {
    console.log('Order Settings:', data);
    toast({
      title: t.settingsSavedSuccess,
      description: t.orderSettings,
    });
  };

  const onIntegrationSubmit = (data) => {
    console.log('Integration Settings:', data);
    toast({
      title: t.settingsSavedSuccess,
      description: t.integrationSettings,
    });
  };

  const onNotificationSubmit = (data) => {
    console.log('Notification Settings:', data);
    toast({
      title: t.settingsSavedSuccess,
      description: t.notificationSettings,
    });
  };

  const onUserSubmit = (data) => {
    console.log('User Management:', data);
    const newUser = {
      id: adminUsers.length + 1,
      username: data.username,
      email: data.email,
      role: data.role,
    };
    setAdminUsers([...adminUsers, newUser]);
    setIsAddUserDialogOpen(false);
    userForm.reset();
    toast({
      title: t.userAddedSuccess,
    });
  };

  const handleDeleteUser = (userId) => {
    setAdminUsers(adminUsers.filter(user => user.id !== userId));
    toast({
      title: t.userDeletedSuccess,
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">{t.settings}</h1>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start mb-6 overflow-x-auto flex">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>{t.general}</span>
          </TabsTrigger>
          <TabsTrigger value="drivers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{t.drivers}</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <PackageCheck className="h-4 w-4" />
            <span>{t.orders}</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{t.users}</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            <span>{t.integrations}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>{t.notifications}</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t.companyInfo}
          </h2>
          <Form {...generalForm}>
            <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={generalForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.companyName}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.companyName} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={generalForm.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.contactEmail}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t.contactEmail} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={generalForm.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.contactPhone}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.contactPhone} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={generalForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.address}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t.address} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={generalForm.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.timeZone}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.timeZone} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={generalForm.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.currency}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.currency} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={generalForm.control}
                  name="defaultMapZoom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.defaultMapZoom}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder={t.defaultMapZoom} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {t.save}
              </Button>
            </form>
          </Form>
        </TabsContent>

        {/* Driver Settings */}
        <TabsContent value="drivers" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t.driverSettings}
          </h2>
          <Form {...driverForm}>
            <form onSubmit={driverForm.handleSubmit(onDriverSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={driverForm.control}
                  name="requiredDocuments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.requiredDocuments}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t.requiredDocuments} {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of required documents
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={driverForm.control}
                  name="customStatuses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.customStatuses}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t.customStatuses} {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of driver statuses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={driverForm.control}
                  name="commissionRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.commissionRate}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder={t.commissionRate} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={driverForm.control}
                  name="payoutMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.payoutMethod}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.payoutMethod} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={driverForm.control}
                  name="minDeliveriesForPayout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.minDeliveriesForPayout}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder={t.minDeliveriesForPayout} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {t.save}
              </Button>
            </form>
          </Form>
        </TabsContent>

        {/* Order Settings */}
        <TabsContent value="orders" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            {t.orderSettings}
          </h2>
          <Form {...orderForm}>
            <form onSubmit={orderForm.handleSubmit(onOrderSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={orderForm.control}
                  name="orderStatuses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.orderStatuses}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t.orderStatuses} {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of order statuses
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={orderForm.control}
                  name="baseFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.baseFee}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder={t.baseFee} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={orderForm.control}
                  name="perKmFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.perKmFee}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder={t.perKmFee} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={orderForm.control}
                  name="minimumOrderValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.minimumOrderValue}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder={t.minimumOrderValue} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={orderForm.control}
                  name="cancellationTimeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.cancellationTimeLimit}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder={t.cancellationTimeLimit} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={orderForm.control}
                  name="cancellationFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.cancellationFee}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder={t.cancellationFee} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={orderForm.control}
                  name="notifyCustomerOnStatusChange"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t.notifyCustomerOnStatusChange}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={orderForm.control}
                  name="notifyDriverOnAssignment"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t.notifyDriverOnAssignment}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {t.save}
              </Button>
            </form>
          </Form>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t.userManagement}
            </h2>
            <Button onClick={() => setIsAddUserDialogOpen(true)} className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t.addUser}
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">{t.username}</th>
                  <th className="py-3 px-4 text-left">{t.email}</th>
                  <th className="py-3 px-4 text-left">{t.role}</th>
                  <th className="py-3 px-4 text-left">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {adminUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          {t.edit}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          {t.delete}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.addNewUser}</DialogTitle>
                <DialogDescription>
                  Add a new admin user to the system
                </DialogDescription>
              </DialogHeader>
              <Form {...userForm}>
                <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                  <FormField
                    control={userForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.username}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.username} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.email}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t.email} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.role}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.role} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.password}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={t.password} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.passwordConfirm}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={t.passwordConfirm} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                      {t.cancel}
                    </Button>
                    <Button type="submit">{t.addUser}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integrations" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plug className="h-5 w-5" />
            {t.integrationSettings}
          </h2>
          <Form {...integrationForm}>
            <form onSubmit={integrationForm.handleSubmit(onIntegrationSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={integrationForm.control}
                  name="paymentGatewayApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.paymentGatewayApiKey}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.paymentGatewayApiKey} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={integrationForm.control}
                  name="paymentGatewaySecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.paymentGatewaySecret}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t.paymentGatewaySecret} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={integrationForm.control}
                  name="mapsApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.mapsApiKey}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.mapsApiKey} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={integrationForm.control}
                  name="smsApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.smsApiKey}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.smsApiKey} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={integrationForm.control}
                  name="emailServiceApiKey"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>{t.emailServiceApiKey}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.emailServiceApiKey} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {t.save}
              </Button>
            </form>
          </Form>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t.notificationSettings}
          </h2>
          <Form {...notificationForm}>
            <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={notificationForm.control}
                  name="alertOnNewOrder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t.alertOnNewOrder}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="alertOnCancelledOrder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t.alertOnCancelledOrder}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="alertOnDelayedDelivery"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t.alertOnDelayedDelivery}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="alertOnDriverUnavailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t.alertOnDriverUnavailable}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="alertOnLowInventory"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t.alertOnLowInventory}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="dailyReportEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t.dailyReportEmail}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationForm.control}
                  name="weeklyReportEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t.weeklyReportEmail}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {t.save}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;