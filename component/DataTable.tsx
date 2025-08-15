import React, { useState, useMemo } from 'react'

type Column = {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
}

type DataTableProps = {
  data: Record<string, any>[]
  columns: Column[]
  pageSize?: number
  onRowClick?: (row: Record<string, any>) => void
}

export default function DataTable({ 
  data, 
  columns, 
  pageSize = 10,
  onRowClick 
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Record<string, string>>({})

  const filteredAndSortedData = useMemo(() => {
    let result = [...data]

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(row => 
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        )
      }
    })

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = String(a[sortColumn]).toLowerCase()
        const bVal = String(b[sortColumn]).toLowerCase()
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, filters, sortColumn, sortDirection])

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + pageSize)

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
    setCurrentPage(1) // Reset to first page when sorting
  }

  const handleFilter = (columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }))
    setCurrentPage(1)
  }

  return (
    <div data-cy="data-table">
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key} data-cy={`header-${column.key}`}>
                <div>
                  <span>{column.label}</span>
                  {column.sortable && (
                    <button
                      data-cy={`sort-${column.key}`}
                      onClick={() => handleSort(column.key)}
                    >
                      {sortColumn === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                    </button>
                  )}
                </div>
                {column.filterable && (
                  <input
                    data-cy={`filter-${column.key}`}
                    type="text"
                    placeholder={`Filter ${column.label}`}
                    value={filters[column.key] || ''}
                    onChange={(e) => handleFilter(column.key, e.target.value)}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr 
              key={index} 
              data-cy="table-row"
              onClick={() => onRowClick?.(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map(column => (
                <td key={column.key} data-cy={`cell-${column.key}`}>
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div data-cy="pagination">
        <button
          data-cy="prev-page"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span data-cy="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          data-cy="next-page"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
