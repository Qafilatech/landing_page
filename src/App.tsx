import { Toaster as DefaultToaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { LanguageProvider } from "./context/LanguageContext";
import Admin from "./pages/Admin";
import ActivateAccount from "./pages/ActivateAccount"; // Import the new page
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import {SuperTokensConfig, ComponentWrapper } from "../src/Authentication/frontendConfig";
import { SessionAuth } from "supertokens-auth-react/recipe/session";


// Initialize SuperTokens - ideally in the global
SuperTokens.init(SuperTokensConfig);

const queryClient = new QueryClient();

const App = () => (
  <SuperTokensWrapper>
    <ComponentWrapper>
      <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <DefaultToaster/>
            <Routes>
              <Route path="/" element={<Index/>}/>
              <Route path="/auth" element={<Auth/>}/>
              <Route 
              path="/admin" 
              element={
              <SessionAuth>
                <Admin/>
                </SessionAuth>} />
              <Route path="/:tenantId/activate-account" element={<ActivateAccount />} /> {/* Updated route */}
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
      </BrowserRouter>
    </ComponentWrapper>
  </SuperTokensWrapper>
);

export default App;