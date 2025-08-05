import React from 'react'
import UserCard from '../../component/UserCard'
import UserCardForm from '../../component/UserCardForm'



describe('<Button Toggle />', () => {
  
    it ('Component Found', () => {
      const name = "Jordan Norris"
      const role = "Senior QA Engineer"

      cy.mount(<UserCard name={name} role={role} />)

      cy.get('[data-cy="user-card"]').should('exist')
      cy.get('[data-cy="user-name"]').should('have.text', name)
      cy.get('[data-cy="user-role"]').should('have.text', role)
    })
})


describe('<UserCard /> and <UserCardForm />', () => {
  it('renders the UserCard with given props', () => {
    const name = "Jordan Norris"
    const role = "Senior QA Engineer"

    cy.mount(<UserCard name={name} role={role} />)

    cy.get('[data-cy="user-card"]').should('exist')
    cy.get('[data-cy="user-name"]').should('have.text', name)
    cy.get('[data-cy="user-role"]').should('have.text', role)
  })

  it('fills the UserCardForm and triggers onSubmit', () => {
    const handleSubmit = cy.stub().as('submitHandler')

    cy.mount(<UserCardForm onSubmit={handleSubmit} />)

    cy.get('[data-cy="name-input"]').type('Jordan')
    cy.get('[data-cy="role-input"]').type('Developer')
    cy.get('[data-cy="submit-button"]').click()

    cy.get('@submitHandler').should('have.been.calledWith', 'Jordan', 'Developer')
  })
})