import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import DataTable from '../../component/DataTable'

const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin' }
]

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true, filterable: true },
  { key: 'email', label: 'Email', sortable: true, filterable: true },
  { key: 'role', label: 'Role', sortable: true, filterable: true }
]

describe('DataTable', () => {
  beforeEach(() => {
    render(<DataTable data={mockData} columns={columns} pageSize={3} />)
  })

  it('renders table headers correctly', () => {
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
  })

  it('displays correct number of rows per page', () => {
    const rows = screen.getAllByTestId('table-row')
    expect(rows).toHaveLength(3)
  })

  it('shows pagination controls', () => {
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('navigates to next page', () => {
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
    const rows = screen.getAllByTestId('table-row')
    expect(rows).toHaveLength(2)
  })

  it('disables previous button on first page', () => {
    const prevButton = screen.getByText('Previous')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    expect(nextButton).toBeDisabled()
  })

  it('sorts columns when sort button is clicked', () => {
    const nameSortButton = screen.getByTestId('sort-name')
    fireEvent.click(nameSortButton)
    
    const nameCells = screen.getAllByTestId('cell-name')
    expect(nameCells[0]).toHaveTextContent('Alice Brown')
    
    fireEvent.click(nameSortButton)
    expect(nameCells[0]).toHaveTextContent('Charlie Wilson')
  })

  it('filters data when filter input is used', () => {
    const nameFilter = screen.getByTestId('filter-name')
    fireEvent.change(nameFilter, { target: { value: 'John' } })
    
    const rows = screen.getAllByTestId('table-row')
    expect(rows).toHaveLength(1)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('filters multiple columns', () => {
    const roleFilter = screen.getByTestId('filter-role')
    fireEvent.change(roleFilter, { target: { value: 'Admin' } })
    
    const rows = screen.getAllByTestId('table-row')
    expect(rows).toHaveLength(2)
    
    const roleCells = screen.getAllByTestId('cell-role')
    roleCells.forEach(cell => {
      expect(cell).toHaveTextContent('Admin')
    })
  })

  it('resets to first page when filter is applied', () => {
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
    
    const nameFilter = screen.getByTestId('filter-name')
    fireEvent.change(nameFilter, { target: { value: 'John' } })
    
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument()
  })

  it('calls onRowClick when row is clicked', () => {
    const onRowClick = jest.fn()
    render(<DataTable data={mockData} columns={columns} onRowClick={onRowClick} />)
    
    const firstRow = screen.getAllByTestId('table-row')[0]
    fireEvent.click(firstRow)
    
    expect(onRowClick).toHaveBeenCalledWith(mockData[0])
  })

  it('handles empty data', () => {
    render(<DataTable data={[]} columns={columns} />)
    
    const rows = screen.queryAllByTestId('table-row')
    expect(rows).toHaveLength(0)
    expect(screen.getByText('Page 1 of 0')).toBeInTheDocument()
  })

  it('maintains sort state across page changes', () => {
    const nameSortButton = screen.getByTestId('sort-name')
    fireEvent.click(nameSortButton)
    
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    const nameCells = screen.getAllByTestId('cell-name')
    expect(nameCells[0]).toHaveTextContent('Charlie Wilson')
  })

  it('clears filters when new data is provided', () => {
    const nameFilter = screen.getByTestId('filter-name')
    fireEvent.change(nameFilter, { target: { value: 'John' } })
    
    const rows = screen.getAllByTestId('table-row')
    expect(rows).toHaveLength(1)
    
    const newData = [{ id: 1, name: 'New User', email: 'new@example.com', role: 'User' }]
    render(<DataTable data={newData} columns={columns} />)
    
    const newRows = screen.getAllByTestId('table-row')
    expect(newRows).toHaveLength(1)
    expect(screen.getByText('New User')).toBeInTheDocument()
  })

  it('handles controlled value changes', () => {
    const { rerender } = render(<DataTable data={mockData} columns={columns} />)
    
    const newData = [{ id: 1, name: 'Updated User', email: 'updated@example.com', role: 'User' }]
    rerender(<DataTable data={newData} columns={columns} />)
    
    expect(screen.getByText('Updated User')).toBeInTheDocument()
  })

  it('applies correct styling for sortable columns', () => {
    const sortButtons = screen.getAllByTestId(/^sort-/)
    expect(sortButtons).toHaveLength(4) // All columns are sortable
  })

  it('applies correct styling for filterable columns', () => {
    const filterInputs = screen.getAllByTestId(/^filter-/)
    expect(filterInputs).toHaveLength(3) // name, email, role are filterable
  })

  it('handles large datasets efficiently', () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 2 === 0 ? 'Admin' : 'User'
    }))
    
    render(<DataTable data={largeData} columns={columns} pageSize={10} />)
    
    const rows = screen.getAllByTestId('table-row')
    expect(rows).toHaveLength(10)
    expect(screen.getByText('Page 1 of 100')).toBeInTheDocument()
  })
})
