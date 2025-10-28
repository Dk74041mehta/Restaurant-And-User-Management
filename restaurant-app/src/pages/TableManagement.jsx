import React, { useState, useEffect } from "react"
import { getTables } from "../utils/storage"

export default function TableManagement() {
  const [tables, setTables] = useState([])
  const [form, setForm] = useState({ name: "", chairs: "2" })

  useEffect(() => {
    const stored = getTables()
    setTables(stored)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleCreate = () => {
    if (!form.chairs) return alert("Please select chair count")
    const updated = [
      ...tables,
      {
        id: tables.length + 1,
        name: form.name.trim(),
        seats: Number(form.chairs),
        reserved: false,
      },
    ]
    setTables(updated)
    localStorage.setItem("ra_tables", JSON.stringify(updated))
    setForm({ name: "", chairs: "2" })
  }

  const handleDelete = (id) => {
    if (!confirm("Delete this table?")) return
    const filtered = tables.filter((t) => t.id !== id)
    // auto-renumber
    const renumbered = filtered.map((t, i) => ({ ...t, id: i + 1 }))
    setTables(renumbered)
    localStorage.setItem("ra_tables", JSON.stringify(renumbered))
  }

  return (
    <div className="table-mgmt">
      <h2 className="page-title">Tables</h2>

      <div className="tables-grid">
        {tables.map((t) => (
          <div key={t.id} className="table-card">
            <div className="table-top">
              <div className="table-number">Table {t.id}</div>
              <button className="delete-btn" onClick={() => handleDelete(t.id)}>
                ✕
              </button>
            </div>
            <div className="table-seats">{t.seats} Chairs</div>
            <div className="table-name">{t.name || "—"}</div>
          </div>
        ))}
      </div>

      <div className="create-form">
        <h3>Create</h3>
        <label>
          Table name (optional)
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter table name"
          />
        </label>

        <label>
          Chairs
          <select name="chairs" value={form.chairs} onChange={handleChange}>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
          </select>
        </label>

        <button className="create-btn" onClick={handleCreate}>
          Create
        </button>
      </div>
    </div>
  )
}
