import React from 'react'
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

describe('<DataTable />', () => {
  beforeEach(() => {
    cy.mount(<DataTable data={mockData} columns={columns} pageSize={3} />)
  })

  it('renders table with correct headers', () => {
    cy.get('[data-cy="data-table"]').should('be.visible')
    cy.get('[data-cy="header-id"]').should('contain', 'ID')
    cy.get('[data-cy="header-name"]').should('contain', 'Name')
    cy.get('[data-cy="header-email"]').should('contain', 'Email')
    cy.get('[data-cy="header-role"]').should('contain', 'Role')
  })

  it('displays correct number of rows per page', () => {
    cy.get('[data-cy="table-row"]').should('have.length', 3)
  })

  it('shows pagination controls', () => {
    cy.get('[data-cy="pagination"]').should('be.visible')
    cy.get('[data-cy="page-info"]').should('contain', 'Page 1 of 2')
  })

  it('navigates to next page', () => {
    cy.get('[data-cy="next-page"]').click()
    cy.get('[data-cy="page-info"]').should('contain', 'Page 2 of 2')
    cy.get('[data-cy="table-row"]').should('have.length', 2)
  })

  it('disables previous button on first page', () => {
    cy.get('[data-cy="prev-page"]').should('be.disabled')
  })

  it('disables next button on last page', () => {
    cy.get('[data-cy="next-page"]').click()
    cy.get('[data-cy="next-page"]').should('be.disabled')
  })

  it('sorts columns when sort button is clicked', () => {
    cy.get('[data-cy="sort-name"]').click()
    cy.get('[data-cy="cell-name"]').first().should('contain', 'Alice Brown')
    
    cy.get('[data-cy="sort-name"]').click()
    cy.get('[data-cy="cell-name"]').first().should('contain', 'Charlie Wilson')
  })

  it('filters data when filter input is used', () => {
    cy.get('[data-cy="filter-name"]').type('John')
    cy.get('[data-cy="table-row"]').should('have.length', 1)
    cy.get('[data-cy="cell-name"]').should('contain', 'John Doe')
  })

  it('filters multiple columns', () => {
    cy.get('[data-cy="filter-role"]').type('Admin')
    cy.get('[data-cy="table-row"]').should('have.length', 2)
    cy.get('[data-cy="cell-role"]').each(($el) => {
      cy.wrap($el).should('contain', 'Admin')
    })
  })

  it('resets to first page when filter is applied', () => {
    cy.get('[data-cy="next-page"]').click()
    cy.get('[data-cy="page-info"]').should('contain', 'Page 2 of 2')
    
    cy.get('[data-cy="filter-name"]').type('John')
    cy.get('[data-cy="page-info"]').should('contain', 'Page 1 of 1')
  })

  it('calls onRowClick when row is clicked', () => {
    const rowClickSpy = cy.stub().as('rowClickSpy')
    cy.mount(<DataTable data={mockData} columns={columns} onRowClick={rowClickSpy} />)
    
    cy.get('[data-cy="table-row"]').first().click()
    cy.get('@rowClickSpy').should('have.been.calledWith', mockData[0])
  })

  it('handles empty data', () => {
    cy.mount(<DataTable data={[]} columns={columns} />)
    cy.get('[data-cy="table-row"]').should('have.length', 0)
    cy.get('[data-cy="page-info"]').should('contain', 'Page 1 of 0')
  })

  it('maintains sort state across page changes', () => {
    cy.get('[data-cy="sort-name"]').click()
    cy.get('[data-cy="next-page"]').click()
    cy.get('[data-cy="cell-name"]').first().should('contain', 'Charlie Wilson')
  })

  it('clears filters when new data is provided', () => {
    cy.get('[data-cy="filter-name"]').type('John')
    cy.get('[data-cy="table-row"]').should('have.length', 1)
    
    const newData = [
      { id: 1, name: 'New User', email: 'new@example.com', role: 'User' }
    ]
    cy.mount(<DataTable data={newData} columns={columns} />)
    cy.get('[data-cy="table-row"]').should('have.length', 1)
    cy.get('[data-cy="cell-name"]').should('contain', 'New User')
  })
})
