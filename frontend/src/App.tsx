import "./App.css";
import { ReactFlowProvider } from "@xyflow/react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth, UserStateProvider, supabase } from "@/hooks/useAuth";
import DeploymentPage from "@/pages/deployment";
import MonitoringPage from "@/pages/monitoring";
import SecretsPage from "@/pages/secrets";
import SettingsPage from "@/pages/settings";
import LoginPage from "@/pages/auth/LoginPage";
import AgentPage from "@/pages/agent";
import { FinicAppContextProvider } from "@/hooks/useFinicApp";
import posthog from 'posthog-js'

if (import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY,
    {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'always'
    }
  )
} else {
  console.warn("No PostHog key found")
}

function App() {
  const { session, setSession } = useAuth();

  const renderLoginRoutes = () => {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  };

  const renderAppRoutes = () => {
    return (
      <FinicAppContextProvider>
        <Routes>
          <Route path="/" element={<DeploymentPage />} />
          <Route path="/agent/:id" element={<AgentPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/secrets" element={<SecretsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </FinicAppContextProvider>
    );
  };

  return (
    <Router>
      <UserStateProvider session={session} setSession={setSession}>
        {session ? renderAppRoutes() : renderLoginRoutes()}
      </UserStateProvider>
    </Router>
  );
}

export default App;
