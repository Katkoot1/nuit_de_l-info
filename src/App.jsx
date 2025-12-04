import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from '../Layout.jsx';
import Home from '../Pages/Home.jsx';
import Chapiter1 from '../Pages/Chapiter1.jsx';
import Chapiter2 from '../Pages/Chapiter2.jsx';
import Chapiter3 from '../Pages/Chapiter3.jsx';
import Chapiter4 from '../Pages/Chapiter4.jsx';
import Forum from '../Pages/Forum.jsx';
import ImpactTracker from '../Pages/ImpactTracker.jsx';
import Profil from '../Pages/Profil.jsx';
import SimulationGame from '../Pages/SimulationGame.jsx';
import Resources from '../Pages/Resources.jsx';
import EstablishmentDashboard from '../Pages/EstablishmentDashboard.jsx';

function AppContent() {
  const location = useLocation();
  const currentPageName = location.pathname === '/' ? 'Home' 
    : location.pathname.slice(1).split('/')[0].charAt(0).toUpperCase() + location.pathname.slice(1).split('/')[0].slice(1);

  return (
    <Layout currentPageName={currentPageName}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chapter1" element={<Chapiter1 />} />
        <Route path="/chapter2" element={<Chapiter2 />} />
        <Route path="/chapter3" element={<Chapiter3 />} />
        <Route path="/chapter4" element={<Chapiter4 />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/impact" element={<ImpactTracker />} />
        <Route path="/profile" element={<Profil />} />
        <Route path="/simulation" element={<SimulationGame />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/dashboard" element={<EstablishmentDashboard />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

