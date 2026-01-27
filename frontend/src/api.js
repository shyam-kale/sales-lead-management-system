const BASE_URL = "http://localhost:8081/api";

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function request(url, options = {}) {
  const config = {
    headers: defaultHeaders,
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data.message || message;
    } catch (_) {}
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function getLeads(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${BASE_URL}/leads?${query}`
    : `${BASE_URL}/leads`;
  return request(url);
}

export async function getLeadById(id) {
  return request(`${BASE_URL}/leads/${id}`);
}

export async function createLead(payload) {
  return request(`${BASE_URL}/leads`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateLead(id, payload) {
  return request(`${BASE_URL}/leads/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteLead(id) {
  return request(`${BASE_URL}/leads/${id}`, {
    method: "DELETE",
  });
}

export async function bulkDeleteLeads(ids = []) {
  return request(`${BASE_URL}/leads/bulk-delete`, {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

export async function getDeals(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${BASE_URL}/deals?${query}`
    : `${BASE_URL}/deals`;
  return request(url);
}

export async function getDealById(id) {
  return request(`${BASE_URL}/deals/${id}`);
}

export async function createDeal(payload) {
  return request(`${BASE_URL}/deals`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateDeal(id, payload) {
  return request(`${BASE_URL}/deals/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteDeal(id) {
  return request(`${BASE_URL}/deals/${id}`, {
    method: "DELETE",
  });
}

export async function getDashboardMetrics() {
  return request(`${BASE_URL}/metrics`);
}

export async function getLeadMetrics() {
  return request(`${BASE_URL}/metrics/leads`);
}

export async function getDealMetrics() {
  return request(`${BASE_URL}/metrics/deals`);
}

export async function searchLeads(keyword) {
  return request(`${BASE_URL}/leads/search?query=${encodeURIComponent(keyword)}`);
}

export async function searchDeals(keyword) {
  return request(`${BASE_URL}/deals/search?query=${encodeURIComponent(keyword)}`);
}

export async function exportLeads(format = "csv") {
  const response = await fetch(`${BASE_URL}/leads/export?format=${format}`);
  if (!response.ok) {
    throw new Error("Export failed");
  }
  return response.blob();
}

export async function importLeads(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/leads/import`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Import failed");
  }

  return response.json();
}

export async function healthCheck() {
  return request(`${BASE_URL}/health`);
}

export async function pingServer() {
  return request(`${BASE_URL}/ping`);
}

export async function getServerTime() {
  return request(`${BASE_URL}/time`);
}

export async function withRetry(fn, retries = 3, delay = 500) {
  try {
    return await fn();
  } catch (e) {
    if (retries <= 0) throw e;
    await new Promise(r => setTimeout(r, delay));
    return withRetry(fn, retries - 1, delay);
  }
}

export async function safeGetLeads() {
  return withRetry(() => getLeads(), 2);
}

export async function safeGetDeals() {
  return withRetry(() => getDeals(), 2);
}

export function buildQuery(filters = {}) {
  const params = {};
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== "") {
      params[key] = filters[key];
    }
  });
  return params;
}

export async function getFilteredLeads(filters) {
  return getLeads(buildQuery(filters));
}

export async function getFilteredDeals(filters) {
  return getDeals(buildQuery(filters));
}
// Profile API
export async function getUserProfile() {
  return request(`${BASE_URL}/profile`);
}

export async function updateUserProfile(profile) {
  return request(`${BASE_URL}/profile`, {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}

export async function updateLoginTracking() {
  return request(`${BASE_URL}/profile/login`, {
    method: "POST",
  });
}

// Settings API
export async function getUserSettings() {
  return request(`${BASE_URL}/settings`);
}

export async function updateUserSettings(settings) {
  return request(`${BASE_URL}/settings`, {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

export async function getUserSetting(key) {
  return request(`${BASE_URL}/settings/${key}`);
}

export async function updateUserSetting(key, value) {
  return request(`${BASE_URL}/settings/${key}`, {
    method: "PUT",
    body: JSON.stringify({ value }),
  });
}

// Activities API
export async function getActivities() {
  return request(`${BASE_URL}/activities`);
}

export async function createActivity(activity) {
  return request(`${BASE_URL}/activities`, {
    method: "POST",
    body: JSON.stringify(activity),
  });
}

// Analytics API (placeholder for future implementation)
export async function getAnalyticsData(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${BASE_URL}/analytics?${query}`
    : `${BASE_URL}/analytics`;
  return request(url);
}

// Reports API (placeholder for future implementation)
export async function generateReport(reportConfig) {
  return request(`${BASE_URL}/reports`, {
    method: "POST",
    body: JSON.stringify(reportConfig),
  });
}

export async function getReports() {
  return request(`${BASE_URL}/reports`);
}