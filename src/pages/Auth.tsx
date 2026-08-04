import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { superuserLogin } from '@/lib/adminAuth';

/**
 * Operator sign-in — uses qafila-platform POST /api/v1/auth/superuser/login.
 * Email must be on the server SUPERUSER_EMAIL allow-list.
 */
const Auth = () => {
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const texts = {
    en: {
      backToHome: 'Back to home',
      signIn: 'Operator sign in',
      emailAddress: 'Email address',
      password: 'Password',
      signInButton: 'Sign in',
      changeLanguage: 'AR',
      joinPlatform: 'QafilaTech Ops',
      platformDescription:
        'Sign in with your allow-listed operator account to manage orders, drivers, and support.',
      success: 'Signed in',
      failed: 'Sign in failed',
    },
    ar: {
      backToHome: 'العودة إلى الصفحة الرئيسية',
      signIn: 'تسجيل دخول المشغّل',
      emailAddress: 'عنوان البريد الإلكتروني',
      password: 'كلمة المرور',
      signInButton: 'تسجيل الدخول',
      changeLanguage: 'EN',
      joinPlatform: 'عمليات QafilaTech',
      platformDescription:
        'سجّل الدخول بحساب المشغّل المصرّح به لإدارة الطلبات والسائقين والدعم.',
      success: 'تم تسجيل الدخول',
      failed: 'فشل تسجيل الدخول',
    },
  } as const;

  const t = texts[language];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await superuserLogin(email, password);
      toast({ title: t.success });
      navigate('/admin');
    } catch (err) {
      toast({
        title: t.failed,
        description: err instanceof Error ? err.message : String(err),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="flex flex-col justify-center w-full md:w-1/2 px-6 py-12 lg:px-8">
        <Link
          to="/"
          className={`absolute top-8 ${language === 'ar' ? 'right-8' : 'left-8'} flex items-center text-primary hover:text-primary/80 transition-colors`}
        >
          <ArrowLeft
            className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4 ${language === 'ar' ? 'transform rotate-180' : ''}`}
          />
          {t.backToHome}
        </Link>

        <button
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className={`absolute top-8 ${language === 'ar' ? 'left-8' : 'right-8'} p-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 hover:bg-white text-primary`}
        >
          {t.changeLanguage}
        </button>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="/QT-Logo/Dark/LogoDark.png"
            alt="QafilaTech"
            className="mx-auto h-10 w-auto object-contain mb-4"
          />
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {t.signIn}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSignIn} className="space-y-4">
            <label className="block">
              <span className="sr-only">{t.emailAddress}</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  placeholder={t.emailAddress}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-2 border rounded"
                  required
                  autoComplete="username"
                />
              </div>
            </label>
            <label className="block">
              <span className="sr-only">{t.password}</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  placeholder={t.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-2 border rounded"
                  required
                  autoComplete="current-password"
                />
              </div>
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-main flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t.signInButton}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 bg-primary/90 text-white items-center justify-center p-12">
        <div className="max-w-md">
          <img
            src="/QT-Logo/Light/LogoLight.png"
            alt="QafilaTech"
            className="h-12 w-auto object-contain mb-6"
          />
          <h1 className="text-3xl font-bold mb-4">{t.joinPlatform}</h1>
          <p className="text-white/90 leading-relaxed">{t.platformDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
