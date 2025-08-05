import React from 'react'
import LoginForm from '../../component/LoginForm'

describe('<LoginForm /> validation', () => {
  it('disables submit when fields are empty', () => {
    cy.mount(<LoginForm />)
    cy.get('[data-cy="submit-button"]').should('be.disabled')
  })

  it('disables submit when email is invalid', () => {
    cy.mount(<LoginForm />)
    cy.get('[data-cy="email-input"]').type('bad-email')
    cy.get('[data-cy="password-input"]').type('123456')
    cy.get('[data-cy="submit-button"]').should('be.disabled')
  })

  it('disables submit when password is too short', () => {
    cy.mount(<LoginForm />)
    cy.get('[data-cy="email-input"]').type('user@example.com')
    cy.get('[data-cy="password-input"]').type('123')
    cy.get('[data-cy="submit-button"]').should('be.disabled')
  })

  it('enables submit when form is valid', () => {
    cy.mount(<LoginForm />)
    cy.get('[data-cy="email-input"]').type('user@example.com')
    cy.get('[data-cy="password-input"]').type('password123')
    cy.get('[data-cy="submit-button"]').should('not.be.disabled')
  })

  it('calls onSubmit with correct values when valid', () => {
    const submitSpy = cy.stub().as('submitSpy')
    cy.mount(<LoginForm onSubmit={submitSpy} />)
    cy.get('[data-cy="email-input"]').type('user@example.com')
    cy.get('[data-cy="password-input"]').type('validpass')
    cy.get('[data-cy="submit-button"]').click()
    cy.get('@submitSpy').should('have.been.calledWith', 'user@example.com', 'validpass')
  })

   it('invalid email - disabled login', () => {
    const submitSpy = cy.stub().as('submitSpy')
    cy.mount(<LoginForm onSubmit={submitSpy} />)
    cy.get('[data-cy="email-input"]').type('wrongemail@.com')
    cy.get('[data-cy="password-input"]').type('validpass')
    cy.get('[data-cy="submit-button"]').should('be.disabled')
  })
  
})
