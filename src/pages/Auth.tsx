import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { setAdminStatus } from '@/utils/adminUtils';



const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState(''); // Removed
  const [tenantId, setTenantId] = useState('');
  const { language, setLanguage, texts } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // toggleForm removed

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleLanguage = () =>{
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleSignIn = async (e) => {
    console.log("handleSignIn called"); 
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Tenant ID is always required for sign-in now
    if (!tenantId) {
      setError(language === "ar" ? "معرف الشركة مطلوب" : "Company ID is required");
      setIsLoading(false);
      return;
    }
    console.log("Attempting sign in for tenant:", tenantId); // Log tenantId
  
    try {
      const response = await signIn({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password }
        ],
        userContext: { // Pass tenantId in userContext
          tenantId: tenantId
        }
      });
  
      if (response.status === "WRONG_CREDENTIALS_ERROR") {
        throw new Error(
          language === "ar" 
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" 
            : "Incorrect email or password"
        );
      }
  
      setSuccess(
        language === "ar"
          ? "تم تسجيل الدخول بنجاح!"
          : "Login successful!"
      );
      navigate('/admin');
    } catch (error) {
      console.error("Sign in error:", error);
      setError(
        language === "ar"
          ? `خطأ في تسجيل الدخول: ${error.message}`
          : `Sign in error: ${error.message}`
      );
    }

  };

  // handleSignUp function removed

  const authTexts = {
    en: {
      // createAccount: 'Create an account', // Removed
      signIn: 'Sign in to your account',
      emailAddress: 'Email address',
      password: 'Password',
      // confirmPassword: 'Confirm Password', // Removed
      // signUpButton: 'Sign up', // Removed
      signInButton: 'Sign in',
      // alreadyHaveAccount: 'Already have an account?', // Removed
      // dontHaveAccount: 'Don\'t have an account?', // Removed
      // createOne: 'Create one', // Removed
      // switchToSignIn: 'Sign in', // Removed
      changeLanguage: 'AR',
      joinPlatform: 'Join Our Platform',
      platformDescription: 'Connect with customers and truckers in one place. Streamline your logistics and transportation needs with our comprehensive platform.',
      // passwordMismatch: 'Password and confirm password do not match', // Removed
      networkError: "Network error - please check your connection",
      companyId: 'Company ID',
    },
    ar: {
      // createAccount: 'إنشاء حساب', // Removed
      signIn: 'تسجيل الدخول إلى حسابك',
      emailAddress: 'عنوان البريد الإلكتروني',
      password: 'كلمة المرور',
      // confirmPassword: 'تأكيد كلمة المرور', // Removed
      // signUpButton: 'إنشاء حساب', // Removed
      signInButton: 'تسجيل الدخول',
      // alreadyHaveAccount: 'هل لديك حساب بالفعل؟', // Removed
      // dontHaveAccount: 'ليس لديك حساب؟', // Removed
      // createOne: 'إنشاء حساب', // Removed
      // switchToSignIn: 'تسجيل الدخول', // Removed
      changeLanguage: 'EN',
      joinPlatform: 'انضم إلى منصتنا',
      platformDescription: 'تواصل مع العملاء وسائقي الشاحنات في مكان واحد. قم بتبسيط احتياجاتك اللوجستية والنقل مع منصتنا الشاملة.',
      // passwordMismatch: 'كلمة المرور وتأكيد كلمة المرور غير متطابقين.', // Removed
      networkError: "خطأ في الشبكة - يرجى التحقق من اتصالك",
      companyId: 'معرف الشركة',
    }};

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
            {authTexts[language].signIn}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  {/* You can add an error icon here */}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSignIn}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                {authTexts[language].emailAddress}
              </label>
              <div className="mt-2 relative">
              <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
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
            </div>

            {/* Tenant ID field is now always part of the form */}
            <div>
              <label htmlFor="tenantId" className="block text-sm font-medium leading-6 text-gray-900">
                {authTexts[language].companyId || 'Company ID'}
                </label>
                <div className="mt-2 relative">
                  <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="tenantId"
                    name="tenantId"
                    type="text"
                    autoComplete="organization"
                    required // Always required
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    className={`block w-full rounded-md border-0 py-2 ${language === 'ar' ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'} text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`}
                    placeholder={language === 'en' ? "your-company-id" : "معرف-شركتك"}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                {authTexts[language].password}
              </label>
              <div className="mt-2 relative">
              <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
              <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                    autoComplete="current-password" // Now always current-password
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
            </div>

            {/* Confirm password field removed */}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {authTexts[language].signInButton}
              </button>
            </div>
          </form>

          {/* Toggle link removed */}
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