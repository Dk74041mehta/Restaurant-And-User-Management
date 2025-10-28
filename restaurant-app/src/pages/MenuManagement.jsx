import React, { useEffect, useState } from "react"
import { getMenu } from "../utils/storage"

export default function MenuManagement() {
  const [menu, setMenu] = useState([])
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    averagePreparationTime: "",
    category: "",
  })

  useEffect(() => {
    const stored = getMenu()
    setMenu(stored)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleCreate = () => {
    if (!form.name || !form.price)
      return alert("Please fill Name and Price fields")

    const newItem = {
      id: Date.now(),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      averagePreparationTime: Number(form.averagePreparationTime) || 0,
      category: form.category.trim() || "Uncategorized",
      stock: true,
    }

    const updated = [...menu, newItem]
    setMenu(updated)
    localStorage.setItem("ra_menu", JSON.stringify(updated))
    setForm({
      name: "",
      description: "",
      price: "",
      averagePreparationTime: "",
      category: "",
    })
  }

  const handleDelete = (id) => {
    if (!confirm("Delete this item?")) return
    const filtered = menu.filter((m) => m.id !== id)
    setMenu(filtered)
    localStorage.setItem("ra_menu", JSON.stringify(filtered))
  }

  return (
    <div className="menu-page">
      <h2 className="page-title">Menu Items</h2>

      <div className="menu-grid">
        {menu.map((m) => (
          <div key={m.id} className="menu-card">
            <div className="menu-top">
              <div className="menu-name">{m.name}</div>
              <button className="delete-btn" onClick={() => handleDelete(m.id)}>
                ✕
              </button>
            </div>
            <div className="menu-desc">{m.description}</div>
            <div className="menu-footer">
              <span className="price">₹ {m.price}</span>
              <span className="prep-time">{m.averagePreparationTime} min</span>
            </div>
            <div className="menu-category">{m.category}</div>
          </div>
        ))}
      </div>

      <div className="create-form">
        <h3>Add Item</h3>

        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Item name"
          />
        </label>

        <label>
          Description
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description"
          />
        </label>

        <label>
          Price (₹)
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
          />
        </label>

        <label>
          Avg. Preparation Time (min)
          <input
            name="averagePreparationTime"
            type="number"
            value={form.averagePreparationTime}
            onChange={handleChange}
            placeholder="Minutes"
          />
        </label>

        <label>
          Category
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Burger, Drink, Dessert"
          />
        </label>

        <button className="create-btn" onClick={handleCreate}>
          Add
        </button>
      </div>
    </div>
  )
}
