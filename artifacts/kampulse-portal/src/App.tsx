import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import NotFound from '@/pages/not-found';

import { AuthProvider } from '@/hooks/use-auth';
import { HomePage } from '@/pages/public/HomePage';
import { JobsPage } from '@/pages/public/JobsPage';
import { JobDetailPage } from '@/pages/public/JobDetailPage';
import { StartApplicationPage } from '@/pages/apply/StartApplicationPage';
import { ApplicationWizard } from '@/pages/apply/ApplicationWizard';
import { ApplicationSuccessPage } from '@/pages/apply/ApplicationSuccessPage';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminApplications } from '@/pages/admin/AdminApplications';
import { AdminApplicationDetail } from '@/pages/admin/AdminApplicationDetail';
import { AdminJobs } from '@/pages/admin/AdminJobs';
import { AdminChangePassword } from '@/pages/admin/AdminChangePassword';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/jobs" component={JobsPage} />
      <Route path="/jobs/:id" component={JobDetailPage} />
      <Route path="/apply/start/:jobId" component={StartApplicationPage} />
      <Route path="/apply/success" component={ApplicationSuccessPage} />
      <Route path="/apply/:token" component={ApplicationWizard} />
      
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        <Redirect to="/admin/dashboard" />
      </Route>
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/applications" component={AdminApplications} />
      <Route path="/admin/applications/:id" component={AdminApplicationDetail} />
      <Route path="/admin/jobs" component={AdminJobs} />
      <Route path="/admin/change-password" component={AdminChangePassword} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
