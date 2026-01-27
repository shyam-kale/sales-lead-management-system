import React, { useState, useEffect } from "react";
import { getLeads, getDeals } from "./api";
import Dashboard from "./Dashboard";
import LeadList from "./LeadList";
import DealPipeline from "./DealPipeline";
import Analytics from "./Analytics";
import Reports from "./Reports";
import Settings from "./Settings";
import Profile from "./Profile";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [leadsData, dealsData] = await Promise.all([
        getLeads(),
        getDeals()
      ]);
      setLeads(leadsData || []);
      setDeals(dealsData || []);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load data. Please check if backend is running.");
      setLeads([]);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Removed auto-refresh - user can manually refresh when needed
  }, []);

  const renderView = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={loadData}>
            🔄 Retry
          </button>
        </div>
      );
    }

    switch (currentView) {
      case "leads":
        return <LeadList leads={leads} refresh={loadData} />;
      case "deals":
        return <DealPipeline deals={deals} refresh={loadData} />;
      case "analytics":
        return <Analytics leads={leads} deals={deals} />;
      case "reports":
        return <Reports leads={leads} deals={deals} />;
      case "settings":
        return <Settings />;
      case "profile":
        return <Profile />;
      case "dashboard":
      default:
        return <Dashboard leads={leads} deals={deals} refresh={loadData} />;
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", badge: null },
    { id: "leads", label: "Leads", icon: "👥", badge: leads.length },
    { id: "deals", label: "Deals", icon: "💼", badge: deals.length },
    { id: "analytics", label: "Analytics", icon: "📈", badge: null },
    { id: "reports", label: "Reports", icon: "📄", badge: null },
    { id: "settings", label: "Settings", icon: "⚙️", badge: null },
    { id: "profile", label: "Profile", icon: "👤", badge: null }
  ];

  return (
    <div className="App">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? "active" : ""}`}
              onClick={() => setCurrentView(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge !== null && item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="status-indicator">
            <span className={`status-dot ${error ? 'offline' : 'online'}`}></span>
            <span className="status-text">{error ? 'Offline' : 'Online'}</span>
          </div>
        </div>
      </aside>

      <div className="main-content">
        <header className="top-header">
          <h1 className="app-title">Sales Lead Management System</h1>
          <div className="header-actions">
            <button className="refresh-btn" onClick={loadData} disabled={loading}>
              {loading ? '⏳' : '🔄'} Refresh
            </button>
            <div className="data-count">
              <span>{leads.length} Leads</span>
              <span className="separator">•</span>
              <span>{deals.length} Deals</span>
            </div>
          </div>
        </header>

        <main className="page-content">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;