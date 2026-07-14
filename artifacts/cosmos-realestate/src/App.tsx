import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Residential from "@/pages/residential";
import Commercial from "@/pages/commercial";
import Industrial from "@/pages/industrial";
import Projects from "@/pages/projects";
import Contact from "@/pages/contact";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProperties from "@/pages/admin/properties";
import PropertyForm from "@/pages/admin/property-form";
import AdminContacts from "@/pages/admin/contacts";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            {/* Admin routes — no public Layout */}
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin/properties/new" component={PropertyForm} />
            <Route path="/admin/properties/:id/edit" component={PropertyForm} />
            <Route path="/admin/properties" component={AdminProperties} />
            <Route path="/admin/contacts" component={AdminContacts} />
            <Route path="/admin" component={AdminDashboard} />

            {/* Public routes — wrapped in Layout */}
            <Route>
              {() => (
                <Layout>
                  <Switch>
                    <Route path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/residential" component={Residential} />
                    <Route path="/commercial" component={Commercial} />
                    <Route path="/industrial" component={Industrial} />
                    <Route path="/projects" component={Projects} />
                    <Route path="/contact" component={Contact} />
                    <Route component={NotFound} />
                  </Switch>
                </Layout>
              )}
            </Route>
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
