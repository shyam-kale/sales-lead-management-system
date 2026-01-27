import React from "react";
import { useEffect, useMemo, useState } from "react";

export default function DealPipeline({ deals }) {
  const [internalDeals, setInternalDeals] = useState([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("amount");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  useEffect(() => {
    setInternalDeals(deals || []);
  }, [deals]);

  const filteredDeals = useMemo(() => {
    let data = [...internalDeals];

    if (search.trim()) {
      data = data.filter(d =>
        d.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (stageFilter !== "ALL") {
      data = data.filter(d => d.stage === stageFilter);
    }

    if (minAmount) {
      data = data.filter(d => Number(d.amount) >= Number(minAmount));
    }

    if (maxAmount) {
      data = data.filter(d => Number(d.amount) <= Number(maxAmount));
    }

    data.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "createdAt") {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      if (valA < valB) return sortOrder === "ASC" ? -1 : 1;
      if (valA > valB) return sortOrder === "ASC" ? 1 : -1;
      return 0;
    });

    return data;
  }, [
    internalDeals,
    search,
    stageFilter,
    sortBy,
    sortOrder,
    minAmount,
    maxAmount,
  ]);

  const pipelineStats = useMemo(() => {
    const stats = {
      PROSPECT: 0,
      NEGOTIATION: 0,
      CLOSED_WON: 0,
      CLOSED_LOST: 0,
      totalRevenue: 0,
    };

    internalDeals.forEach(d => {
      if (stats[d.stage] !== undefined) {
        stats[d.stage] += Number(d.amount || 0);
      }
      stats.totalRevenue += Number(d.amount || 0);
    });

    return stats;
  }, [internalDeals]);

  const stageDistribution = useMemo(() => {
    return internalDeals.reduce((map, d) => {
      map[d.stage] = (map[d.stage] || 0) + 1;
      return map;
    }, {});
  }, [internalDeals]);

  return (
    <div className="card">
      <h2>Deal Pipeline</h2>

      <div className="pipeline-stats">
        <div>Total Revenue: ${pipelineStats.totalRevenue}</div>
        <div>Prospect: ${pipelineStats.PROSPECT}</div>
        <div>Negotiation: ${pipelineStats.NEGOTIATION}</div>
        <div>Won: ${pipelineStats.CLOSED_WON}</div>
        <div>Lost: ${pipelineStats.CLOSED_LOST}</div>
      </div>

      <div className="pipeline-controls">
        <input
          placeholder="Search deals..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={stageFilter}
          onChange={e => setStageFilter(e.target.value)}
        >
          <option value="ALL">All Stages</option>
          <option value="PROSPECT">Prospect</option>
          <option value="NEGOTIATION">Negotiation</option>
          <option value="CLOSED_WON">Closed Won</option>
          <option value="CLOSED_LOST">Closed Lost</option>
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="amount">Amount</option>
          <option value="title">Title</option>
          <option value="stage">Stage</option>
          <option value="createdAt">Created Date</option>
        </select>

        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
        >
          <option value="DESC">Descending</option>
          <option value="ASC">Ascending</option>
        </select>

        <input
          placeholder="Min Amount"
          type="number"
          value={minAmount}
          onChange={e => setMinAmount(e.target.value)}
        />

        <input
          placeholder="Max Amount"
          type="number"
          value={maxAmount}
          onChange={e => setMaxAmount(e.target.value)}
        />
      </div>

      <div className="pipeline-distribution">
        {Object.keys(stageDistribution).map(stage => (
          <div key={stage}>
            {stage}: {stageDistribution[stage]}
          </div>
        ))}
      </div>

      <div className="pipeline-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Stage</th>
              <th>Amount</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map(deal => (
              <tr
                key={deal.id}
                className={selectedDeal === deal.id ? "active" : ""}
                onClick={() => setSelectedDeal(deal.id)}
              >
                <td>{deal.title}</td>
                <td>{deal.stage}</td>
                <td>${deal.amount}</td>
                <td>
                  {deal.createdAt
                    ? new Date(deal.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDeals.length === 0 && (
          <p>No deals match current filters</p>
        )}
      </div>
    </div>
  );
}
