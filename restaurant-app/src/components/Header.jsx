import React, { useState } from 'react'

export default function Header() {
  const [query, setQuery] = useState('')

  return (
    <header className="top-header">
      <div className="header-left">
        <div className="logo">Order Line</div>
      </div>

      <div className="header-center">
        <input
          className="search-input"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="header-right">
        <div className="user">
          <div className="circle avatar-empty small" />
          <div className="username">Admin</div>
        </div>
      </div>
    </header>
  )
}
