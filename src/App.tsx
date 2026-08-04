import { Toaster as DefaultToaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SuperTokensWrapper } from 'supertokens-auth-react';
import SuperTokens from 'supertokens-auth-react';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import { LanguageProvider } from './context/LanguageContext';
import { frontendConfig } from './Authentication/frontendConfig';

SuperTokens.init(frontendConfig());

const queryClient = new QueryClient();

const App = () => (
  <SuperTokensWrapper>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <DefaultToaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </SuperTokensWrapper>
);

export default App;
