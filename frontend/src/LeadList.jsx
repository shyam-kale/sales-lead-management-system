import React from "react";
import { useEffect, useMemo, useState } from "react";
import { createLead, deleteLead, updateLead } from "./api";

export default function LeadList({ leads, refresh }) {
  const [localLeads, setLocalLeads] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "NEW",
  });

  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    status: "NEW",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalLeads(leads || []);
  }, [leads]);

  const stats = useMemo(() => {
    return {
      total: localLeads.length,
      new: localLeads.filter(l => l.status === "NEW").length,
      contacted: localLeads.filter(l => l.status === "CONTACTED").length,
      qualified: localLeads.filter(l => l.status === "QUALIFIED").length,
    };
  }, [localLeads]);

  const validate = data => {
    if (!data.name.trim()) return "Name required";
    if (!data.email.includes("@")) return "Invalid email";
    return "";
  };

  const startEdit = lead => {
    setEditingId(lead.id);
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      status: lead.status,
    });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      status: "NEW",
    });
  };

  const saveEdit = async id => {
    const err = validate(form);
    if (err) {
      setError(err);
      return;
    }

    try {
      setLoading(true);
      await updateLead(id, form);
      setEditingId(null);
      refresh();
    } catch {
      setError("Failed to update lead");
    } finally {
      setLoading(false);
    }
  };

  const addLead = async () => {
    const err = validate(newLead);
    if (err) {
      setError(err);
      return;
    }

    try {
      setLoading(true);
      await createLead(newLead);
      setNewLead({ name: "", email: "", phone: "", status: "NEW" });
      refresh();
    } catch {
      setError("Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  const removeLead = async id => {
    if (!window.confirm("Delete this lead?")) return;
    await deleteLead(id);
    refresh();
  };

  return (
    <div className="card">
      <h2>Lead Management</h2>

      <div className="lead-stats">
        <span>Total: {stats.total}</span>
        <span>New: {stats.new}</span>
        <span>Contacted: {stats.contacted}</span>
        <span>Qualified: {stats.qualified}</span>
      </div>

      <div className="lead-form">
        <input
          placeholder="Name"
          value={newLead.name}
          onChange={e =>
            setNewLead({ ...newLead, name: e.target.value })
          }
        />
        <input
          placeholder="Email"
          value={newLead.email}
          onChange={e =>
            setNewLead({ ...newLead, email: e.target.value })
          }
        />
        <input
          placeholder="Phone"
          value={newLead.phone}
          onChange={e =>
            setNewLead({ ...newLead, phone: e.target.value })
          }
        />
        <select
          value={newLead.status}
          onChange={e =>
            setNewLead({ ...newLead, status: e.target.value })
          }
        >
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="QUALIFIED">QUALIFIED</option>
        </select>
        <button onClick={addLead} disabled={loading}>
          Add Lead
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="lead-list">
        {localLeads.map(lead => (
          <div key={lead.id} className="lead-row">
            {editingId === lead.id ? (
              <>
                <div className="lead-info">
                  <input
                    value={form.name}
                    onChange={e =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                  <input
                    value={form.email}
                    onChange={e =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  <input
                    value={form.phone}
                    onChange={e =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>

                <div className="lead-meta">
                  <select
                    value={form.status}
                    onChange={e =>
                      setForm({
                        ...form,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                  </select>

                  <button onClick={() => saveEdit(lead.id)}>
                    Save
                  </button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="lead-info">
                  <strong>{lead.name}</strong>
                  <span>{lead.email}</span>
                  <span>{lead.phone || "N/A"}</span>
                </div>

                <div className="lead-meta">
                  <span className={`status ${lead.status}`}>
                    {lead.status}
                  </span>
                  <button onClick={() => startEdit(lead)}>
                    Edit
                  </button>
                  <button onClick={() => removeLead(lead.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
