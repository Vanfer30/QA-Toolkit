import React from 'react'
import Stepper from '../../component/stepper'

describe('<Stepper />', () => {

     let props: { count: number }
  
    beforeEach(() => {
      props = { count: 0 } // default value is 0
      cy.mount(<Stepper {...props} />)
    })


  it('mounts and increments', () => {

    cy.get('[data-cy="counter"]')
      .should('exist')
      .and('contain', '0')

    cy.get('[data-cy="decrement"]')
    .should('exist')

    cy.get('[data-cy="increment"]')
      .should('exist')
      .click()

    cy.get('[data-cy="counter"]')
      .should('exist')
      .and('contain', '1')
  })
  
  it('supports a "count" prop to set the value', () => {
       props.count = 100
      cy.mount(<Stepper {...props} />) // Re-mount with updated prop
      cy.get('[data-cy="counter"]').should('have.text', '100')
  })
})