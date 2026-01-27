import React, { useState, useMemo } from "react";

export default function Analytics({ leads, deals }) {
  const [selectedChart, setSelectedChart] = useState("performance");
  const [timeframe, setTimeframe] = useState("30");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [showDetails, setShowDetails] = useState(false);

  // Filter data based on timeframe
  const filteredData = useMemo(() => {
    let startDate, endDate;
    
    if (customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    } else {
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeframe));
    }

    const filteredLeads = leads.filter(lead => {
      const date = new Date(lead.createdAt);
      return date >= startDate && date <= endDate;
    });

    const filteredDeals = deals.filter(deal => {
      const date = new Date(deal.createdAt);
      return date >= startDate && date <= endDate;
    });

    return { leads: filteredLeads, deals: filteredDeals, startDate, endDate };
  }, [leads, deals, timeframe, customStartDate, customEndDate]);

  // Performance Analytics
  const performanceMetrics = useMemo(() => {
    const totalLeads = filteredData.leads.length;
    const totalDeals = filteredData.deals.length;
    const totalRevenue = filteredData.deals.reduce((sum, deal) => sum + (Number(deal.amount) || 0), 0);
    
    const conversionRate = totalLeads > 0 ? ((totalDeals / totalLeads) * 100).toFixed(2) : 0;
    const avgDealValue = totalDeals > 0 ? (totalRevenue / totalDeals).toFixed(2) : 0;
    const avgTimeToClose = totalDeals > 0 ? 14 : 0; // Mock data
    
    const leadVelocity = totalLeads / (parseInt(timeframe) || 30);
    const dealVelocity = totalDeals / (parseInt(timeframe) || 30);
    
    return {
      totalLeads,
      totalDeals,
      totalRevenue,
      conversionRate,
      avgDealValue,
      avgTimeToClose,
      leadVelocity: leadVelocity.toFixed(2),
      dealVelocity: dealVelocity.toFixed(2)
    };
  }, [filteredData, timeframe]);

  // Funnel Analysis
  const funnelData = useMemo(() => {
    const stages = [
      { name: "New Leads", count: filteredData.leads.filter(l => l.status === "NEW").length, color: "#3182ce" },
      { name: "Contacted", count: filteredData.leads.filter(l => l.status === "CONTACTED").length, color: "#ed8936" },
      { name: "Qualified", count: filteredData.leads.filter(l => l.status === "QUALIFIED").length, color: "#48bb78" },
      { name: "Proposal", count: filteredData.deals.filter(d => d.stage === "PROPOSAL").length, color: "#9f7aea" },
      { name: "Closed", count: filteredData.deals.filter(d => d.stage === "CLOSED").length, color: "#38b2ac" }
    ];
    
    const maxCount = Math.max(...stages.map(s => s.count), 1);
    return stages.map(stage => ({
      ...stage,
      percentage: maxCount > 0 ? ((stage.count / maxCount) * 100).toFixed(1) : 0,
      conversionRate: stages[0].count > 0 ? ((stage.count / stages[0].count) * 100).toFixed(1) : 0
    }));
  }, [filteredData]);

  // Trend Analysis
  const trendData = useMemo(() => {
    const days = parseInt(timeframe) || 30;
    const trends = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLeads = filteredData.leads.filter(l => 
        new Date(l.createdAt).toISOString().split('T')[0] === dateStr
      ).length;
      
      const dayDeals = filteredData.deals.filter(d => 
        new Date(d.createdAt).toISOString().split('T')[0] === dateStr
      ).length;
      
      const dayRevenue = filteredData.deals
        .filter(d => new Date(d.createdAt).toISOString().split('T')[0] === dateStr)
        .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
      
      trends.push({
        date: dateStr,
        leads: dayLeads,
        deals: dayDeals,
        revenue: dayRevenue,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return trends;
  }, [filteredData, timeframe]);

  const maxTrendValue = Math.max(
    ...trendData.map(t => selectedChart === "leads" ? t.leads : selectedChart === "deals" ? t.deals : t.revenue),
    1
  );

  const exportAnalytics = () => {
    const data = {
      period: `${filteredData.startDate.toLocaleDateString()} - ${filteredData.endDate.toLocaleDateString()}`,
      metrics: performanceMetrics,
      funnel: funnelData,
      trends: trendData
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const renderChart = () => {
    if (selectedChart === "funnel") {
      return (
        <div className="funnel-chart">
          {funnelData.map((stage, index) => (
            <div key={stage.name} className="funnel-stage">
              <div className="funnel-stage-header">
                <h4>{stage.name}</h4>
                <span className="funnel-count">{stage.count}</span>
              </div>
              <div className="funnel-bar-wrapper">
                <div 
                  className="funnel-bar"
                  style={{ 
                    width: `${stage.percentage}%`,
                    backgroundColor: stage.color
                  }}
                >
                  <span className="funnel-percentage">{stage.conversionRate}%</span>
                </div>
              </div>
              {index < funnelData.length - 1 && (
                <div className="funnel-arrow">↓</div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (selectedChart === "trends") {
      return (
        <div className="trend-chart-container">
          <div className="trend-chart-large">
            {trendData.map((point, index) => (
              <div key={index} className="trend-bar-large">
                <div 
                  className={`trend-fill-large ${chartType}`}
                  style={{ 
                    height: chartType === "line" ? "4px" : `${(point[selectedChart] / maxTrendValue) * 100}%`,
                    backgroundColor: selectedChart === "leads" ? "#3182ce" : selectedChart === "deals" ? "#38a169" : "#805ad5"
                  }}
                  title={`${point.label}: ${point[selectedChart]}`}
                />
                {index % Math.max(1, Math.floor(trendData.length / 10)) === 0 && (
                  <div className="trend-label-large">{point.label}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="performance-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h4>Lead Generation</h4>
            <div className="metric-value">{performanceMetrics.totalLeads}</div>
            <div className="metric-detail">{performanceMetrics.leadVelocity}/day avg</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">💼</div>
          <div className="metric-info">
            <h4>Deal Closure</h4>
            <div className="metric-value">{performanceMetrics.totalDeals}</div>
            <div className="metric-detail">{performanceMetrics.dealVelocity}/day avg</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-info">
            <h4>Conversion Rate</h4>
            <div className="metric-value">{performanceMetrics.conversionRate}%</div>
            <div className="metric-detail">Lead to deal conversion</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <h4>Revenue Generated</h4>
            <div className="metric-value">${performanceMetrics.totalRevenue.toLocaleString()}</div>
            <div className="metric-detail">${performanceMetrics.avgDealValue} avg deal</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>📊 Advanced Analytics</h2>
        <button className="export-btn" onClick={exportAnalytics}>
          📥 Export Data
        </button>
      </div>

      {/* Analytics Controls */}
      <div className="analytics-controls">
        <div className="control-group">
          <label>📈 Chart Type:</label>
          <select value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)}>
            <option value="performance">Performance Overview</option>
            <option value="funnel">Sales Funnel</option>
            <option value="trends">Trend Analysis</option>
          </select>
        </div>

        <div className="control-group">
          <label>⏰ Timeframe:</label>
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="180">Last 6 Months</option>
            <option value="365">Last Year</option>
          </select>
        </div>

        {selectedChart === "trends" && (
          <div className="control-group">
            <label>📊 Data:</label>
            <select value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)}>
              <option value="leads">Leads</option>
              <option value="deals">Deals</option>
              <option value="revenue">Revenue</option>
            </select>
          </div>
        )}

        {selectedChart === "trends" && (
          <div className="control-group">
            <label>📈 Style:</label>
            <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
            </select>
          </div>
        )}

        <div className="control-group">
          <label>📅 Custom Range:</label>
          <div className="date-range">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              placeholder="End Date"
            />
          </div>
        </div>

        <button 
          className={`toggle-btn ${showDetails ? 'active' : ''}`}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '📊 Hide Details' : '📋 Show Details'}
        </button>
      </div>

      {/* Main Chart Area */}
      <div className="chart-main-area">
        {renderChart()}
      </div>

      {/* Detailed Analytics */}
      {showDetails && (
        <div className="analytics-details">
          <div className="detail-section">
            <h3>📈 Key Performance Indicators</h3>
            <div className="kpi-grid">
              <div className="kpi-item">
                <span className="kpi-label">Lead Velocity</span>
                <span className="kpi-value">{performanceMetrics.leadVelocity} leads/day</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">Deal Velocity</span>
                <span className="kpi-value">{performanceMetrics.dealVelocity} deals/day</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">Avg Time to Close</span>
                <span className="kpi-value">{performanceMetrics.avgTimeToClose} days</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">Pipeline Health</span>
                <span className="kpi-value">{performanceMetrics.conversionRate > 15 ? 'Excellent' : performanceMetrics.conversionRate > 10 ? 'Good' : 'Needs Improvement'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>🎯 Conversion Funnel Analysis</h3>
            <div className="funnel-analysis">
              {funnelData.map((stage, index) => (
                <div key={stage.name} className="funnel-analysis-item">
                  <div className="funnel-stage-name">{stage.name}</div>
                  <div className="funnel-metrics">
                    <span>Count: {stage.count}</span>
                    <span>Conversion: {stage.conversionRate}%</span>
                    {index > 0 && (
                      <span>Drop-off: {(100 - parseFloat(stage.conversionRate)).toFixed(1)}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}