import { Toaster as DefaultToaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { LanguageProvider } from "./context/LanguageContext";
import Admin from "./pages/Admin";
import { SessionAuth, useSessionContext } from "supertokens-auth-react/recipe/session";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSessionContext();

  if (session.loading) {
    return <div>Loading...</div>;
  }

  if (!(session as any).doesSessionExist) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

const AdminRoute = () => {
  const session = useSessionContext();

  if (session.loading) {
    return <div>Loading...</div>;
  }

  if (!(session as any).doesSessionExist) {
    return <Navigate to="/auth" />;
  }

  // In a real application, you would check user roles here
  // You can access session.userId here if needed
  const isAdmin = true; // Replace with actual admin check

  if (!isAdmin) {
    return <div>Unauthorized Access</div>;
  }

  return <Admin />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <DefaultToaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/admin"
              element={
                <SessionAuth>
                  <AdminRoute />
                </SessionAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;