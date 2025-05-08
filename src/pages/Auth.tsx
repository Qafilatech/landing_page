import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Shield} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { setAdminStatus } from '@/utils/adminUtils';
import { signIn, signUp } from 'supertokens-auth-react/recipe/emailpassword';
import { text } from 'stream/consumers';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { language, setLanguage, texts} = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAdminStatus(false);
    setError("");
    setSuccess("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleLanguage = () =>{
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
  
    try {
      const response = await signIn({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password }
        ]
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

  
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    if (password !== confirmPassword) {
      setError(authTexts[language].passwordMismatch);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await signUp({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password }
        ]
      });
  
      if (response.status === "FIELD_ERROR") {
        // response.formFields.forEach(field => {
        //   if (field.id === "email") {
        //     setError(
        //       language === "ar" 
        //         ? `خطأ في البريد الإلكتروني: ${field.error}` 
        //         : `Email error: ${field.error}`
        //     );
        //   }
        // });
        // return;

        const emailError = response.formFields.find(f => f.id === "email")?.error;
        const passwordError = response.formFields.find(f => f.id === "password")?.error;
        setError(emailError || passwordError || texts.auth.signupError);
        return;
      }
      

      setSuccess(
        language === "ar"
          ? "تم التسجيل بنجاح! تحقق من بريدك الإلكتروني للتأكيد."
          : "Signup successful! Check your email to confirm."
      );
      setIsSignUp(false);
    } catch (error) {
      console.error("Sign up error:", error);
      let errorMessage = authTexts[language].networkError;
      if (error.message.includes("Failed to fetch")){
        errorMessage = authTexts[language].networkError;
      } else if (error.messages){
        errorMessage = error.messages
      }
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
      changeLanguage: 'AR',
      joinPlatform: 'Join Our Platform',
      platformDescription: 'Connect with customers and truckers in one place. Streamline your logistics and transportation needs with our comprehensive platform.',
      adminAccess: 'Admin Access',
      adminCheckbox: 'Sign in as administrator',
      adminNote: 'This is for demo purposes only',
      passwordMismatch: 'Password and confirm password do not match',
      networkError: "Network error - please check your connection",

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
      changeLanguage: 'EN',
      joinPlatform: 'انضم إلى منصتنا',
      platformDescription: 'تواصل مع العملاء وسائقي الشاحنات في مكان واحد. قم بتبسيط احتياجاتك اللوجستية والنقل مع منصتنا الشاملة.',
      adminAccess: 'وصول المسؤول',
      adminCheckbox: 'تسجيل الدخول كمسؤول',
      adminNote: 'هذا لأغراض العرض التوضيحي فقط',
      passwordMismatch: 'كلمة المرور وتأكيد كلمة المرور غير متطابقين.',
      networkError: "خطأ في الشبكة - يرجى التحقق من اتصالك",

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
          onClick={toggleLanguage}
          className={`absolute top-8 ${language === 'ar' ? 'left-8' : 'right-8'} p-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 hover:bg-white/80 text-primary`}
        >
          {authTexts[language].changeLanguage}
        </button>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {isSignUp ? authTexts[language].createAccount : authTexts[language].signIn}
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
          <form className="space-y-6" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                {authTexts[language].emailAddress}
              </label>
              <div className="mt-2 relative">
              <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full rounded-md border-0 py-2 ${language === 'ar' ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'} text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`}
                  placeholder={language === 'en' ? "name@example.com" : "الاسم@مثال.كوم"}
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
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full rounded-md border-0 py-2 ${language === 'ar' ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10 text-left'} text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`}
                  placeholder="••••••••"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 ${language === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                  {authTexts[language].confirmPassword}
                </label>
                <div className="mt-2 relative">
                <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full rounded-md border-0 py-2 ${language === 'ar' ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10 text-left'} text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`}
                    placeholder="••••••••"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
            )}   

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {isSignUp ? authTexts[language].signUpButton : authTexts[language].signInButton}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
          {isSignUp ? authTexts[language].alreadyHaveAccount : authTexts[language].dontHaveAccount}
          <button
              onClick={toggleForm}
              className="font-semibold leading-6 text-primary hover:text-primary/80 mr-1 ml-1"
            >
              {isSignUp ? authTexts[language].switchToSignIn : authTexts[language].createOne}
              </button>
          </p>
        </div>
      </div>

      {/* Right section - Image */}
      <div className="hidden md:block md:w-1/2 bg-gray-100">
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80)' }}>
          <div className="h-full w-full bg-gradient-to-b from-black/60 to-black/20 flex items-center justify-center">
            <div className="text-center px-8 py-12 max-w-md">
              <h2 className="text-3xl font-bold text-white mb-4">
              {language === 'en' ? 'Join Our Platform' : 'انضم إلى منصتنا'}
              </h2>
              <p className="text-white/90">
              {language === 'en'
                  ? 'Connect with customers and truckers in one place. Streamline your logistics and transportation needs with our comprehensive platform.'
                  : 'تواصل مع العملاء وسائقي الشاحنات في مكان واحد. قم بتبسيط احتياجاتك اللوجستية والنقل مع منصتنا الشاملة.'}              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;