import React, { useMemo, useState } from "react";
import DashboardStats from "./DashboardStats";
import DashboardCharts from "./DashboardCharts";

export default function Dashboard({ leads, deals, refresh }) {
  const [dateRange, setDateRange] = useState("30");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("all");

  // Filter data by date range
  const filteredData = useMemo(() => {
    const now = new Date();
    const daysAgo = new Date(now.setDate(now.getDate() - parseInt(dateRange)));
    
    const filteredLeads = leads.filter(lead => {
      const matchesDate = dateRange === "all" || new Date(lead.createdAt) >= daysAgo;
      const matchesSearch = !searchTerm || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDate && matchesSearch;
    });

    const filteredDeals = deals.filter(deal => {
      const matchesDate = dateRange === "all" || new Date(deal.createdAt) >= daysAgo;
      const matchesSearch = !searchTerm || 
        deal.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDate && matchesSearch;
    });

    return { leads: filteredLeads, deals: filteredDeals };
  }, [leads, deals, dateRange, searchTerm]);

  const stats = useMemo(() => {
    const totalLeads = filteredData.leads.length;
    const totalDeals = filteredData.deals.length;
    const totalRevenue = filteredData.deals.reduce((sum, deal) => sum + (Number(deal.amount) || 0), 0);
    
    const leadsByStatus = {
      NEW: filteredData.leads.filter(l => l.status === "NEW").length,
      CONTACTED: filteredData.leads.filter(l => l.status === "CONTACTED").length,
      QUALIFIED: filteredData.leads.filter(l => l.status === "QUALIFIED").length
    };
    
    const dealsByStage = {
      NEW: filteredData.deals.filter(d => d.stage === "NEW").length,
      PROPOSAL: filteredData.deals.filter(d => d.stage === "PROPOSAL").length,
      QUALIFIED: filteredData.deals.filter(d => d.stage === "QUALIFIED").length,
      CLOSED: filteredData.deals.filter(d => d.stage === "CLOSED").length
    };
    
    const conversionRate = totalLeads > 0 ? ((totalDeals / totalLeads) * 100).toFixed(1) : 0;
    const avgDealValue = totalDeals > 0 ? (totalRevenue / totalDeals).toFixed(2) : 0;
    
    // Calculate growth rates
    const prevPeriodStart = new Date();
    prevPeriodStart.setDate(prevPeriodStart.getDate() - (parseInt(dateRange) * 2));
    const prevPeriodEnd = new Date();
    prevPeriodEnd.setDate(prevPeriodEnd.getDate() - parseInt(dateRange));
    
    const prevLeads = leads.filter(l => {
      const date = new Date(l.createdAt);
      return date >= prevPeriodStart && date < prevPeriodEnd;
    }).length;
    
    const prevDeals = deals.filter(d => {
      const date = new Date(d.createdAt);
      return date >= prevPeriodStart && date < prevPeriodEnd;
    }).length;
    
    const prevRevenue = deals.filter(d => {
      const date = new Date(d.createdAt);
      return date >= prevPeriodStart && date < prevPeriodEnd;
    }).reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    
    const leadGrowth = prevLeads > 0 ? (((totalLeads - prevLeads) / prevLeads) * 100).toFixed(1) : 0;
    const dealGrowth = prevDeals > 0 ? (((totalDeals - prevDeals) / prevDeals) * 100).toFixed(1) : 0;
    const revenueGrowth = prevRevenue > 0 ? (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : 0;
    
    return {
      totalLeads,
      totalDeals,
      totalRevenue,
      leadsByStatus,
      dealsByStage,
      conversionRate,
      avgDealValue,
      leadGrowth,
      dealGrowth,
      revenueGrowth
    };
  }, [filteredData, leads, deals, dateRange]);

  const exportData = () => {
    const csvContent = [
      ['Type', 'Name/Title', 'Status/Stage', 'Amount', 'Date'],
      ...filteredData.leads.map(l => ['Lead', l.name, l.status, '', new Date(l.createdAt).toLocaleDateString()]),
      ...filteredData.deals.map(d => ['Deal', d.title, d.stage, d.amount, new Date(d.createdAt).toLocaleDateString()])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Controls */}
      <div className="dashboard-controls">
        <div className="control-group">
          <label>📅 Date Range:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="180">Last 6 Months</option>
            <option value="365">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="control-group">
          <label>🔍 Search:</label>
          <input
            type="text"
            placeholder="Search leads or deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>📊 View:</label>
          <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
            <option value="all">All Metrics</option>
            <option value="leads">Leads Only</option>
            <option value="deals">Deals Only</option>
            <option value="revenue">Revenue Focus</option>
          </select>
        </div>

        <button className="export-btn" onClick={exportData}>
          📥 Export CSV
        </button>
      </div>

      <DashboardStats stats={stats} />
      <DashboardCharts 
        leads={filteredData.leads} 
        deals={filteredData.deals} 
        stats={stats}
        allLeads={leads}
        allDeals={deals}
        dateRange={dateRange}
      />
    </div>
  );
}