import React, { useEffect, useState } from "react"
import { getOrders, saveOrders } from "../utils/storage"

export default function OrderLine() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const stored = getOrders()
    const withTimers = stored.map((o) => ({
      ...o,
      remaining: o.remaining || Math.floor(Math.random() * 400) + 120, // random 2–8 mins
    }))
    setOrders(withTimers)
    saveOrders(withTimers)
  }, [])

  // countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.remaining > 0
            ? { ...o, remaining: o.remaining - 1 }
            : { ...o, remaining: 0 }
        )
      )
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleNextStatus = (id) => {
    const updated = orders.map((o) => {
      if (o.id !== id) return o
      if (o.status === "Processing") return { ...o, status: "Served" }
      if (o.status === "Served") return { ...o, status: "Done" }
      return o
    })
    setOrders(updated)
    saveOrders(updated)
  }

  const renderSection = (title, color, filterStatus) => {
    const list = orders.filter((o) =>
      filterStatus.includes(o.status.toLowerCase())
    )

    return (
      <div className="order-section">
        <h3 className="order-title">{title}</h3>
        <div className="order-grid">
          {list.map((o) => (
            <div key={o.id} className={`order-card ${color}`}>
              <div className="order-header">
                <span className="order-id">#{o.id}</span>
                <span className="order-type">{o.type}</span>
              </div>

              {o.table && <div className="order-table">Table {o.table}</div>}

              <div className="order-items">Items: {o.items}</div>

              <div className="order-timer">
                Time Left:{" "}
                <span className="timer-value">
                  {Math.floor(o.remaining / 60)}:
                  {(o.remaining % 60).toString().padStart(2, "0")}
                </span>
              </div>

              <button
                className="next-btn"
                onClick={() => handleNextStatus(o.id)}
                disabled={o.status === "Done"}
              >
                {o.status === "Done" ? "Completed" : "Next →"}
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="orderline-page">
      <h2 className="page-title">Order Line</h2>

      {renderSection("Dine In / Take Away (Processing)", "yellow", [
        "processing",
      ])}
      {renderSection("Served", "green", ["served"])}
      {renderSection("Done", "gray", ["done"])}
    </div>
  )
}
