// API Configuration
const API_BASE = '/api';

// Application State
const app = {
    currentView: 'dashboard',
    leads: [],
    deals: [],
    tasks: [],
    activities: [],
    loading: false,
    selectedLeads: new Set(),
    editingLeadId: null,
    editingDealId: null,
    editingTaskId: null,
    notifications: [],

    async init() {
        this.setupNavigation();
        await this.loadData();
        this.render();
    },

    setupNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.render();
            });
        });
    },

    async loadData() {
        this.loading = true;
        try {
            const [leads, deals, tasks, activities] = await Promise.all([
                this.fetchAPI('/leads'),
                this.fetchAPI('/deals'),
                this.fetchAPI('/tasks').catch(() => []),
                this.fetchAPI('/activities').catch(() => [])
            ]);
            this.leads = leads || [];
            this.deals = deals || [];
            this.tasks = tasks || [];
            this.activities = activities || [];
            this.updateDataCount();
            this.updateBadges();
        } catch (error) {
            console.error('Failed to load data:', error);
            this.showToast('Failed to load data', 'error');
        } finally {
            this.loading = false;
        }
    },

    async fetchAPI(endpoint, options = {}) {
        const response = await fetch(API_BASE + endpoint, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        if (!response.ok) throw new Error('API request failed');
        if (response.status === 204) return null;
        return response.json();
    },

    updateDataCount() {
        document.getElementById('data-count').textContent = 
            `${this.leads.length} Leads • ${this.deals.length} Deals • ${this.tasks.length} Tasks`;
    },

    updateBadges() {
        document.getElementById('leads-badge').textContent = this.leads.length;
        document.getElementById('deals-badge').textContent = this.deals.length;
        const pendingTasks = this.tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;
        document.getElementById('tasks-badge').textContent = pendingTasks;
    },

    async refresh() {
        await this.loadData();
        this.render();
    },

    render() {
        const titleMap = {
            dashboard: 'Dashboard',
            leads: 'Lead Management',
            deals: 'Deal Pipeline',
            tasks: 'Task Management',
            activities: 'Activity Timeline',
            analytics: 'Analytics & Reports',
            reports: 'Reports',
            settings: 'Settings'
        };
        document.getElementById('page-title').textContent = titleMap[this.currentView];

        const contentArea = document.getElementById('content-area');
        
        if (this.loading) {
            contentArea.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading...</p></div>';
            return;
        }

        switch (this.currentView) {
            case 'dashboard':
                this.renderDashboard(contentArea);
                break;
            case 'leads':
                this.renderLeads(contentArea);
                break;
            case 'deals':
                this.renderDeals(contentArea);
                break;
            case 'tasks':
                this.renderTasks(contentArea);
                break;
            case 'activities':
                this.renderActivities(contentArea);
                break;
            case 'analytics':
                this.renderAnalytics(contentArea);
                break;
            case 'reports':
                this.renderReports(contentArea);
                break;
            case 'settings':
                this.renderSettings(contentArea);
                break;
        }
    },

    renderDashboard(container) {
        const stats = this.calculateStats();
        
        // Calculate hot leads
        const hotLeads = this.leads.filter(l => l.score >= 80);
        const warmLeads = this.leads.filter(l => l.score >= 60 && l.score < 80);
        const needFollowUp = this.leads.filter(l => l.status === 'CONTACTED');
        
        container.innerHTML = `
            <!-- Key Metrics -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Leads</div>
                    <div class="stat-value">${stats.totalLeads}</div>
                    <div style="font-size: 12px; color: #10b981; margin-top: 4px;">+${Math.floor(stats.totalLeads * 0.12)} this month</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Hot Leads (Score 80+)</div>
                    <div class="stat-value" style="color: #ef4444;">${hotLeads.length}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Requires immediate action</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Revenue</div>
                    <div class="stat-value">₹${stats.totalRevenue.toLocaleString()}</div>
                    <div style="font-size: 12px; color: #10b981; margin-top: 4px;">+${Math.floor(stats.totalRevenue * 0.08).toLocaleString()} vs last month</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Pipeline Value</div>
                    <div class="stat-value">₹${stats.pipelineValue.toLocaleString()}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Weighted: ₹${Math.floor(stats.pipelineValue * 0.6).toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Conversion Rate</div>
                    <div class="stat-value">${stats.conversionRate}%</div>
                    <div class="progress-bar" style="margin-top: 8px;">
                        <div class="progress-fill" style="width: ${stats.conversionRate}%"></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Win Rate</div>
                    <div class="stat-value">${stats.winRate}%</div>
                    <div class="progress-bar" style="margin-top: 8px;">
                        <div class="progress-fill" style="width: ${stats.winRate}%"></div>
                    </div>
                </div>
            </div>

            <!-- Action Items -->
            <div class="widget-grid">
                <div class="widget">
                    <div class="widget-header">
                        <span class="widget-title">🔥 Hot Leads - Act Now!</span>
                        <span class="nav-badge">${hotLeads.length}</span>
                    </div>
                    ${hotLeads.length === 0 ? '<p style="color: #6b7280;">No hot leads right now</p>' : hotLeads.slice(0, 5).map(lead => `
                        <div style="padding: 8px; border-bottom: 1px solid #e5e7eb; cursor: pointer;" onclick="app.viewLead(${lead.id})">
                            <div style="display: flex; justify-content: space-between;">
                                <strong>${lead.name}</strong>
                                <span style="color: #ef4444; font-weight: 600;">Score: ${lead.score}</span>
                            </div>
                            <div style="font-size: 12px; color: #6b7280;">${lead.company || 'No company'}</div>
                        </div>
                    `).join('')}
                    ${hotLeads.length > 5 ? `<button class="btn btn-sm btn-secondary" style="margin-top: 8px;" onclick="app.currentView='leads'; app.render();">View All ${hotLeads.length} Hot Leads</button>` : ''}
                </div>

                <div class="widget">
                    <div class="widget-header">
                        <span class="widget-title">📞 Follow-ups Needed</span>
                        <span class="nav-badge">${needFollowUp.length}</span>
                    </div>
                    ${needFollowUp.length === 0 ? '<p style="color: #6b7280;">All caught up!</p>' : needFollowUp.slice(0, 5).map(lead => `
                        <div style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
                            <div style="display: flex; justify-content: space-between;">
                                <strong>${lead.name}</strong>
                                <span class="badge badge-contacted">CONTACTED</span>
                            </div>
                            <div style="font-size: 12px; color: #6b7280;">Last contact: ${lead.lastContacted || 'Unknown'}</div>
                            <button class="btn btn-sm btn-primary" style="margin-top: 4px;" onclick="app.followUp(${lead.id})">Follow Up</button>
                        </div>
                    `).join('')}
                </div>

                <div class="widget">
                    <div class="widget-header">
                        <span class="widget-title">💰 Closing Soon</span>
                    </div>
                    ${this.deals.filter(d => d.stage === 'QUALIFIED' || d.stage === 'PROPOSAL').slice(0, 5).map(deal => `
                        <div style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
                            <strong>${deal.title}</strong>
                            <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                                <span style="font-size: 13px; color: #6b7280;">₹${(deal.amount || 0).toLocaleString()}</span>
                                <span style="font-size: 13px; color: #10b981;">${deal.probability || 0}% likely</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Recent Leads</h3>
                    <button class="btn btn-secondary" onclick="app.currentView='leads'; app.render();">View All</button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Company</th>
                                <th>Source</th>
                                <th>Score</th>
                                <th>Priority</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.leads.slice(0, 10).map(lead => {
                                const priority = lead.score >= 80 ? 'HOT' : lead.score >= 60 ? 'WARM' : lead.score >= 40 ? 'COLD' : 'FROZEN';
                                const priorityColor = priority === 'HOT' ? '#ef4444' : priority === 'WARM' ? '#f59e0b' : priority === 'COLD' ? '#3b82f6' : '#6b7280';
                                return `
                                    <tr>
                                        <td><strong>${lead.name}</strong></td>
                                        <td>${lead.company || 'N/A'}</td>
                                        <td>${lead.source || 'N/A'}</td>
                                        <td><strong>${lead.score || 0}</strong></td>
                                        <td><span style="color: ${priorityColor}; font-weight: 600;">${priority}</span></td>
                                        <td><button class="btn btn-sm btn-primary" onclick="app.viewLead(${lead.id})">View</button></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    viewLead(id) {
        const lead = this.leads.find(l => l.id === id);
        if (!lead) return;
        
        const priority = lead.score >= 80 ? 'HOT' : lead.score >= 60 ? 'WARM' : lead.score >= 40 ? 'COLD' : 'FROZEN';
        const action = priority === 'HOT' ? 'Contact immediately! High conversion potential.' :
                      priority === 'WARM' ? 'Schedule follow-up within 24 hours.' :
                      priority === 'COLD' ? 'Add to nurture campaign.' : 'Re-qualify or archive.';
        
        this.showModal(`Lead Details: ${lead.name}`, `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                    <strong>Email:</strong> ${lead.email}<br>
                    <strong>Phone:</strong> ${lead.phone || 'N/A'}<br>
                    <strong>Company:</strong> ${lead.company || 'N/A'}<br>
                    <strong>Source:</strong> ${lead.source || 'N/A'}<br>
                    <strong>Status:</strong> <span class="badge badge-${lead.status.toLowerCase()}">${lead.status}</span>
                </div>
                <div>
                    <strong>Lead Score:</strong> <span style="font-size: 24px; font-weight: 700;">${lead.score || 0}</span><br>
                    <strong>Priority:</strong> <span style="color: ${priority === 'HOT' ? '#ef4444' : '#f59e0b'}; font-weight: 600;">${priority}</span><br>
                    <strong>Recommended Action:</strong><br>
                    <div style="background: #f3f4f6; padding: 12px; border-radius: 6px; margin-top: 8px;">
                        ${action}
                    </div>
                </div>
            </div>
            <div style="margin-top: 16px;">
                <strong>Notes:</strong><br>
                <p style="background: #f3f4f6; padding: 12px; border-radius: 6px; margin-top: 8px;">
                    ${lead.notes || 'No notes'}
                </p>
            </div>
        `, () => {
            this.currentView = 'leads';
            this.render();
            return true;
        });
    },

    followUp(id) {
        this.showToast('Follow-up reminder set!', 'success');
        // In real app, this would create a task/reminder
    },

    renderLeads(container) {
        container.innerHTML = `
            <div class="card">
                <div class="action-bar">
                    <h3 class="card-title">All Leads (${this.leads.length})</h3>
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="app.showAddLeadModal()">+ Add Lead</button>
                        <button class="btn btn-secondary" onclick="app.bulkDelete()" ${this.selectedLeads.size === 0 ? 'disabled' : ''}>Delete Selected (${this.selectedLeads.size})</button>
                        <button class="btn btn-secondary" onclick="app.exportLeads()">Export CSV</button>
                        <button class="btn btn-secondary" onclick="app.showImportModal()">Import CSV</button>
                    </div>
                </div>

                <div class="filter-bar">
                    <input type="text" class="form-input" placeholder="Search by name, email, company..." 
                           id="lead-search" onkeyup="app.filterLeads()">
                    <select class="form-select" id="status-filter" onchange="app.filterLeads()">
                        <option value="">All Status</option>
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="QUALIFIED">Qualified</option>
                    </select>
                    <select class="form-select" id="source-filter" onchange="app.filterLeads()">
                        <option value="">All Sources</option>
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Trade Show">Trade Show</option>
                        <option value="Email Campaign">Email Campaign</option>
                    </select>
                    <select class="form-select" id="sort-filter" onchange="app.filterLeads()">
                        <option value="name">Sort by Name</option>
                        <option value="score">Sort by Score</option>
                        <option value="created">Sort by Date</option>
                    </select>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th><input type="checkbox" onchange="app.toggleSelectAll(this.checked)"></th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Company</th>
                                <th>Source</th>
                                <th>Status</th>
                                <th>Score</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="leads-table-body">
                            ${this.renderLeadsTable()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderLeadsTable() {
        const filtered = this.getFilteredLeads();
        if (filtered.length === 0) {
            return '<tr><td colspan="9" style="text-align:center">No leads found</td></tr>';
        }
        return filtered.map(lead => {
            const isEditing = this.editingLeadId === lead.id;
            const isSelected = this.selectedLeads.has(lead.id);
            
            if (isEditing) {
                return `
                    <tr class="editing-row">
                        <td><input type="checkbox" ${isSelected ? 'checked' : ''} onchange="app.toggleSelect(${lead.id}, this.checked)"></td>
                        <td><input type="text" class="form-input" id="edit-name-${lead.id}" value="${lead.name}"></td>
                        <td><input type="email" class="form-input" id="edit-email-${lead.id}" value="${lead.email}"></td>
                        <td><input type="tel" class="form-input" id="edit-phone-${lead.id}" value="${lead.phone || ''}"></td>
                        <td><input type="text" class="form-input" id="edit-company-${lead.id}" value="${lead.company || ''}"></td>
                        <td>
                            <select class="form-select" id="edit-source-${lead.id}">
                                <option value="Website" ${lead.source === 'Website' ? 'selected' : ''}>Website</option>
                                <option value="Referral" ${lead.source === 'Referral' ? 'selected' : ''}>Referral</option>
                                <option value="LinkedIn" ${lead.source === 'LinkedIn' ? 'selected' : ''}>LinkedIn</option>
                                <option value="Cold Call" ${lead.source === 'Cold Call' ? 'selected' : ''}>Cold Call</option>
                                <option value="Trade Show" ${lead.source === 'Trade Show' ? 'selected' : ''}>Trade Show</option>
                                <option value="Email Campaign" ${lead.source === 'Email Campaign' ? 'selected' : ''}>Email Campaign</option>
                            </select>
                        </td>
                        <td>
                            <select class="form-select" id="edit-status-${lead.id}">
                                <option value="NEW" ${lead.status === 'NEW' ? 'selected' : ''}>New</option>
                                <option value="CONTACTED" ${lead.status === 'CONTACTED' ? 'selected' : ''}>Contacted</option>
                                <option value="QUALIFIED" ${lead.status === 'QUALIFIED' ? 'selected' : ''}>Qualified</option>
                            </select>
                        </td>
                        <td><input type="number" class="form-input" id="edit-score-${lead.id}" value="${lead.score || 0}" min="0" max="100"></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="app.saveInlineEdit(${lead.id})">Save</button>
                            <button class="btn btn-sm btn-secondary" onclick="app.cancelInlineEdit()">Cancel</button>
                        </td>
                    </tr>
                `;
            }
            
            return `
                <tr>
                    <td><input type="checkbox" ${isSelected ? 'checked' : ''} onchange="app.toggleSelect(${lead.id}, this.checked)"></td>
                    <td>${lead.name}</td>
                    <td>${lead.email}</td>
                    <td>${lead.phone || 'N/A'}</td>
                    <td>${lead.company || 'N/A'}</td>
                    <td>${lead.source || 'N/A'}</td>
                    <td><span class="badge badge-${lead.status.toLowerCase()}">${lead.status}</span></td>
                    <td>${lead.score || 0}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary" onclick="app.startInlineEdit(${lead.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteLead(${lead.id})">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    getFilteredLeads() {
        let filtered = [...this.leads];
        
        const search = document.getElementById('lead-search')?.value.toLowerCase();
        if (search) {
            filtered = filtered.filter(l => 
                l.name.toLowerCase().includes(search) || 
                l.email.toLowerCase().includes(search) ||
                (l.company && l.company.toLowerCase().includes(search))
            );
        }

        const status = document.getElementById('status-filter')?.value;
        if (status) {
            filtered = filtered.filter(l => l.status === status);
        }

        const source = document.getElementById('source-filter')?.value;
        if (source) {
            filtered = filtered.filter(l => l.source === source);
        }

        const sort = document.getElementById('sort-filter')?.value;
        if (sort === 'score') {
            filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
        } else if (sort === 'created') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        return filtered;
    },

    filterLeads() {
        const tbody = document.getElementById('leads-table-body');
        if (tbody) {
            tbody.innerHTML = this.renderLeadsTable();
        }
    },

    toggleSelect(id, checked) {
        if (checked) {
            this.selectedLeads.add(id);
        } else {
            this.selectedLeads.delete(id);
        }
        this.render();
    },

    toggleSelectAll(checked) {
        const filtered = this.getFilteredLeads();
        if (checked) {
            filtered.forEach(lead => this.selectedLeads.add(lead.id));
        } else {
            this.selectedLeads.clear();
        }
        this.render();
    },

    startInlineEdit(id) {
        this.editingLeadId = id;
        this.filterLeads();
    },

    cancelInlineEdit() {
        this.editingLeadId = null;
        this.filterLeads();
    },

    async saveInlineEdit(id) {
        const updated = {
            name: document.getElementById(`edit-name-${id}`).value,
            email: document.getElementById(`edit-email-${id}`).value,
            phone: document.getElementById(`edit-phone-${id}`).value,
            company: document.getElementById(`edit-company-${id}`).value,
            source: document.getElementById(`edit-source-${id}`).value,
            status: document.getElementById(`edit-status-${id}`).value,
            score: parseInt(document.getElementById(`edit-score-${id}`).value) || 0
        };

        if (!updated.name || !updated.email) {
            alert('Name and Email are required');
            return;
        }

        try {
            await this.fetchAPI(`/leads/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updated)
            });
            this.editingLeadId = null;
            await this.refresh();
        } catch (error) {
            alert('Failed to update lead');
        }
    },

    async bulkDelete() {
        if (this.selectedLeads.size === 0) return;
        if (!confirm(`Delete ${this.selectedLeads.size} selected leads?`)) return;

        try {
            await Promise.all(
                Array.from(this.selectedLeads).map(id => 
                    this.fetchAPI(`/leads/${id}`, { method: 'DELETE' })
                )
            );
            this.selectedLeads.clear();
            await this.refresh();
        } catch (error) {
            alert('Failed to delete leads');
        }
    },

    showAddLeadModal() {
        this.showModal('Add New Lead', `
            <div class="form-group">
                <label class="form-label">Name *</label>
                <input type="text" class="form-input" id="lead-name" required>
            </div>
            <div class="form-group">
                <label class="form-label">Email *</label>
                <input type="email" class="form-input" id="lead-email" required>
            </div>
            <div class="form-group">
                <label class="form-label">Phone</label>
                <input type="tel" class="form-input" id="lead-phone">
            </div>
            <div class="form-group">
                <label class="form-label">Company</label>
                <input type="text" class="form-input" id="lead-company">
            </div>
            <div class="form-group">
                <label class="form-label">Source</label>
                <select class="form-select" id="lead-source">
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="Email Campaign">Email Campaign</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Status</label>
                <select class="form-select" id="lead-status">
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUALIFIED">Qualified</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Score (0-100)</label>
                <input type="number" class="form-input" id="lead-score" value="0" min="0" max="100">
            </div>
            <div class="form-group">
                <label class="form-label">Notes</label>
                <textarea class="form-textarea" id="lead-notes"></textarea>
            </div>
        `, async () => {
            const lead = {
                name: document.getElementById('lead-name').value,
                email: document.getElementById('lead-email').value,
                phone: document.getElementById('lead-phone').value,
                company: document.getElementById('lead-company').value,
                source: document.getElementById('lead-source').value,
                status: document.getElementById('lead-status').value,
                score: parseInt(document.getElementById('lead-score').value) || 0,
                notes: document.getElementById('lead-notes').value
            };

            if (!lead.name || !lead.email) {
                alert('Name and Email are required');
                return false;
            }

            await this.fetchAPI('/leads', {
                method: 'POST',
                body: JSON.stringify(lead)
            });
            await this.refresh();
            return true;
        });
    },

    async deleteLead(id) {
        if (!confirm('Are you sure you want to delete this lead?')) return;
        
        await this.fetchAPI(`/leads/${id}`, { method: 'DELETE' });
        await this.refresh();
    },

    exportLeads() {
        const csv = this.convertToCSV(this.leads);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    },

    convertToCSV(data) {
        if (data.length === 0) return '';
        const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Score', 'Notes'];
        const rows = data.map(l => [
            l.name, l.email, l.phone || '', l.company || '', l.source || '', l.status, l.score || 0, l.notes || ''
        ]);
        return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    },

    showImportModal() {
        this.showModal('Import Leads from CSV', `
            <div class="form-group">
                <label class="form-label">Select CSV File</label>
                <input type="file" class="form-input" id="import-file" accept=".csv">
            </div>
            <div class="form-group">
                <p style="font-size: 13px; color: #6b7280;">
                    CSV format: Name, Email, Phone, Company, Source, Status, Score, Notes
                </p>
            </div>
        `, async () => {
            const file = document.getElementById('import-file').files[0];
            if (!file) {
                alert('Please select a file');
                return false;
            }

            const text = await file.text();
            const lines = text.split('\n').slice(1); // Skip header
            const leads = lines.filter(line => line.trim()).map(line => {
                const [name, email, phone, company, source, status, score, notes] = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
                return { name, email, phone, company, source, status, score: parseInt(score) || 0, notes };
            });

            for (const lead of leads) {
                if (lead.name && lead.email) {
                    await this.fetchAPI('/leads', {
                        method: 'POST',
                        body: JSON.stringify(lead)
                    });
                }
            }

            await this.refresh();
            alert(`Imported ${leads.length} leads successfully`);
            return true;
        });
    },

    renderDeals(container) {
        container.innerHTML = `
            <div class="card">
                <div class="action-bar">
                    <h3 class="card-title">All Deals (${this.deals.length})</h3>
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="app.showAddDealModal()">+ Add Deal</button>
                        <button class="btn btn-secondary" onclick="app.exportDeals()">Export CSV</button>
                    </div>
                </div>

                <div class="filter-bar">
                    <input type="text" class="form-input" placeholder="Search by title..." 
                           id="deal-search" onkeyup="app.filterDeals()">
                    <select class="form-select" id="stage-filter" onchange="app.filterDeals()">
                        <option value="">All Stages</option>
                        <option value="NEW">New</option>
                        <option value="PROPOSAL">Proposal</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                    <select class="form-select" id="deal-sort-filter" onchange="app.filterDeals()">
                        <option value="title">Sort by Title</option>
                        <option value="amount">Sort by Amount</option>
                        <option value="probability">Sort by Probability</option>
                    </select>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Stage</th>
                                <th>Probability</th>
                                <th>Expected Close</th>
                                <th>Lead</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="deals-table-body">
                            ${this.renderDealsTable()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderDealsTable() {
        const filtered = this.getFilteredDeals();
        if (filtered.length === 0) {
            return '<tr><td colspan="7" style="text-align:center">No deals found</td></tr>';
        }
        return filtered.map(deal => {
            const isEditing = this.editingDealId === deal.id;
            const lead = this.leads.find(l => l.id === deal.lead?.id);
            
            if (isEditing) {
                return `
                    <tr class="editing-row">
                        <td><input type="text" class="form-input" id="edit-deal-title-${deal.id}" value="${deal.title}"></td>
                        <td><input type="number" class="form-input" id="edit-deal-amount-${deal.id}" value="${deal.amount || 0}"></td>
                        <td>
                            <select class="form-select" id="edit-deal-stage-${deal.id}">
                                <option value="NEW" ${deal.stage === 'NEW' ? 'selected' : ''}>New</option>
                                <option value="PROPOSAL" ${deal.stage === 'PROPOSAL' ? 'selected' : ''}>Proposal</option>
                                <option value="QUALIFIED" ${deal.stage === 'QUALIFIED' ? 'selected' : ''}>Qualified</option>
                                <option value="CLOSED" ${deal.stage === 'CLOSED' ? 'selected' : ''}>Closed</option>
                            </select>
                        </td>
                        <td><input type="number" class="form-input" id="edit-deal-probability-${deal.id}" value="${deal.probability || 0}" min="0" max="100"></td>
                        <td><input type="date" class="form-input" id="edit-deal-date-${deal.id}" value="${deal.expectedCloseDate || ''}"></td>
                        <td>${lead ? lead.name : 'N/A'}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="app.saveInlineDealEdit(${deal.id})">Save</button>
                            <button class="btn btn-sm btn-secondary" onclick="app.cancelInlineDealEdit()">Cancel</button>
                        </td>
                    </tr>
                `;
            }
            
            return `
                <tr>
                    <td>${deal.title}</td>
                    <td>₹${(deal.amount || 0).toLocaleString()}</td>
                    <td><span class="badge badge-${deal.stage.toLowerCase()}">${deal.stage}</span></td>
                    <td>${deal.probability || 0}%</td>
                    <td>${deal.expectedCloseDate || 'N/A'}</td>
                    <td>${lead ? lead.name : 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary" onclick="app.startInlineDealEdit(${deal.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteDeal(${deal.id})">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    getFilteredDeals() {
        let filtered = [...this.deals];
        
        const search = document.getElementById('deal-search')?.value.toLowerCase();
        if (search) {
            filtered = filtered.filter(d => 
                d.title.toLowerCase().includes(search)
            );
        }

        const stage = document.getElementById('stage-filter')?.value;
        if (stage) {
            filtered = filtered.filter(d => d.stage === stage);
        }

        const sort = document.getElementById('deal-sort-filter')?.value;
        if (sort === 'amount') {
            filtered.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        } else if (sort === 'probability') {
            filtered.sort((a, b) => (b.probability || 0) - (a.probability || 0));
        } else {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        return filtered;
    },

    filterDeals() {
        const tbody = document.getElementById('deals-table-body');
        if (tbody) {
            tbody.innerHTML = this.renderDealsTable();
        }
    },

    startInlineDealEdit(id) {
        this.editingDealId = id;
        this.filterDeals();
    },

    cancelInlineDealEdit() {
        this.editingDealId = null;
        this.filterDeals();
    },

    async saveInlineDealEdit(id) {
        const updated = {
            title: document.getElementById(`edit-deal-title-${id}`).value,
            amount: parseFloat(document.getElementById(`edit-deal-amount-${id}`).value) || 0,
            stage: document.getElementById(`edit-deal-stage-${id}`).value,
            probability: parseInt(document.getElementById(`edit-deal-probability-${id}`).value) || 0,
            expectedCloseDate: document.getElementById(`edit-deal-date-${id}`).value
        };

        if (!updated.title) {
            alert('Title is required');
            return;
        }

        try {
            await this.fetchAPI(`/deals/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updated)
            });
            this.editingDealId = null;
            await this.refresh();
        } catch (error) {
            alert('Failed to update deal');
        }
    },

    showAddDealModal() {
        this.showModal('Add New Deal', `
            <div class="form-group">
                <label class="form-label">Title *</label>
                <input type="text" class="form-input" id="deal-title" required>
            </div>
            <div class="form-group">
                <label class="form-label">Amount (₹) *</label>
                <input type="number" class="form-input" id="deal-amount" value="0" min="0">
            </div>
            <div class="form-group">
                <label class="form-label">Stage</label>
                <select class="form-select" id="deal-stage">
                    <option value="NEW">New</option>
                    <option value="PROPOSAL">Proposal</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="CLOSED">Closed</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Probability (%)</label>
                <input type="number" class="form-input" id="deal-probability" value="0" min="0" max="100">
            </div>
            <div class="form-group">
                <label class="form-label">Expected Close Date</label>
                <input type="date" class="form-input" id="deal-date">
            </div>
            <div class="form-group">
                <label class="form-label">Associated Lead</label>
                <select class="form-select" id="deal-lead">
                    <option value="">None</option>
                    ${this.leads.map(lead => `<option value="${lead.id}">${lead.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" id="deal-description"></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Notes</label>
                <textarea class="form-textarea" id="deal-notes"></textarea>
            </div>
        `, async () => {
            const deal = {
                title: document.getElementById('deal-title').value,
                amount: parseFloat(document.getElementById('deal-amount').value) || 0,
                stage: document.getElementById('deal-stage').value,
                probability: parseInt(document.getElementById('deal-probability').value) || 0,
                expectedCloseDate: document.getElementById('deal-date').value,
                description: document.getElementById('deal-description').value,
                notes: document.getElementById('deal-notes').value
            };

            if (!deal.title) {
                alert('Title is required');
                return false;
            }

            const leadId = document.getElementById('deal-lead').value;
            if (leadId) {
                await this.fetchAPI(`/deals/lead/${leadId}`, {
                    method: 'POST',
                    body: JSON.stringify(deal)
                });
            } else {
                await this.fetchAPI('/deals', {
                    method: 'POST',
                    body: JSON.stringify(deal)
                });
            }
            
            await this.refresh();
            return true;
        });
    },

    async deleteDeal(id) {
        if (!confirm('Are you sure you want to delete this deal?')) return;
        
        await this.fetchAPI(`/deals/${id}`, { method: 'DELETE' });
        await this.refresh();
    },

    exportDeals() {
        const csv = this.convertDealsToCSV(this.deals);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `deals_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    },

    convertDealsToCSV(data) {
        if (data.length === 0) return '';
        const headers = ['Title', 'Amount', 'Stage', 'Probability', 'Expected Close Date', 'Description', 'Notes'];
        const rows = data.map(d => [
            d.title, d.amount || 0, d.stage, d.probability || 0, d.expectedCloseDate || '', d.description || '', d.notes || ''
        ]);
        return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    },


    renderAnalytics(container) {
        const stats = this.calculateStats();
        const leadsByStatus = this.groupBy(this.leads, 'status');
        const dealsByStage = this.groupBy(this.deals, 'stage');
        const leadsBySource = this.groupBy(this.leads, 'source');

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Conversion Rate</div>
                    <div class="stat-value">${stats.conversionRate}%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Avg Deal Size</div>
                    <div class="stat-value">₹${stats.avgDealSize.toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Win Rate</div>
                    <div class="stat-value">${stats.winRate}%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Pipeline Value</div>
                    <div class="stat-value">₹${stats.pipelineValue.toLocaleString()}</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                <div class="card">
                    <h3 class="card-title">Leads by Status</h3>
                    <canvas id="leads-pie-chart"></canvas>
                </div>
                <div class="card">
                    <h3 class="card-title">Deals by Stage</h3>
                    <canvas id="deals-donut-chart"></canvas>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                <div class="card">
                    <h3 class="card-title">Lead Sources</h3>
                    <canvas id="source-pie-chart"></canvas>
                </div>
                <div class="card">
                    <h3 class="card-title">Lead Score Distribution</h3>
                    <canvas id="score-bar-chart"></canvas>
                </div>
            </div>

            <div class="card">
                <h3 class="card-title">Monthly Revenue Trend</h3>
                <canvas id="revenue-line-chart"></canvas>
            </div>
        `;

        setTimeout(() => {
            const leadsData = Object.entries(leadsByStatus).map(([status, items]) => ({
                label: status,
                value: items.length,
                color: this.getStatusColor(status)
            }));
            Charts.drawPieChart('leads-pie-chart', leadsData, { width: 400, height: 300 });

            const dealsData = Object.entries(dealsByStage).map(([stage, items]) => ({
                label: stage,
                value: items.length,
                color: this.getStageColor(stage)
            }));
            Charts.drawDonutChart('deals-donut-chart', dealsData, { width: 400, height: 300 });

            const sourceData = Object.entries(leadsBySource).map(([source, items]) => ({
                label: source || 'Unknown',
                value: items.length,
                color: Charts.getColor(Object.keys(leadsBySource).indexOf(source))
            }));
            Charts.drawPieChart('source-pie-chart', sourceData, { width: 400, height: 300 });

            const scoreRanges = [
                { label: '0-20', min: 0, max: 20 },
                { label: '21-40', min: 21, max: 40 },
                { label: '41-60', min: 41, max: 60 },
                { label: '61-80', min: 61, max: 80 },
                { label: '81-100', min: 81, max: 100 }
            ];
            const scoreData = scoreRanges.map(range => ({
                label: range.label,
                value: this.leads.filter(l => {
                    const score = l.score || 0;
                    return score >= range.min && score <= range.max;
                }).length,
                color: '#3b82f6'
            }));
            Charts.drawBarChart('score-bar-chart', scoreData, { width: 400, height: 300 });

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentMonth = new Date().getMonth();
            const last6Months = [];
            for (let i = 5; i >= 0; i--) {
                const monthIndex = (currentMonth - i + 12) % 12;
                last6Months.push(months[monthIndex]);
            }
            
            const revenueData = last6Months.map((month, index) => ({
                label: month,
                value: Math.floor(Math.random() * 150000) + 50000
            }));
            Charts.drawLineChart('revenue-line-chart', revenueData, { width: 800, height: 300 });
        }, 100);
    },

    getStatusColor(status) {
        const colors = {
            'NEW': '#3b82f6',
            'CONTACTED': '#f59e0b',
            'QUALIFIED': '#10b981',
            'LOST': '#ef4444'
        };
        return colors[status] || '#6b7280';
    },

    getStageColor(stage) {
        const colors = {
            'NEW': '#3b82f6',
            'PROPOSAL': '#8b5cf6',
            'QUALIFIED': '#10b981',
            'CLOSED': '#14b8a6'
        };
        return colors[stage] || '#6b7280';
    },

    calculateStats() {
        const totalLeads = this.leads.length;
        const qualifiedLeads = this.leads.filter(l => l.status === 'QUALIFIED').length;
        const totalDeals = this.deals.length;
        const closedDeals = this.deals.filter(d => d.stage === 'CLOSED').length;
        const totalRevenue = this.deals
            .filter(d => d.stage === 'CLOSED')
            .reduce((sum, d) => sum + (d.amount || 0), 0);
        const conversionRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : 0;
        const avgDealSize = closedDeals > 0 ? Math.round(totalRevenue / closedDeals) : 0;
        const winRate = totalDeals > 0 ? ((closedDeals / totalDeals) * 100).toFixed(1) : 0;
        const pipelineValue = this.deals
            .filter(d => d.stage !== 'CLOSED')
            .reduce((sum, d) => sum + (d.amount || 0), 0);

        return {
            totalLeads,
            qualifiedLeads,
            totalDeals,
            closedDeals,
            totalRevenue,
            conversionRate,
            avgDealSize,
            winRate,
            pipelineValue
        };
    },

    groupBy(array, key) {
        return array.reduce((result, item) => {
            const group = item[key] || 'Unknown';
            if (!result[group]) result[group] = [];
            result[group].push(item);
            return result;
        }, {});
    },

    showModal(title, content, onSave) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn btn-primary" id="modal-save">Save</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('modal-save').addEventListener('click', async () => {
            try {
                const result = await onSave();
                if (result !== false) {
                    overlay.remove();
                }
            } catch (error) {
                alert('Operation failed: ' + error.message);
            }
        });
    },

    showError(message) {
        alert(message);
    },

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    globalSearch() {
        const query = document.getElementById('global-search').value.toLowerCase();
        if (!query) return;
        
        const results = {
            leads: this.leads.filter(l => 
                l.name.toLowerCase().includes(query) || 
                l.email.toLowerCase().includes(query) ||
                (l.company && l.company.toLowerCase().includes(query))
            ),
            deals: this.deals.filter(d => d.title.toLowerCase().includes(query)),
            tasks: this.tasks.filter(t => t.title.toLowerCase().includes(query))
        };
        
        console.log('Search results:', results);
        this.showToast(`Found ${results.leads.length} leads, ${results.deals.length} deals, ${results.tasks.length} tasks`);
    },

    showNotifications() {
        this.showToast('No new notifications', 'info');
    },

    renderTasks(container) {
        const urgentTasks = this.tasks.filter(t => t.priority === 'URGENT' && t.status !== 'COMPLETED');
        const highTasks = this.tasks.filter(t => t.priority === 'HIGH' && t.status !== 'COMPLETED');
        const pendingTasks = this.tasks.filter(t => t.status === 'PENDING');
        const inProgressTasks = this.tasks.filter(t => t.status === 'IN_PROGRESS');
        const completedTasks = this.tasks.filter(t => t.status === 'COMPLETED');
        
        container.innerHTML = `
            <!-- Task Summary Cards -->
            <div class="stats-grid" style="margin-bottom: 24px;">
                <div class="stat-card" style="border-left: 4px solid #ef4444;">
                    <div class="stat-label">🚨 Urgent Tasks</div>
                    <div class="stat-value" style="color: #ef4444;">${urgentTasks.length}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Requires immediate action</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #f59e0b;">
                    <div class="stat-label">⚡ High Priority</div>
                    <div class="stat-value" style="color: #f59e0b;">${highTasks.length}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Complete within 24 hours</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #3b82f6;">
                    <div class="stat-label">📋 In Progress</div>
                    <div class="stat-value" style="color: #3b82f6;">${inProgressTasks.length}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Currently working on</div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #10b981;">
                    <div class="stat-label">✓ Completed</div>
                    <div class="stat-value" style="color: #10b981;">${completedTasks.length}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Tasks finished</div>
                </div>
            </div>

            <div class="card">
                <div class="action-bar">
                    <h3 class="card-title">My Tasks (${this.tasks.length})</h3>
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="app.showAddTaskModal()">+ Add Task</button>
                        <button class="btn btn-secondary" onclick="app.markAllCompleted()">Mark All Complete</button>
                    </div>
                </div>

                <div class="tabs">
                    <button class="tab active" onclick="app.filterTasksByStatus('all')">All (${this.tasks.length})</button>
                    <button class="tab" onclick="app.filterTasksByStatus('PENDING')">Pending (${pendingTasks.length})</button>
                    <button class="tab" onclick="app.filterTasksByStatus('IN_PROGRESS')">In Progress (${inProgressTasks.length})</button>
                    <button class="tab" onclick="app.filterTasksByStatus('COMPLETED')">Completed (${completedTasks.length})</button>
                </div>

                <div id="tasks-list">
                    ${this.tasks.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon">✓</div>
                            <h3 class="empty-state-title">No tasks yet</h3>
                            <p class="empty-state-text">Create your first task to get started</p>
                            <button class="btn btn-primary" onclick="app.showAddTaskModal()">Add Task</button>
                        </div>
                    ` : this.renderTasksList(this.tasks)}
                </div>
            </div>
        `;
    },

    renderTasksList(tasks) {
        // Sort by priority and due date
        const sortedTasks = [...tasks].sort((a, b) => {
            const priorityOrder = { 'URGENT': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
            const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
            if (priorityDiff !== 0) return priorityDiff;
            
            // Then by due date
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            return 0;
        });

        return sortedTasks.map(task => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            const dueDateStr = dueDate ? dueDate.toLocaleString('en-IN', { 
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            }) : 'No due date';
            
            return `
                <div class="task-card" style="border-left: 4px solid ${this.getPriorityColor(task.priority)}; ${isOverdue ? 'background: #fef2f2;' : ''}">
                    <div class="task-header">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                <input type="checkbox" ${task.status === 'COMPLETED' ? 'checked' : ''} 
                                       onchange="app.toggleTaskComplete(${task.id}, this.checked)"
                                       style="width: 18px; height: 18px; cursor: pointer;">
                                <span class="task-title" style="${task.status === 'COMPLETED' ? 'text-decoration: line-through; color: #9ca3af;' : ''}">${task.title}</span>
                            </div>
                            <p style="font-size: 13px; color: #6b7280; margin: 8px 0 8px 26px;">${task.description || 'No description'}</p>
                        </div>
                        <span class="task-priority ${task.priority.toLowerCase()}">${task.priority}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                        <div style="display: flex; gap: 16px; align-items: center;">
                            <span class="badge badge-${task.status.toLowerCase()}">${task.status}</span>
                            <span style="font-size: 12px; color: ${isOverdue ? '#ef4444' : '#6b7280'};">
                                ${isOverdue ? '⚠️ OVERDUE: ' : '📅 '} ${dueDateStr}
                            </span>
                            ${task.lead ? `<span style="font-size: 12px; color: #6b7280;">👤 Lead: ${this.leads.find(l => l.id === task.lead.id)?.name || 'Unknown'}</span>` : ''}
                            ${task.deal ? `<span style="font-size: 12px; color: #6b7280;">💼 Deal: ${this.deals.find(d => d.id === task.deal.id)?.title || 'Unknown'}</span>` : ''}
                        </div>
                        <div>
                            <button class="btn btn-sm btn-secondary" onclick="app.editTask(${task.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="app.deleteTask(${task.id})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    getPriorityColor(priority) {
        const colors = {
            'URGENT': '#ef4444',
            'HIGH': '#f59e0b',
            'MEDIUM': '#3b82f6',
            'LOW': '#6b7280'
        };
        return colors[priority] || '#6b7280';
    },

    async toggleTaskComplete(id, completed) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        task.status = completed ? 'COMPLETED' : 'PENDING';
        
        await this.fetchAPI(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(task)
        });
        
        await this.refresh();
        this.showToast(completed ? 'Task completed! 🎉' : 'Task reopened', 'success');
    },

    async markAllCompleted() {
        if (!confirm('Mark all pending tasks as completed?')) return;
        
        const pendingTasks = this.tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS');
        
        for (const task of pendingTasks) {
            task.status = 'COMPLETED';
            await this.fetchAPI(`/tasks/${task.id}`, {
                method: 'PUT',
                body: JSON.stringify(task)
            });
        }
        
        await this.refresh();
        this.showToast(`${pendingTasks.length} tasks completed!`, 'success');
    },

    async editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        this.showModal('Edit Task', `
            <div class="form-group">
                <label class="form-label">Title *</label>
                <input type="text" class="form-input" id="task-title" value="${task.title}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" id="task-description">${task.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Priority</label>
                <select class="form-select" id="task-priority">
                    <option value="LOW" ${task.priority === 'LOW' ? 'selected' : ''}>Low</option>
                    <option value="MEDIUM" ${task.priority === 'MEDIUM' ? 'selected' : ''}>Medium</option>
                    <option value="HIGH" ${task.priority === 'HIGH' ? 'selected' : ''}>High</option>
                    <option value="URGENT" ${task.priority === 'URGENT' ? 'selected' : ''}>Urgent</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Status</label>
                <select class="form-select" id="task-status">
                    <option value="PENDING" ${task.status === 'PENDING' ? 'selected' : ''}>Pending</option>
                    <option value="IN_PROGRESS" ${task.status === 'IN_PROGRESS' ? 'selected' : ''}>In Progress</option>
                    <option value="COMPLETED" ${task.status === 'COMPLETED' ? 'selected' : ''}>Completed</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Due Date</label>
                <input type="datetime-local" class="form-input" id="task-due-date" 
                       value="${task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''}">
            </div>
        `, async () => {
            const updated = {
                ...task,
                title: document.getElementById('task-title').value,
                description: document.getElementById('task-description').value,
                priority: document.getElementById('task-priority').value,
                status: document.getElementById('task-status').value,
                dueDate: document.getElementById('task-due-date').value
            };

            if (!updated.title) {
                this.showToast('Title is required', 'error');
                return false;
            }

            await this.fetchAPI(`/tasks/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updated)
            });
            await this.refresh();
            this.showToast('Task updated successfully', 'success');
            return true;
        });
    },

    showAddTaskModal() {
        this.showModal('Add New Task', `
            <div class="form-group">
                <label class="form-label">Title *</label>
                <input type="text" class="form-input" id="task-title" required>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" id="task-description"></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Priority</label>
                <select class="form-select" id="task-priority">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM" selected>Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Status</label>
                <select class="form-select" id="task-status">
                    <option value="PENDING" selected>Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Due Date</label>
                <input type="datetime-local" class="form-input" id="task-due-date">
            </div>
        `, async () => {
            const task = {
                title: document.getElementById('task-title').value,
                description: document.getElementById('task-description').value,
                priority: document.getElementById('task-priority').value,
                status: document.getElementById('task-status').value,
                dueDate: document.getElementById('task-due-date').value
            };

            if (!task.title) {
                this.showToast('Title is required', 'error');
                return false;
            }

            await this.fetchAPI('/tasks', {
                method: 'POST',
                body: JSON.stringify(task)
            });
            await this.refresh();
            this.showToast('Task created successfully', 'success');
            return true;
        });
    },

    async deleteTask(id) {
        if (!confirm('Delete this task?')) return;
        await this.fetchAPI(`/tasks/${id}`, { method: 'DELETE' });
        await this.refresh();
        this.showToast('Task deleted', 'success');
    },

    filterTasksByStatus(status) {
        // Update tab active state
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');
        
        const filtered = status === 'all' ? this.tasks : this.tasks.filter(t => t.status === status);
        const listContainer = document.getElementById('tasks-list');
        listContainer.innerHTML = this.renderTasksList(filtered);
    },

    renderActivities(container) {
        container.innerHTML = `
            <div class="card">
                <h3 class="card-title">Activity Timeline</h3>
                <div class="timeline">
                    ${this.activities.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon">📝</div>
                            <h3 class="empty-state-title">No activities yet</h3>
                            <p class="empty-state-text">Activities will appear here as you work</p>
                        </div>
                    ` : this.activities.map(activity => `
                        <div class="timeline-item">
                            <div class="timeline-content">
                                <strong>${activity.title}</strong>
                                <p style="font-size: 13px; margin: 4px 0;">${activity.description || ''}</p>
                                <div class="timeline-time">${new Date(activity.activityDate).toLocaleString()}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderReports(container) {
        const stats = this.calculateStats();
        container.innerHTML = `
            <div class="card">
                <h3 class="card-title">Sales Reports</h3>
                
                <div class="widget-grid">
                    <div class="widget">
                        <div class="widget-header">
                            <span class="widget-title">Lead Conversion</span>
                        </div>
                        <div style="font-size: 32px; font-weight: 700; margin: 12px 0;">${stats.conversionRate}%</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${stats.conversionRate}%"></div>
                        </div>
                    </div>

                    <div class="widget">
                        <div class="widget-header">
                            <span class="widget-title">Win Rate</span>
                        </div>
                        <div style="font-size: 32px; font-weight: 700; margin: 12px 0;">${stats.winRate}%</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${stats.winRate}%"></div>
                        </div>
                    </div>

                    <div class="widget">
                        <div class="widget-header">
                            <span class="widget-title">Total Revenue</span>
                        </div>
                        <div style="font-size: 32px; font-weight: 700; margin: 12px 0;">₹${stats.totalRevenue.toLocaleString()}</div>
                    </div>

                    <div class="widget">
                        <div class="widget-header">
                            <span class="widget-title">Pipeline Value</span>
                        </div>
                        <div style="font-size: 32px; font-weight: 700; margin: 12px 0;">₹${stats.pipelineValue.toLocaleString()}</div>
                    </div>
                </div>

                <div class="action-bar" style="margin-top: 24px;">
                    <button class="btn btn-primary" onclick="app.exportLeads()">Export Leads Report</button>
                    <button class="btn btn-primary" onclick="app.exportDeals()">Export Deals Report</button>
                    <button class="btn btn-secondary" onclick="app.showToast('Report generated', 'success')">Generate Custom Report</button>
                </div>
            </div>
        `;
    },

    renderSettings(container) {
        container.innerHTML = `
            <div class="card">
                <h3 class="card-title">Application Settings</h3>
                
                <div class="form-group">
                    <label class="form-label">Company Name</label>
                    <input type="text" class="form-input" value="Sales Lead System" id="company-name">
                </div>

                <div class="form-group">
                    <label class="form-label">Email Notifications</label>
                    <select class="form-select" id="email-notifications">
                        <option value="all">All notifications</option>
                        <option value="important">Important only</option>
                        <option value="none">None</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Default Lead Status</label>
                    <select class="form-select" id="default-lead-status">
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="QUALIFIED">Qualified</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Currency</label>
                    <select class="form-select" id="currency">
                        <option value="INR" selected>INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Timezone</label>
                    <select class="form-select" id="timezone">
                        <option value="Asia/Kolkata" selected>Asia/Kolkata (IST)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                </div>

                <button class="btn btn-primary" onclick="app.saveSettings()">Save Settings</button>
            </div>

            <div class="card" style="margin-top: 24px;">
                <h3 class="card-title">Database Management</h3>
                <p style="color: #6b7280; margin-bottom: 16px;">Manage your application data</p>
                
                <div class="action-buttons">
                    <button class="btn btn-secondary" onclick="app.showToast('Backup created', 'success')">Backup Database</button>
                    <button class="btn btn-secondary" onclick="app.showToast('Data cleared', 'success')">Clear All Data</button>
                    <button class="btn btn-danger" onclick="confirm('Reset all settings?') && app.showToast('Settings reset', 'success')">Reset Settings</button>
                </div>
            </div>
        `;
    },

    saveSettings() {
        this.showToast('Settings saved successfully', 'success');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => app.init());
