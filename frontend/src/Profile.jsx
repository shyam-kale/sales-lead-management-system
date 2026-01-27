import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "./api";

export default function Profile() {
  const [profile, setProfile] = useState({
    // Personal Information
    firstName: "John",
    lastName: "Doe",
    phone: "+1 (555) 123-4567",
    title: "Sales Manager",
    department: "Sales",
    location: "New York, NY",
    
    // Profile Settings
    avatarUrl: "",
    bio: "Experienced sales professional with 5+ years in lead management and customer acquisition.",
    
    // Preferences
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    marketingEmails: false,
    
    // Work Settings
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    timezone: "America/New_York",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    
    // Performance Metrics (Read-only)
    metrics: {
      leadsGenerated: 156,
      dealsClosedThisMonth: 12,
      totalRevenue: 245000,
      conversionRate: 18.5,
      avgDealSize: 20416
    },
    
    // Activity Stats
    lastLogin: new Date().toISOString(),
    totalLogins: 342
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(true);

  // Load profile from API on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const apiProfile = await getUserProfile();
      
      // Process the profile data
      const processedProfile = { ...profile };
      
      // Map API fields to component state
      if (apiProfile.firstName) processedProfile.firstName = apiProfile.firstName;
      if (apiProfile.lastName) processedProfile.lastName = apiProfile.lastName;
      if (apiProfile.phone) processedProfile.phone = apiProfile.phone;
      if (apiProfile.title) processedProfile.title = apiProfile.title;
      if (apiProfile.department) processedProfile.department = apiProfile.department;
      if (apiProfile.location) processedProfile.location = apiProfile.location;
      if (apiProfile.bio) processedProfile.bio = apiProfile.bio;
      if (apiProfile.avatarUrl) processedProfile.avatarUrl = apiProfile.avatarUrl;
      
      // Preferences
      if (apiProfile.emailNotifications !== undefined) processedProfile.emailNotifications = apiProfile.emailNotifications;
      if (apiProfile.pushNotifications !== undefined) processedProfile.pushNotifications = apiProfile.pushNotifications;
      if (apiProfile.weeklyReports !== undefined) processedProfile.weeklyReports = apiProfile.weeklyReports;
      if (apiProfile.marketingEmails !== undefined) processedProfile.marketingEmails = apiProfile.marketingEmails;
      
      // Working hours
      if (apiProfile.workingHoursStart) processedProfile.workingHoursStart = apiProfile.workingHoursStart;
      if (apiProfile.workingHoursEnd) processedProfile.workingHoursEnd = apiProfile.workingHoursEnd;
      if (apiProfile.timezone) processedProfile.timezone = apiProfile.timezone;
      
      // Parse working days if it's a JSON string
      if (apiProfile.workingDays) {
        try {
          processedProfile.workingDays = typeof apiProfile.workingDays === 'string' 
            ? JSON.parse(apiProfile.workingDays) 
            : apiProfile.workingDays;
        } catch (e) {
          console.error("Failed to parse working days:", e);
        }
      }
      
      // Activity stats
      if (apiProfile.lastLogin) processedProfile.lastLogin = apiProfile.lastLogin;
      if (apiProfile.totalLogins) processedProfile.totalLogins = apiProfile.totalLogins;
      
      // Get user email from the user object if available
      if (apiProfile.user && apiProfile.user.email) {
        processedProfile.email = apiProfile.user.email;
      }
      
      setProfile(processedProfile);
    } catch (error) {
      console.error("Failed to load profile:", error);
      setSaveStatus("Failed to load profile from server.");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (key, value) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [key]: value }));
    }
    setHasChanges(true);
  };

  const handleArrayChange = (key, value, checked) => {
    setProfile(prev => ({
      ...prev,
      [key]: checked 
        ? [...prev[key], value]
        : prev[key].filter(item => item !== value)
    }));
    setHasChanges(true);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        setAvatarPreview(result);
        handleProfileChange("avatarUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    try {
      setSaveStatus("Saving...");
      
      // Prepare profile data for API
      const apiProfile = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        title: profile.title,
        department: profile.department,
        location: profile.location,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        emailNotifications: profile.emailNotifications,
        pushNotifications: profile.pushNotifications,
        weeklyReports: profile.weeklyReports,
        marketingEmails: profile.marketingEmails,
        workingHoursStart: profile.workingHoursStart,
        workingHoursEnd: profile.workingHoursEnd,
        timezone: profile.timezone,
        workingDays: JSON.stringify(profile.workingDays)
      };
      
      await updateUserProfile(apiProfile);
      setHasChanges(false);
      setIsEditing(false);
      setSaveStatus("Profile updated successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setSaveStatus("Failed to save profile. Please try again.");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const cancelEdit = () => {
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        setIsEditing(false);
        setHasChanges(false);
        loadProfile(); // Reload from server
      }
    } else {
      setIsEditing(false);
    }
  };

  const exportProfile = () => {
    const exportData = {
      ...profile,
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profile-${profile.firstName}-${profile.lastName}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const renderPersonalInfo = () => (
    <div className="profile-section">
      <h3>👤 Personal Information</h3>
      
      <div className="avatar-section">
        <div className="avatar-container">
          {(avatarPreview || profile.avatar) ? (
            <img 
              src={avatarPreview || profile.avatar} 
              alt="Profile Avatar" 
              className="profile-avatar"
            />
          ) : (
            <div className="avatar-placeholder">
              {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
            </div>
          )}
        </div>
        {isEditing && (
          <div className="avatar-controls">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              id="avatar-upload"
              style={{ display: 'none' }}
            />
            <label htmlFor="avatar-upload" className="avatar-btn">
              📷 Change Photo
            </label>
          </div>
        )}
      </div>

      <div className="profile-fields">
        <div className="field-row">
          <div className="field-group">
            <label>First Name:</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => handleProfileChange("firstName", e.target.value)}
              />
            ) : (
              <span className="field-value">{profile.firstName}</span>
            )}
          </div>
          
          <div className="field-group">
            <label>Last Name:</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => handleProfileChange("lastName", e.target.value)}
              />
            ) : (
              <span className="field-value">{profile.lastName}</span>
            )}
          </div>
        </div>

        <div className="field-group">
          <label>Email:</label>
          {isEditing ? (
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
            />
          ) : (
            <span className="field-value">{profile.email}</span>
          )}
        </div>

        <div className="field-group">
          <label>Phone:</label>
          {isEditing ? (
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleProfileChange("phone", e.target.value)}
            />
          ) : (
            <span className="field-value">{profile.phone}</span>
          )}
        </div>

        <div className="field-row">
          <div className="field-group">
            <label>Job Title:</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.title}
                onChange={(e) => handleProfileChange("title", e.target.value)}
              />
            ) : (
              <span className="field-value">{profile.title}</span>
            )}
          </div>
          
          <div className="field-group">
            <label>Department:</label>
            {isEditing ? (
              <select
                value={profile.department}
                onChange={(e) => handleProfileChange("department", e.target.value)}
              >
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Customer Success">Customer Success</option>
                <option value="Management">Management</option>
              </select>
            ) : (
              <span className="field-value">{profile.department}</span>
            )}
          </div>
        </div>

        <div className="field-group">
          <label>Location:</label>
          {isEditing ? (
            <input
              type="text"
              value={profile.location}
              onChange={(e) => handleProfileChange("location", e.target.value)}
            />
          ) : (
            <span className="field-value">{profile.location}</span>
          )}
        </div>

        <div className="field-group">
          <label>Bio:</label>
          {isEditing ? (
            <textarea
              value={profile.bio}
              onChange={(e) => handleProfileChange("bio", e.target.value)}
              rows="3"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <span className="field-value bio">{profile.bio}</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="profile-section">
      <h3>🔔 Notification Preferences</h3>
      
      <div className="preferences-grid">
        <div className="preference-item">
          <label>
            <input
              type="checkbox"
              checked={profile.emailNotifications}
              onChange={(e) => handleProfileChange("emailNotifications", e.target.checked)}
              disabled={!isEditing}
            />
            <span className="preference-label">Email Notifications</span>
          </label>
          <p className="preference-desc">Receive email alerts for important updates</p>
        </div>

        <div className="preference-item">
          <label>
            <input
              type="checkbox"
              checked={profile.pushNotifications}
              onChange={(e) => handleProfileChange("pushNotifications", e.target.checked)}
              disabled={!isEditing}
            />
            <span className="preference-label">Push Notifications</span>
          </label>
          <p className="preference-desc">Get instant browser notifications</p>
        </div>

        <div className="preference-item">
          <label>
            <input
              type="checkbox"
              checked={profile.weeklyReports}
              onChange={(e) => handleProfileChange("weeklyReports", e.target.checked)}
              disabled={!isEditing}
            />
            <span className="preference-label">Weekly Reports</span>
          </label>
          <p className="preference-desc">Receive weekly performance summaries</p>
        </div>

        <div className="preference-item">
          <label>
            <input
              type="checkbox"
              checked={profile.marketingEmails}
              onChange={(e) => handleProfileChange("marketingEmails", e.target.checked)}
              disabled={!isEditing}
            />
            <span className="preference-label">Marketing Emails</span>
          </label>
          <p className="preference-desc">Get updates about new features and tips</p>
        </div>
      </div>

      <h3>⏰ Working Hours</h3>
      <div className="working-hours">
        <div className="field-row">
          <div className="field-group">
            <label>Start Time:</label>
            {isEditing ? (
              <input
                type="time"
                value={profile.workingHours.start}
                onChange={(e) => handleProfileChange("workingHours.start", e.target.value)}
              />
            ) : (
              <span className="field-value">{profile.workingHours.start}</span>
            )}
          </div>
          
          <div className="field-group">
            <label>End Time:</label>
            {isEditing ? (
              <input
                type="time"
                value={profile.workingHours.end}
                onChange={(e) => handleProfileChange("workingHours.end", e.target.value)}
              />
            ) : (
              <span className="field-value">{profile.workingHours.end}</span>
            )}
          </div>
        </div>

        <div className="field-group">
          <label>Timezone:</label>
          {isEditing ? (
            <select
              value={profile.workingHours.timezone}
              onChange={(e) => handleProfileChange("workingHours.timezone", e.target.value)}
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="UTC">UTC</option>
            </select>
          ) : (
            <span className="field-value">{profile.workingHours.timezone}</span>
          )}
        </div>

        <div className="field-group">
          <label>Working Days:</label>
          <div className="working-days">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
              <label key={day} className="day-checkbox">
                <input
                  type="checkbox"
                  checked={profile.workingDays.includes(day)}
                  onChange={(e) => handleArrayChange("workingDays", day, e.target.checked)}
                  disabled={!isEditing}
                />
                <span>{day.slice(0, 3)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="profile-section">
      <h3>📊 Performance Metrics</h3>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h4>Leads Generated</h4>
            <div className="metric-value">{profile.metrics.leadsGenerated}</div>
            <div className="metric-period">This quarter</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💼</div>
          <div className="metric-info">
            <h4>Deals Closed</h4>
            <div className="metric-value">{profile.metrics.dealsClosedThisMonth}</div>
            <div className="metric-period">This month</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <h4>Total Revenue</h4>
            <div className="metric-value">${profile.metrics.totalRevenue.toLocaleString()}</div>
            <div className="metric-period">Year to date</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-info">
            <h4>Conversion Rate</h4>
            <div className="metric-value">{profile.metrics.conversionRate}%</div>
            <div className="metric-period">Average</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💵</div>
          <div className="metric-info">
            <h4>Avg Deal Size</h4>
            <div className="metric-value">${profile.metrics.avgDealSize.toLocaleString()}</div>
            <div className="metric-period">Last 30 days</div>
          </div>
        </div>
      </div>

      <h3>📈 Activity Summary</h3>
      <div className="activity-summary">
        <div className="activity-item">
          <span className="activity-label">Account Created:</span>
          <span className="activity-value">{new Date(profile.accountCreated).toLocaleDateString()}</span>
        </div>
        <div className="activity-item">
          <span className="activity-label">Last Login:</span>
          <span className="activity-value">{new Date(profile.lastLogin).toLocaleString()}</span>
        </div>
        <div className="activity-item">
          <span className="activity-label">Total Logins:</span>
          <span className="activity-value">{profile.totalLogins}</span>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "preferences", label: "Preferences", icon: "🔔" },
    { id: "performance", label: "Performance", icon: "📊" }
  ];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-title">
          <h2>👤 User Profile</h2>
          <div className="profile-name">
            {profile.firstName} {profile.lastName} - {profile.title}
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="export-btn" onClick={exportProfile}>
            📤 Export Profile
          </button>
          
          {!isEditing ? (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="cancel-btn" onClick={cancelEdit}>
                ❌ Cancel
              </button>
              <button 
                className={`save-btn ${hasChanges ? 'has-changes' : ''}`}
                onClick={saveProfile}
                disabled={!hasChanges}
              >
                💾 Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {saveStatus && (
        <div className={`save-status ${saveStatus.includes('success') ? 'success' : 'error'}`}>
          {saveStatus}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="profile-panel">
          {activeTab === "personal" && renderPersonalInfo()}
          {activeTab === "preferences" && renderPreferences()}
          {activeTab === "performance" && renderPerformance()}
        </div>
      </div>

      {isEditing && hasChanges && (
        <div className="unsaved-changes-warning">
          ⚠️ You have unsaved changes. Don't forget to save your profile!
        </div>
      )}
    </div>
  );
}