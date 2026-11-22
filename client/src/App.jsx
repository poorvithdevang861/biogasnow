import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ProfileProvider } from './context/ProfileContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Help } from './pages/Help';
import { WasteDashboard } from './pages/wasteProvider/WasteDashboard';
import { ConsumerDashboard } from './pages/consumer/ConsumerDashboard';
import { PlantDashboard } from './pages/plantProvider/PlantDashboard';

export function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/help" element={<Help />} />
              <Route path="/waste-provider" element={<WasteDashboard />} />
              <Route path="/consumer" element={<ConsumerDashboard />} />
              <Route path="/plant-provider" element={<PlantDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ProfileProvider>
    </ThemeProvider>
  );
}

export default App;
