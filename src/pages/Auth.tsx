import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { setAdminStatus } from '@/utils/adminUtils';

const Auth = () => {
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showSignIn, setShowSignIn] = useState(true);

  // Add your own state for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const texts = {
    en: {
      backToHome: 'Back to home',
    },
    ar: {
      backToHome: 'العودة إلى الصفحة الرئيسية',
    }
  };

  const authTexts = {
    en: {
      createAccount: 'Create an account',
      signIn: 'Sign in to your account',
      emailAddress: 'Email address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      signUpButton: 'Sign up',
      signInButton: 'Sign in',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: 'Don\'t have an account?',
      createOne: 'Create one',
      switchToSignIn: 'Sign in',
      switchToSignUp: 'Create account',
      changeLanguage: 'AR',
      joinPlatform: 'Join Our Platform',
      platformDescription: 'Connect with customers and truckers in one place. Streamline your logistics and transportation needs with our comprehensive platform.',
      adminAccess: 'Admin Access',
      adminNote: 'This is for demo purposes only'
    },
    ar: {
      createAccount: 'إنشاء حساب',
      signIn: 'تسجيل الدخول إلى حسابك',
      emailAddress: 'عنوان البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      signUpButton: 'إنشاء حساب',
      signInButton: 'تسجيل الدخول',
      alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
      dontHaveAccount: 'ليس لديك حساب؟',
      createOne: 'إنشاء حساب',
      switchToSignIn: 'تسجيل الدخول',
      switchToSignUp: 'إنشاء حساب',
      changeLanguage: 'EN',
      joinPlatform: 'انضم إلى منصتنا',
      platformDescription: 'تواصل مع العملاء وسائقي الشاحنات في مكان واحد. قم بتبسيط احتياجاتك اللوجستية والنقل مع منصتنا الشاملة.',
      adminAccess: 'وصول المسؤول',
      adminNote: 'هذا لأغراض العرض التوضيحي فقط'
    }
  };

  // Add your own submit handlers
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add your sign-in logic here
    if (isAdmin) {
      setAdminStatus(true);
    }
    navigate('/');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add your sign-up logic here
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Left section - Form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-6 py-12 lg:px-8">
        <Link to="/" className={`absolute top-8 ${language === 'ar' ? 'right-8' : 'left-8'} flex items-center text-primary hover:text-primary/80 transition-colors`}>
          <ArrowLeft className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4 ${language === 'ar' ? 'transform rotate-180' : ''}`} />
          {texts[language].backToHome}
        </Link>

        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className={`absolute top-8 ${language === 'ar' ? 'left-8' : 'right-8'} p-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 hover:bg-white/80 text-primary`}
        >
          {authTexts[language].changeLanguage}
        </button>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {showSignIn ? authTexts[language].signIn : authTexts[language].createAccount}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {showSignIn ? (
            <>
              <form onSubmit={handleSignIn}>
                <input
                  type="email"
                  placeholder={authTexts[language].emailAddress}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  placeholder={authTexts[language].password}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                  required
                />
                <button type="submit" className="w-full bg-primary text-white py-2 rounded">
                  {authTexts[language].signInButton}
                </button>
              </form>
              <div className="mt-6 text-center text-sm text-gray-500">
                {authTexts[language].dontHaveAccount}{' '}
                <button
                  onClick={() => setShowSignIn(false)}
                  className="font-semibold text-primary hover:text-primary/80"
                >
                  {authTexts[language].createOne}
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleSignUp}>
                <input
                  type="email"
                  placeholder={authTexts[language].emailAddress}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  placeholder={authTexts[language].password}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  placeholder={authTexts[language].confirmPassword}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                  required
                />
                <button type="submit" className="w-full bg-primary text-white py-2 rounded">
                  {authTexts[language].signUpButton}
                </button>
              </form>
              <div className="mt-6 text-center text-sm text-gray-500">
                {authTexts[language].alreadyHaveAccount}{' '}
                <button
                  onClick={() => setShowSignIn(true)}
                  className="font-semibold text-primary hover:text-primary/80"
                >
                  {authTexts[language].switchToSignIn}
                </button>
              </div>
            </>
          )}

          
        </div>
      </div>

      {/* Right section - Image */}
      <div className="hidden md:block md:w-1/2 bg-gray-100">
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80)' }}>
          <div className="h-full w-full bg-gradient-to-b from-black/60 to-black/20 flex items-center justify-center">
            <div className="text-center px-8 py-12 max-w-md">
              <h2 className="text-3xl font-bold text-white mb-4">
                {authTexts[language].joinPlatform}
              </h2>
              <p className="text-white/90">
                {authTexts[language].platformDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;