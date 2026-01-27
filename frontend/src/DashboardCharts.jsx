import React, { useMemo } from "react";

export default function DashboardCharts({ leads, deals, stats, allLeads, allDeals, dateRange }) {
  const maxLeadCount = Math.max(...Object.values(stats.leadsByStatus), 1);
  const maxDealCount = Math.max(...Object.values(stats.dealsByStage), 1);

  // Calculate revenue by stage
  const revenueByStage = deals.reduce((acc, deal) => {
    const stage = deal.stage;
    if (!acc[stage]) acc[stage] = 0;
    acc[stage] += Number(deal.amount) || 0;
    return acc;
  }, {});

  // Calculate trend data for the selected period
  const trendData = useMemo(() => {
    const days = parseInt(dateRange) || 30;
    const trends = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLeads = allLeads.filter(l => 
        new Date(l.createdAt).toISOString().split('T')[0] === dateStr
      ).length;
      
      const dayDeals = allDeals.filter(d => 
        new Date(d.createdAt).toISOString().split('T')[0] === dateStr
      ).length;
      
      const dayRevenue = allDeals
        .filter(d => new Date(d.createdAt).toISOString().split('T')[0] === dateStr)
        .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
      
      trends.push({
        date: dateStr,
        leads: dayLeads,
        deals: dayDeals,
        revenue: dayRevenue,
        label: date.getDate()
      });
    }
    
    return trends;
  }, [allLeads, allDeals, dateRange]);

  const maxTrendLeads = Math.max(...trendData.map(t => t.leads), 1);
  const maxTrendDeals = Math.max(...trendData.map(t => t.deals), 1);
  const maxTrendRevenue = Math.max(...trendData.map(t => t.revenue), 1);

  // Top performing leads (by conversion potential)
  const topLeads = useMemo(() => {
    return leads
      .filter(l => l.status === 'QUALIFIED')
      .slice(0, 5);
  }, [leads]);

  // Top deals by value
  const topDeals = useMemo(() => {
    return deals
      .sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))
      .slice(0, 5);
  }, [deals]);

  return (
    <div className="charts-container">
      {/* Lead Trend Chart */}
      <div className="chart-card full-width">
        <h3>📈 Lead Acquisition Trend</h3>
        <div className="trend-chart">
          {trendData.map((point, index) => (
            <div key={index} className="trend-bar">
              <div 
                className="trend-fill leads"
                style={{ height: `${(point.leads / maxTrendLeads) * 100}%` }}
                title={`${point.date}: ${point.leads} leads`}
              />
              {index % Math.floor(trendData.length / 7) === 0 && (
                <div className="trend-label">{point.label}</div>
              )}
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-color leads"></span>
            Leads per day
          </span>
        </div>
      </div>

      {/* Deal Trend Chart */}
      <div className="chart-card full-width">
        <h3>💼 Deal Closure Trend</h3>
        <div className="trend-chart">
          {trendData.map((point, index) => (
            <div key={index} className="trend-bar">
              <div 
                className="trend-fill deals"
                style={{ height: `${(point.deals / maxTrendDeals) * 100}%` }}
                title={`${point.date}: ${point.deals} deals`}
              />
              {index % Math.floor(trendData.length / 7) === 0 && (
                <div className="trend-label">{point.label}</div>
              )}
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-color deals"></span>
            Deals per day
          </span>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="chart-card full-width">
        <h3>💰 Revenue Trend</h3>
        <div className="trend-chart">
          {trendData.map((point, index) => (
            <div key={index} className="trend-bar">
              <div 
                className="trend-fill revenue"
                style={{ height: `${(point.revenue / maxTrendRevenue) * 100}%` }}
                title={`${point.date}: $${point.revenue.toLocaleString()}`}
              />
              {index % Math.floor(trendData.length / 7) === 0 && (
                <div className="trend-label">{point.label}</div>
              )}
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-color revenue"></span>
            Revenue per day
          </span>
        </div>
      </div>

      {/* Lead Status Distribution */}
      <div className="chart-card">
        <h3>👥 Lead Status Distribution</h3>
        <div className="bar-chart">
          {Object.entries(stats.leadsByStatus).map(([status, count]) => (
            <div key={status} className="bar-item">
              <div className="bar-label">
                {status}
                <span className="bar-percentage">
                  {stats.totalLeads > 0 ? ((count / stats.totalLeads) * 100).toFixed(0) : 0}%
                </span>
              </div>
              <div className="bar-wrapper">
                <div 
                  className={`bar-fill ${status.toLowerCase()}`}
                  style={{ width: `${(count / maxLeadCount) * 100}%` }}
                >
                  <span className="bar-value">{count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deal Pipeline */}
      <div className="chart-card">
        <h3>💼 Deal Pipeline Stages</h3>
        <div className="bar-chart">
          {Object.entries(stats.dealsByStage).map(([stage, count]) => (
            <div key={stage} className="bar-item">
              <div className="bar-label">
                {stage}
                <span className="bar-percentage">
                  {stats.totalDeals > 0 ? ((count / stats.totalDeals) * 100).toFixed(0) : 0}%
                </span>
              </div>
              <div className="bar-wrapper">
                <div 
                  className={`bar-fill ${stage.toLowerCase()}`}
                  style={{ width: `${(count / maxDealCount) * 100}%` }}
                >
                  <span className="bar-value">{count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Stage */}
      <div className="chart-card full-width">
        <h3>💰 Revenue Distribution by Stage</h3>
        <div className="revenue-chart">
          {Object.entries(revenueByStage).map(([stage, revenue]) => (
            <div key={stage} className="revenue-item">
              <div className="revenue-stage">{stage}</div>
              <div className="revenue-bar-wrapper">
                <div 
                  className={`revenue-bar ${stage.toLowerCase()}`}
                  style={{ 
                    width: `${stats.totalRevenue > 0 ? (revenue / stats.totalRevenue) * 100 : 0}%` 
                  }}
                >
                  <span className="revenue-value">${revenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="revenue-percentage">
                {stats.totalRevenue > 0 ? ((revenue / stats.totalRevenue) * 100).toFixed(1) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Qualified Leads */}
      <div className="chart-card">
        <h3>🎯 Top Qualified Leads</h3>
        <div className="top-list">
          {topLeads.length > 0 ? (
            topLeads.map((lead, index) => (
              <div key={lead.id} className="top-item">
                <div className="top-rank">#{index + 1}</div>
                <div className="top-info">
                  <strong>{lead.name}</strong>
                  <span>{lead.email}</span>
                </div>
                <div className="top-badge qualified">{lead.status}</div>
              </div>
            ))
          ) : (
            <div className="empty-state">No qualified leads yet</div>
          )}
        </div>
      </div>

      {/* Top Deals by Value */}
      <div className="chart-card">
        <h3>💎 Highest Value Deals</h3>
        <div className="top-list">
          {topDeals.length > 0 ? (
            topDeals.map((deal, index) => (
              <div key={deal.id} className="top-item">
                <div className="top-rank">#{index + 1}</div>
                <div className="top-info">
                  <strong>{deal.title}</strong>
                  <span>${Number(deal.amount).toLocaleString()}</span>
                </div>
                <div className={`top-badge ${deal.stage.toLowerCase()}`}>{deal.stage}</div>
              </div>
            ))
          ) : (
            <div className="empty-state">No deals yet</div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="chart-card full-width">
        <h3>📋 Recent Activity Timeline</h3>
        <div className="activity-list">
          {[...leads.slice(-10).reverse(), ...deals.slice(-10).reverse()]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 15)
            .map((item, index) => (
              <div key={index} className="activity-item">
                <span className="activity-icon">
                  {item.email ? '👤' : '💼'}
                </span>
                <div className="activity-content">
                  <strong>{item.name || item.title}</strong>
                  <span className="activity-meta">
                    {item.email ? (
                      <>Lead - {item.status} - {item.email}</>
                    ) : (
                      <>Deal - {item.stage} - ${Number(item.amount).toLocaleString()}</>
                    )}
                  </span>
                </div>
                <span className="activity-time">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="chart-card full-width performance-summary">
        <h3>📊 Performance Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-label">Total Pipeline Value</div>
            <div className="summary-value">${stats.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Average Deal Size</div>
            <div className="summary-value">${stats.avgDealValue}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Conversion Rate</div>
            <div className="summary-value">{stats.conversionRate}%</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Active Opportunities</div>
            <div className="summary-value">{stats.totalLeads + stats.totalDeals}</div>
          </div>
        </div>
      </div>
    </div>
  );
}