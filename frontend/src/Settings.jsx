import React, { useState, useEffect } from "react";
import { getUserSettings, updateUserSettings } from "./api";

export default function Settings() {
  const [settings, setSettings] = useState({
    // General Settings
    appName: "Sales Lead Management System",
    theme: "light",
    language: "en",
    timezone: "UTC",
    
    // Dashboard Settings
    defaultView: "dashboard",
    refreshInterval: 30,
    showNotifications: true,
    autoSave: true,
    
    // Lead Settings
    leadStatuses: ["NEW", "CONTACTED", "QUALIFIED"],
    defaultLeadStatus: "NEW",
    leadAutoAssign: false,
    leadNotifications: true,
    
    // Deal Settings
    dealStages: ["NEW", "PROPOSAL", "QUALIFIED", "CLOSED"],
    defaultDealStage: "NEW",
    dealAutoAssign: false,
    dealNotifications: true,
    
    // Email Settings
    emailEnabled: false,
    emailHost: "",
    emailPort: 587,
    emailUsername: "",
    emailPassword: "",
    emailFromName: "SalesPro",
    
    // Export Settings
    defaultExportFormat: "csv",
    includeHeaders: true,
    dateFormat: "MM/DD/YYYY",
    
    // Security Settings
    sessionTimeout: 60,
    requireStrongPassword: true,
    enableTwoFactor: false,
    
    // API Settings
    apiTimeout: 30,
    maxRetries: 3,
    enableLogging: true
  });

  const [activeTab, setActiveTab] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Load settings from API on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const apiSettings = await getUserSettings();
      
      // Parse JSON strings back to arrays
      const processedSettings = { ...settings };
      Object.keys(apiSettings).forEach(key => {
        let value = apiSettings[key];
        
        // Parse JSON strings for arrays
        if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // Keep as string if parsing fails
          }
        }
        
        processedSettings[key] = value;
      });
      
      setSettings(processedSettings);
    } catch (error) {
      console.error("Failed to load settings:", error);
      setSaveStatus("Failed to load settings from server.");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleArrayChange = (key, index, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: prev[key].map((item, i) => i === index ? value : item)
    }));
    setHasChanges(true);
  };

  const addArrayItem = (key, defaultValue = "") => {
    setSettings(prev => ({
      ...prev,
      [key]: [...prev[key], defaultValue]
    }));
    setHasChanges(true);
  };

  const removeArrayItem = (key, index) => {
    setSettings(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    try {
      setSaveStatus("Saving...");
      
      // Convert arrays to JSON strings for API
      const apiSettings = { ...settings };
      Object.keys(apiSettings).forEach(key => {
        if (Array.isArray(apiSettings[key])) {
          apiSettings[key] = JSON.stringify(apiSettings[key]);
        }
      });
      
      await updateUserSettings(apiSettings);
      setHasChanges(false);
      setSaveStatus("Settings saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveStatus("Failed to save settings. Please try again.");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const resetSettings = async () => {
    if (window.confirm("Are you sure you want to reset all settings to default values?")) {
      try {
        setSaveStatus("Resetting...");
        await loadSettings(); // Reload from server
        setHasChanges(false);
        setSaveStatus("Settings reset successfully!");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (error) {
        console.error("Failed to reset settings:", error);
        setSaveStatus("Failed to reset settings.");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    }
  };

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salespro-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setSettings(prev => ({ ...prev, ...imported }));
          setHasChanges(true);
          setSaveStatus("Settings imported successfully!");
          setTimeout(() => setSaveStatus(""), 3000);
        } catch (error) {
          setSaveStatus("Failed to import settings. Invalid file format.");
          setTimeout(() => setSaveStatus(""), 3000);
        }
      };
      reader.readAsText(file);
    }
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h3>🏠 General Settings</h3>
      
      <div className="setting-item">
        <label>Application Name:</label>
        <input
          type="text"
          value={settings.appName}
          onChange={(e) => handleSettingChange("appName", e.target.value)}
          placeholder="Enter application name"
        />
      </div>

      <div className="setting-item">
        <label>Theme:</label>
        <select
          value={settings.theme}
          onChange={(e) => handleSettingChange("theme", e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Language:</label>
        <select
          value={settings.language}
          onChange={(e) => handleSettingChange("language", e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Timezone:</label>
        <select
          value={settings.timezone}
          onChange={(e) => handleSettingChange("timezone", e.target.value)}
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Default View:</label>
        <select
          value={settings.defaultView}
          onChange={(e) => handleSettingChange("defaultView", e.target.value)}
        >
          <option value="dashboard">Dashboard</option>
          <option value="leads">Leads</option>
          <option value="deals">Deals</option>
          <option value="analytics">Analytics</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Auto-refresh Interval (seconds):</label>
        <input
          type="number"
          min="10"
          max="300"
          value={settings.refreshInterval}
          onChange={(e) => handleSettingChange("refreshInterval", parseInt(e.target.value))}
        />
      </div>

      <div className="setting-item checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.showNotifications}
            onChange={(e) => handleSettingChange("showNotifications", e.target.checked)}
          />
          Show Notifications
        </label>
      </div>

      <div className="setting-item checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.autoSave}
            onChange={(e) => handleSettingChange("autoSave", e.target.checked)}
          />
          Auto-save Changes
        </label>
      </div>
    </div>
  );

  const renderLeadSettings = () => (
    <div className="settings-section">
      <h3>👥 Lead Settings</h3>
      
      <div className="setting-item">
        <label>Lead Statuses:</label>
        <div className="array-setting">
          {settings.leadStatuses.map((status, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={status}
                onChange={(e) => handleArrayChange("leadStatuses", index, e.target.value)}
              />
              <button
                className="remove-btn"
                onClick={() => removeArrayItem("leadStatuses", index)}
                disabled={settings.leadStatuses.length <= 1}
              >
                ❌
              </button>
            </div>
          ))}
          <button
            className="add-btn"
            onClick={() => addArrayItem("leadStatuses", "NEW_STATUS")}
          >
            ➕ Add Status
          </button>
        </div>
      </div>

      <div className="setting-item">
        <label>Default Lead Status:</label>
        <select
          value={settings.defaultLeadStatus}
          onChange={(e) => handleSettingChange("defaultLeadStatus", e.target.value)}
        >
          {settings.leadStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="setting-item checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.leadAutoAssign}
            onChange={(e) => handleSettingChange("leadAutoAssign", e.target.checked)}
          />
          Auto-assign New Leads
        </label>
      </div>

      <div className="setting-item checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.leadNotifications}
            onChange={(e) => handleSettingChange("leadNotifications", e.target.checked)}
          />
          Lead Notifications
        </label>
      </div>
    </div>
  );

  const renderDealSettings = () => (
    <div className="settings-section">
      <h3>💼 Deal Settings</h3>
      
      <div className="setting-item">
        <label>Deal Stages:</label>
        <div className="array-setting">
          {settings.dealStages.map((stage, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={stage}
                onChange={(e) => handleArrayChange("dealStages", index, e.target.value)}
              />
              <button
                className="remove-btn"
                onClick={() => removeArrayItem("dealStages", index)}
                disabled={settings.dealStages.length <= 1}
              >
                ❌
              </button>
            </div>
          ))}
          <button
            className="add-btn"
            onClick={() => addArrayItem("dealStages", "NEW_STAGE")}
          >
            ➕ Add Stage
          </button>
        </div>
      </div>

      <div className="setting-item">
        <label>Default Deal Stage:</label>
        <select
          value={settings.defaultDealStage}
          onChange={(e) => handleSettingChange("defaultDealStage", e.target.value)}
        >
          {settings.dealStages.map(stage => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>
      </div>

      <div className="setting-item checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.dealAutoAssign}
            onChange={(e) => handleSettingChange("dealAutoAssign", e.target.checked)}
          />
          Auto-assign New Deals
        </label>
      </div>

      <div className="setting-item checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.dealNotifications}
            onChange={(e) => handleSettingChange("dealNotifications", e.target.checked)}
          />
          Deal Notifications
        </label>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="settings-section">
      <h3>📧 Email Settings</h3>
      
      <div className="setting-item checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.emailEnabled}
            onChange={(e) => handleSettingChange("emailEnabled", e.target.checked)}
          />
          Enable Email Notifications
        </label>
      </div>

      {settings.emailEnabled && (
        <>
          <div className="setting-item">
            <label>SMTP Host:</label>
            <input
              type="text"
              value={settings.emailHost}
              onChange={(e) => handleSettingChange("emailHost", e.target.value)}
              placeholder="smtp.gmail.com"
            />
          </div>

          <div className="setting-item">
            <label>SMTP Port:</label>
            <input
              type="number"
              value={settings.emailPort}
              onChange={(e) => handleSettingChange("emailPort", parseInt(e.target.value))}
            />
          </div>

          <div className="setting-item">
            <label>Username:</label>
            <input
              type="text"
              value={settings.emailUsername}
              onChange={(e) => handleSettingChange("emailUsername", e.target.value)}
              placeholder="your-email@gmail.com"
            />
          </div>

          <div className="setting-item">
            <label>Password:</label>
            <input
              type="password"
              value={settings.emailPassword}
              onChange={(e) => handleSettingChange("emailPassword", e.target.value)}
              placeholder="Your app password"
            />
          </div>

          <div className="setting-item">
            <label>From Name:</label>
            <input
              type="text"
              value={settings.emailFromName}
              onChange={(e) => handleSettingChange("emailFromName", e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h3>🔒 Security Settings</h3>
      
      <div className="setting-item">
        <label>Session Timeout (minutes):</label>
        <input
          type="number"
          min="5"
          max="480"
          value={settings.sessionTimeout}
          onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
        />
      </div>

      <div className="setting-item checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.requireStrongPassword}
            onChange={(e) => handleSettingChange("requireStrongPassword", e.target.checked)}
          />
          Require Strong Passwords
        </label>
      </div>

      <div className="setting-item checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.enableTwoFactor}
            onChange={(e) => handleSettingChange("enableTwoFactor", e.target.checked)}
          />
          Enable Two-Factor Authentication
        </label>
      </div>

      <div className="setting-item">
        <label>API Timeout (seconds):</label>
        <input
          type="number"
          min="5"
          max="120"
          value={settings.apiTimeout}
          onChange={(e) => handleSettingChange("apiTimeout", parseInt(e.target.value))}
        />
      </div>

      <div className="setting-item">
        <label>Max API Retries:</label>
        <input
          type="number"
          min="0"
          max="10"
          value={settings.maxRetries}
          onChange={(e) => handleSettingChange("maxRetries", parseInt(e.target.value))}
        />
      </div>

      <div className="setting-item checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.enableLogging}
            onChange={(e) => handleSettingChange("enableLogging", e.target.checked)}
          />
          Enable Debug Logging
        </label>
      </div>
    </div>
  );

  const tabs = [
    { id: "general", label: "General", icon: "🏠" },
    { id: "leads", label: "Leads", icon: "👥" },
    { id: "deals", label: "Deals", icon: "💼" },
    { id: "email", label: "Email", icon: "📧" },
    { id: "security", label: "Security", icon: "🔒" }
  ];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>⚙️ Settings & Configuration</h2>
        <div className="settings-actions">
          <input
            type="file"
            accept=".json"
            onChange={importSettings}
            style={{ display: 'none' }}
            id="import-settings"
          />
          <label htmlFor="import-settings" className="import-btn">
            📥 Import
          </label>
          <button className="export-btn" onClick={exportSettings}>
            📤 Export
          </button>
          <button className="reset-btn" onClick={resetSettings}>
            🔄 Reset
          </button>
          <button 
            className={`save-btn ${hasChanges ? 'has-changes' : ''}`}
            onClick={saveSettings}
            disabled={!hasChanges}
          >
            💾 Save Changes
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className={`save-status ${saveStatus.includes('success') ? 'success' : 'error'}`}>
          {saveStatus}
        </div>
      )}

      <div className="settings-content">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-panel">
          {activeTab === "general" && renderGeneralSettings()}
          {activeTab === "leads" && renderLeadSettings()}
          {activeTab === "deals" && renderDealSettings()}
          {activeTab === "email" && renderEmailSettings()}
          {activeTab === "security" && renderSecuritySettings()}
        </div>
      </div>

      {hasChanges && (
        <div className="unsaved-changes-warning">
          ⚠️ You have unsaved changes. Don't forget to save your settings!
        </div>
      )}
    </div>
  );
}