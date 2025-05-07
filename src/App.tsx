import { Toaster as DefaultToaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { LanguageProvider } from "./context/LanguageContext";
import Admin from "./pages/Admin";
import initializeAuth from "./pages/Auth"
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { PreBuiltUIList, SuperTokensConfig, ComponentWrapper } from "../src/Authentication/frontendConfig";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import * as ReactRouter from "react-router-dom";
import { SessionAuth } from "supertokens-auth-react/recipe/session";


// Initialize SuperTokens - ideally in the global
SuperTokens.init(SuperTokensConfig);

const queryClient = new QueryClient();

const App = () => (
  <ComponentWrapper>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <DefaultToaster/>
            <Routes>
              <Route path="/" element={<Index/>}/>
              <Route path="/test" element={<Auth/>}/>
              {getSuperTokensRoutesForReactRouterDom(ReactRouter, PreBuiltUIList)}
              <Route path="/admin" 
                element={<SessionAuth>
                  <Admin/>
                </SessionAuth>}/>
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </ComponentWrapper>
);

export default App;