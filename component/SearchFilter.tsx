import React, { useState } from 'react'

const sampleItems = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']

export default function SearchFilter() {
  const [query, setQuery] = useState('')

  const filtered = sampleItems.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div data-cy="search-filter">
      <input
        data-cy="search-input"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul data-cy="results">
        {filtered.map((item) => (
          <li key={item} data-cy="result-item">{item}</li>
        ))}
      </ul>
    </div>
  )
}
