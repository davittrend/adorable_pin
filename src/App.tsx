import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Callback from './pages/Callback';
import SchedulePins from './pages/SchedulePins';
import ScheduledPins from './pages/ScheduledPins';
import AddAccount from './pages/AddAccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedule-pins" element={<SchedulePins />} />
          <Route path="/scheduled-pins" element={<ScheduledPins />} />
          <Route path="/accounts/add" element={<AddAccount />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;