import React, {useState} from 'react';
import {Navigate, Link} from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import {useToast} from '@/hooks/use-toast';
import { ArrowLeft, Users, Package, BarChart, Settings  } from 'lucide-react';

// Mock admin check - in a real app, this would be tied to authentication
const isAdmin = () => {
    // For demo purposes, check localStorage for admin status
    return localStorage.getItem('userRole') === 'admin';
  };

  
const Admin = () => {
    const {language, texts} = useLanguage();
    const {toast} = useToast();
    const [activeTab, setActiveTab] = useState('dashboard');

    if(isAdmin()){
        toast({
            title: language === 'en' ? "Access Denied": "تم رفض الوصول",
            description: language === 'en' ? "You don't have permission to view this page" : "ليس لديك إذن لعرض هذه الصفحة",
            variant: "destructive",
        });
        return <Navigate to="/" />;
    }

    const adminTexts = {
        en: {
          adminPanel: 'dtsts Panel',
          dashboard: 'Dashboard',
          users: 'Users',
          orders: 'Orders',
          settings: 'Settings',
          backToHome: 'Back to home',
          welcomeAdmin: 'Welcome to the Admin Panel',
          overview: 'System Overview',
          totalUsers: 'Total Users',
          totalOrders: 'Total Orders',
          revenue: 'Revenue',
          recentActivity: 'Recent Activity',
          noActivity: 'No recent activity to display',
        },
        ar: {
          adminPanel: 'لوحة الإدارة',
          dashboard: 'لوحة القيادة',
          users: 'المستخدمين',
          orders: 'الطلبات',
          settings: 'الإعدادات',
          backToHome: 'العودة إلى الصفحة الرئيسية',
          welcomeAdmin: 'مرحبًا بك في لوحة الإدارة',
          overview: 'نظرة عامة على النظام',
          totalUsers: 'إجمالي المستخدمين',
          totalOrders: 'إجمالي الطلبات',
          revenue: 'الإيرادات',
          recentActivity: 'النشاط الأخير',
          noActivity: 'لا يوجد نشاط حديث لعرضه',
        }
      };

       // Demo data for admin dashboard
    const stats = {
        totalUsers: 1245,
        totalOrders: 834,
        revenue: '$42,582'
    };

    const renderTabContent = () => {
        switch(activeTab) {
          case 'dashboard':
            return (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">{adminTexts[language].welcomeAdmin}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-500">{adminTexts[language].totalUsers}</h3>
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-500">{adminTexts[language].totalOrders}</h3>
                      <Package className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-500">{adminTexts[language].revenue}</h3>
                      <BarChart className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{stats.revenue}</p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium mb-4">{adminTexts[language].recentActivity}</h3>
                  <p className="text-gray-500">{adminTexts[language].noActivity}</p>
                </div>
              </div>
            );
          case 'users':
            return <div className="p-4 bg-white rounded-lg shadow"><p>Users management would go here</p></div>;
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
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center space-x-2 p-2 rounded ${activeTab === 'users' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                >
                  <Users className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  <span>{adminTexts[language].users}</span>
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
            <div className="flex-1 p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      );

};
export default Admin;