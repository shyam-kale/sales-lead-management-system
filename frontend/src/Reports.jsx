import React, { useState, useMemo } from "react";

export default function Reports({ leads, deals }) {
  const [reportType, setReportType] = useState("summary");
  const [dateRange, setDateRange] = useState("30");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("table");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filter and sort data
  const processedData = useMemo(() => {
    let startDate, endDate;
    
    if (customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    } else {
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));
    }

    let filteredLeads = leads.filter(lead => {
      const date = new Date(lead.createdAt);
      const matchesDate = date >= startDate && date <= endDate;
      const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
      return matchesDate && matchesStatus;
    });

    let filteredDeals = deals.filter(deal => {
      const date = new Date(deal.createdAt);
      const matchesDate = date >= startDate && date <= endDate;
      const matchesStatus = filterStatus === "all" || deal.stage === filterStatus;
      return matchesDate && matchesStatus;
    });

    // Sort data
    const sortFunction = (a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "date":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "name":
          aValue = (a.name || a.title || "").toLowerCase();
          bValue = (b.name || b.title || "").toLowerCase();
          break;
        case "amount":
          aValue = Number(a.amount) || 0;
          bValue = Number(b.amount) || 0;
          break;
        case "status":
          aValue = (a.status || a.stage || "").toLowerCase();
          bValue = (b.status || b.stage || "").toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    };

    filteredLeads.sort(sortFunction);
    filteredDeals.sort(sortFunction);

    return { leads: filteredLeads, deals: filteredDeals, startDate, endDate };
  }, [leads, deals, dateRange, customStartDate, customEndDate, filterStatus, sortBy, sortOrder]);

  // Generate report data
  const reportData = useMemo(() => {
    const totalLeads = processedData.leads.length;
    const totalDeals = processedData.deals.length;
    const totalRevenue = processedData.deals.reduce((sum, deal) => sum + (Number(deal.amount) || 0), 0);
    
    const leadsByStatus = {
      NEW: processedData.leads.filter(l => l.status === "NEW").length,
      CONTACTED: processedData.leads.filter(l => l.status === "CONTACTED").length,
      QUALIFIED: processedData.leads.filter(l => l.status === "QUALIFIED").length
    };
    
    const dealsByStage = {
      NEW: processedData.deals.filter(d => d.stage === "NEW").length,
      PROPOSAL: processedData.deals.filter(d => d.stage === "PROPOSAL").length,
      QUALIFIED: processedData.deals.filter(d => d.stage === "QUALIFIED").length,
      CLOSED: processedData.deals.filter(d => d.stage === "CLOSED").length
    };
    
    const conversionRate = totalLeads > 0 ? ((totalDeals / totalLeads) * 100).toFixed(2) : 0;
    const avgDealValue = totalDeals > 0 ? (totalRevenue / totalDeals).toFixed(2) : 0;
    
    return {
      summary: {
        totalLeads,
        totalDeals,
        totalRevenue,
        conversionRate,
        avgDealValue,
        leadsByStatus,
        dealsByStage
      },
      period: `${processedData.startDate.toLocaleDateString()} - ${processedData.endDate.toLocaleDateString()}`
    };
  }, [processedData]);

  const exportReport = (format) => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === "csv") {
      let csvContent = "";
      
      if (reportType === "leads" || reportType === "summary") {
        csvContent += "LEADS REPORT\n";
        csvContent += "Name,Email,Status,Created Date\n";
        processedData.leads.forEach(lead => {
          csvContent += `"${lead.name}","${lead.email}","${lead.status}","${new Date(lead.createdAt).toLocaleDateString()}"\n`;
        });
        csvContent += "\n";
      }
      
      if (reportType === "deals" || reportType === "summary") {
        csvContent += "DEALS REPORT\n";
        csvContent += "Title,Stage,Amount,Created Date\n";
        processedData.deals.forEach(deal => {
          csvContent += `"${deal.title}","${deal.stage}","${deal.amount}","${new Date(deal.createdAt).toLocaleDateString()}"\n`;
        });
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${timestamp}.csv`;
      a.click();
    } else if (format === "json") {
      const jsonData = {
        reportType,
        period: reportData.period,
        summary: reportData.summary,
        leads: processedData.leads,
        deals: processedData.deals,
        generatedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${timestamp}.json`;
      a.click();
    } else if (format === "pdf") {
      // Mock PDF generation - in real app would use a PDF library
      alert("PDF export would be implemented with a library like jsPDF or react-pdf");
    }
  };

  const renderSummaryReport = () => (
    <div className="report-summary">
      <div className="summary-header">
        <h3>📊 Executive Summary</h3>
        <p className="report-period">Period: {reportData.period}</p>
      </div>
      
      <div className="summary-metrics">
        <div className="summary-card">
          <div className="summary-icon">👥</div>
          <div className="summary-info">
            <h4>Total Leads</h4>
            <div className="summary-value">{reportData.summary.totalLeads}</div>
            <div className="summary-breakdown">
              <span>New: {reportData.summary.leadsByStatus.NEW}</span>
              <span>Contacted: {reportData.summary.leadsByStatus.CONTACTED}</span>
              <span>Qualified: {reportData.summary.leadsByStatus.QUALIFIED}</span>
            </div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">💼</div>
          <div className="summary-info">
            <h4>Total Deals</h4>
            <div className="summary-value">{reportData.summary.totalDeals}</div>
            <div className="summary-breakdown">
              <span>New: {reportData.summary.dealsByStage.NEW}</span>
              <span>Proposal: {reportData.summary.dealsByStage.PROPOSAL}</span>
              <span>Closed: {reportData.summary.dealsByStage.CLOSED}</span>
            </div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">💰</div>
          <div className="summary-info">
            <h4>Total Revenue</h4>
            <div className="summary-value">${reportData.summary.totalRevenue.toLocaleString()}</div>
            <div className="summary-breakdown">
              <span>Avg Deal: ${reportData.summary.avgDealValue}</span>
              <span>Conversion: {reportData.summary.conversionRate}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="summary-insights">
        <h4>📈 Key Insights</h4>
        <ul>
          <li>
            <strong>Lead Performance:</strong> {reportData.summary.leadsByStatus.QUALIFIED} qualified leads out of {reportData.summary.totalLeads} total 
            ({reportData.summary.totalLeads > 0 ? ((reportData.summary.leadsByStatus.QUALIFIED / reportData.summary.totalLeads) * 100).toFixed(1) : 0}% qualification rate)
          </li>
          <li>
            <strong>Deal Pipeline:</strong> {reportData.summary.dealsByStage.CLOSED} deals closed with ${reportData.summary.totalRevenue.toLocaleString()} in revenue
          </li>
          <li>
            <strong>Conversion Efficiency:</strong> {reportData.summary.conversionRate}% lead-to-deal conversion rate
          </li>
          <li>
            <strong>Revenue Performance:</strong> Average deal value of ${reportData.summary.avgDealValue}
          </li>
        </ul>
      </div>
    </div>
  );

  const renderDetailedTable = (data, type) => (
    <div className="detailed-table">
      <table>
        <thead>
          <tr>
            {type === "leads" ? (
              <>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created Date</th>
              </>
            ) : (
              <>
                <th>Title</th>
                <th>Stage</th>
                <th>Amount</th>
                <th>Created Date</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {type === "leads" ? (
                <>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <span className={`status ${item.status}`}>{item.status}</span>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </>
              ) : (
                <>
                  <td>{item.title}</td>
                  <td>
                    <span className={`status ${item.stage}`}>{item.stage}</span>
                  </td>
                  <td>${Number(item.amount).toLocaleString()}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderReport = () => {
    switch (reportType) {
      case "summary":
        return renderSummaryReport();
      case "leads":
        return (
          <div className="report-section">
            <h3>👥 Leads Report ({processedData.leads.length} records)</h3>
            {selectedFormat === "table" ? 
              renderDetailedTable(processedData.leads, "leads") :
              <div className="report-cards">
                {processedData.leads.map((lead, index) => (
                  <div key={index} className="report-card">
                    <h4>{lead.name}</h4>
                    <p>Email: {lead.email}</p>
                    <p>Status: <span className={`status ${lead.status}`}>{lead.status}</span></p>
                    <p>Created: {new Date(lead.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            }
          </div>
        );
      case "deals":
        return (
          <div className="report-section">
            <h3>💼 Deals Report ({processedData.deals.length} records)</h3>
            {selectedFormat === "table" ? 
              renderDetailedTable(processedData.deals, "deals") :
              <div className="report-cards">
                {processedData.deals.map((deal, index) => (
                  <div key={index} className="report-card">
                    <h4>{deal.title}</h4>
                    <p>Stage: <span className={`status ${deal.stage}`}>{deal.stage}</span></p>
                    <p>Amount: ${Number(deal.amount).toLocaleString()}</p>
                    <p>Created: {new Date(deal.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            }
          </div>
        );
      default:
        return renderSummaryReport();
    }
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>📄 Reports & Analytics</h2>
        <div className="export-buttons">
          <button className="export-btn" onClick={() => exportReport("csv")}>
            📊 Export CSV
          </button>
          <button className="export-btn" onClick={() => exportReport("json")}>
            📋 Export JSON
          </button>
          <button className="export-btn" onClick={() => exportReport("pdf")}>
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="report-controls">
        <div className="control-group">
          <label>📊 Report Type:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="summary">Executive Summary</option>
            <option value="leads">Leads Report</option>
            <option value="deals">Deals Report</option>
          </select>
        </div>

        <div className="control-group">
          <label>📅 Date Range:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="180">Last 6 Months</option>
            <option value="365">Last Year</option>
          </select>
        </div>

        <div className="control-group">
          <label>🎯 Filter:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="PROPOSAL">Proposal</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {(reportType === "leads" || reportType === "deals") && (
          <div className="control-group">
            <label>📋 Format:</label>
            <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
              <option value="table">Table View</option>
              <option value="cards">Card View</option>
            </select>
          </div>
        )}

        <div className="control-group">
          <label>🔄 Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
            {reportType === "deals" && <option value="amount">Amount</option>}
          </select>
        </div>

        <div className="control-group">
          <label>↕️ Order:</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

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
      </div>

      {/* Report Content */}
      <div className="report-content">
        {renderReport()}
      </div>

      {/* Report Footer */}
      <div className="report-footer">
        <p>Report generated on {new Date().toLocaleString()}</p>
        <p>Data range: {reportData.period}</p>
        <p>Total records: {reportType === "leads" ? processedData.leads.length : reportType === "deals" ? processedData.deals.length : processedData.leads.length + processedData.deals.length}</p>
      </div>
    </div>
  );
}