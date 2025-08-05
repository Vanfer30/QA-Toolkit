import React from 'react'
import ButtonToggle from '../../component/ButtonToggle'
/// <reference types="cypress" />




describe('<Button Toggle />', () => {
      let props: { toggle: boolean }

  beforeEach(() => {
    props = { toggle: false } // or false, dynamically set this if needed
    cy.mount(<ButtonToggle {...props} />)
  })

    it ('Component Found', () => {
        cy.log("Mount Success")
    })

  it('mounts and toggles', () => {

    cy.get('[data-cy="toggle"]').should('exist')
    .contains('OFF')
    .click()
    .contains('ON')
    .should('exist')

  })
  it('mounts with toggle true', () => {
    props.toggle = true
    cy.mount(<ButtonToggle {...props} />)
    cy.get('[data-cy="toggle"]').should('contain', 'ON')
    })
})