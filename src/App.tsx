import { Toaster as DefaultToaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { LanguageProvider } from "./context/LanguageContext";
import Admin from "./pages/Admin";
import initializeAuth from "./pages/Auth";
import { frontendConfig } from '../src/Authentication/frontendConfig'
import supertokens from 'supertokens-node';
import SuperTokens from 'supertokens-auth-react';

SuperTokens.init(frontendConfig());
console.log('SuperTokens frontend initialized successfully');


const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <DefaultToaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin/>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;