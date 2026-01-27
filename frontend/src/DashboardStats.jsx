import React from "react";

export default function DashboardStats({ stats }) {
  const formatGrowth = (growth) => {
    const num = parseFloat(growth);
    if (num > 0) return `+${growth}%`;
    if (num < 0) return `${growth}%`;
    return '0%';
  };

  const getGrowthClass = (growth) => {
    const num = parseFloat(growth);
    if (num > 0) return 'positive';
    if (num < 0) return 'negative';
    return 'neutral';
  };

  return (
    <div className="stats-grid">
      <div className="stat-card blue">
        <div className="stat-icon">👥</div>
        <div className="stat-info">
          <h3>Total Leads</h3>
          <p className="stat-value">{stats.totalLeads}</p>
          <span className="stat-label">Active leads in pipeline</span>
          <div className={`stat-growth ${getGrowthClass(stats.leadGrowth)}`}>
            {formatGrowth(stats.leadGrowth)} vs previous period
          </div>
        </div>
      </div>

      <div className="stat-card green">
        <div className="stat-icon">💼</div>
        <div className="stat-info">
          <h3>Total Deals</h3>
          <p className="stat-value">{stats.totalDeals}</p>
          <span className="stat-label">Deals in progress</span>
          <div className={`stat-growth ${getGrowthClass(stats.dealGrowth)}`}>
            {formatGrowth(stats.dealGrowth)} vs previous period
          </div>
        </div>
      </div>

      <div className="stat-card purple">
        <div className="stat-icon">💰</div>
        <div className="stat-info">
          <h3>Total Revenue</h3>
          <p className="stat-value">${stats.totalRevenue.toLocaleString()}</p>
          <span className="stat-label">Total deal value</span>
          <div className={`stat-growth ${getGrowthClass(stats.revenueGrowth)}`}>
            {formatGrowth(stats.revenueGrowth)} vs previous period
          </div>
        </div>
      </div>

      <div className="stat-card orange">
        <div className="stat-icon">📈</div>
        <div className="stat-info">
          <h3>Conversion Rate</h3>
          <p className="stat-value">{stats.conversionRate}%</p>
          <span className="stat-label">Lead to deal conversion</span>
          <div className="stat-detail">
            {stats.totalDeals} deals from {stats.totalLeads} leads
          </div>
        </div>
      </div>

      <div className="stat-card teal">
        <div className="stat-icon">💵</div>
        <div className="stat-info">
          <h3>Avg Deal Value</h3>
          <p className="stat-value">${stats.avgDealValue}</p>
          <span className="stat-label">Average per deal</span>
          <div className="stat-detail">
            Based on {stats.totalDeals} deals
          </div>
        </div>
      </div>

      <div className="stat-card red">
        <div className="stat-icon">🎯</div>
        <div className="stat-info">
          <h3>Qualified Leads</h3>
          <p className="stat-value">{stats.leadsByStatus.QUALIFIED}</p>
          <span className="stat-label">Ready for conversion</span>
          <div className="stat-detail">
            {stats.totalLeads > 0 ? ((stats.leadsByStatus.QUALIFIED / stats.totalLeads) * 100).toFixed(1) : 0}% of total leads
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="stat-card indigo">
        <div className="stat-icon">📞</div>
        <div className="stat-info">
          <h3>Contacted Leads</h3>
          <p className="stat-value">{stats.leadsByStatus.CONTACTED}</p>
          <span className="stat-label">In communication</span>
          <div className="stat-detail">
            {stats.totalLeads > 0 ? ((stats.leadsByStatus.CONTACTED / stats.totalLeads) * 100).toFixed(1) : 0}% of total leads
          </div>
        </div>
      </div>

      <div className="stat-card pink">
        <div className="stat-icon">✅</div>
        <div className="stat-info">
          <h3>Closed Deals</h3>
          <p className="stat-value">{stats.dealsByStage.CLOSED}</p>
          <span className="stat-label">Successfully closed</span>
          <div className="stat-detail">
            {stats.totalDeals > 0 ? ((stats.dealsByStage.CLOSED / stats.totalDeals) * 100).toFixed(1) : 0}% win rate
          </div>
        </div>
      </div>

      <div className="stat-card yellow">
        <div className="stat-icon">⏳</div>
        <div className="stat-info">
          <h3>In Proposal</h3>
          <p className="stat-value">{stats.dealsByStage.PROPOSAL}</p>
          <span className="stat-label">Awaiting decision</span>
          <div className="stat-detail">
            Active proposals pending
          </div>
        </div>
      </div>
    </div>
  );
}