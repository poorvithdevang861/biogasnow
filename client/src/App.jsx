import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ProfileProvider } from './context/ProfileContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Help } from './pages/Help';
import { WasteOnboarding } from './pages/wasteProvider/WasteOnboarding';
import { ConsumerOnboarding } from './pages/consumer/ConsumerOnboarding';
import { PlantOnboarding } from './pages/plantProvider/PlantOnboarding';

export function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/help" element={<Help />} />
              <Route path="/waste-provider" element={<WasteOnboarding />} />
              <Route path="/consumer" element={<ConsumerOnboarding />} />
              <Route path="/plant-provider" element={<PlantOnboarding />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ProfileProvider>
    </ThemeProvider>
  );
}

export default App;
