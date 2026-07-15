import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { ScrollToTop } from '@/components/ScrollToTop';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AuthProvider } from '@/hooks/use-auth';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// ── Static imports (tiny, always needed) ─────────────────────────────────────
// NotFound is a default export — import it statically so the 404 page is
// always in the initial bundle (it's tiny and required by the router fallback).
import NotFound from '@/pages/not-found';

// ── Lazy page imports — one chunk per route ───────────────────────────────────
// Named exports need `.then(m => ({ default: m.Name }))` to satisfy React.lazy.

// Public pages
const HomePage              = React.lazy(() => import('@/pages/public/HomePage').then(m => ({ default: m.HomePage })));
const JobsPage              = React.lazy(() => import('@/pages/public/JobsPage').then(m => ({ default: m.JobsPage })));
const JobDetailPage         = React.lazy(() => import('@/pages/public/JobDetailPage').then(m => ({ default: m.JobDetailPage })));
const AboutPage             = React.lazy(() => import('@/pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const BusinessSolutionsPage = React.lazy(() => import('@/pages/public/BusinessSolutionsPage').then(m => ({ default: m.BusinessSolutionsPage })));
const DisclaimerPage        = React.lazy(() => import('@/pages/public/DisclaimerPage').then(m => ({ default: m.DisclaimerPage })));
const PrivacyPolicyPage     = React.lazy(() => import('@/pages/public/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const ContactPage           = React.lazy(() => import('@/pages/public/ContactPage').then(m => ({ default: m.ContactPage })));

// Apply flow pages
const StartApplicationPage  = React.lazy(() => import('@/pages/apply/StartApplicationPage').then(m => ({ default: m.StartApplicationPage })));
const ApplicationWizard     = React.lazy(() => import('@/pages/apply/ApplicationWizard').then(m => ({ default: m.ApplicationWizard })));
const ApplicationSuccessPage = React.lazy(() => import('@/pages/apply/ApplicationSuccessPage').then(m => ({ default: m.ApplicationSuccessPage })));

// Admin pages — largest chunk; only downloaded when /admin routes are visited
const AdminLogin            = React.lazy(() => import('@/pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard        = React.lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminApplications     = React.lazy(() => import('@/pages/admin/AdminApplications').then(m => ({ default: m.AdminApplications })));
const AdminApplicationDetail = React.lazy(() => import('@/pages/admin/AdminApplicationDetail').then(m => ({ default: m.AdminApplicationDetail })));
const AdminJobs             = React.lazy(() => import('@/pages/admin/AdminJobs').then(m => ({ default: m.AdminJobs })));
const AdminChangePassword   = React.lazy(() => import('@/pages/admin/AdminChangePassword').then(m => ({ default: m.AdminChangePassword })));
const ForgotPassword        = React.lazy(() => import('@/pages/admin/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword         = React.lazy(() => import('@/pages/admin/ResetPassword').then(m => ({ default: m.ResetPassword })));

// ── Loading fallback shown during chunk fetches ───────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

const queryClient = new QueryClient();

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/jobs" component={JobsPage} />
        <Route path="/jobs/:id" component={JobDetailPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/business-solutions" component={BusinessSolutionsPage} />
        <Route path="/disclaimer" component={DisclaimerPage} />
        <Route path="/privacy-policy" component={PrivacyPolicyPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/apply/start/:jobId" component={StartApplicationPage} />
        <Route path="/apply/success" component={ApplicationSuccessPage} />
        <Route path="/apply/:token" component={ApplicationWizard} />

        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/forgot-password" component={ForgotPassword} />
        <Route path="/admin/reset-password" component={ResetPassword} />
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
    </Suspense>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ErrorBoundary>
              <TooltipProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                  <ScrollToTop />
                  <Router />
                </WouterRouter>
                <Toaster />
              </TooltipProvider>
            </ErrorBoundary>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
