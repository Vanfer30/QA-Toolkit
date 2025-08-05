import SearchFilter from '../../component/SearchFilter'


describe('<SearchFilter/> validation', () => {
beforeEach(() => {
cy.mount(<SearchFilter />)
})

  it('Mount', () => {
    cy.log("mount success")
  })

   it('Search Field Test', () => {
    cy.get('[data-cy="search-input"]').should('exist')
  })


   it('Search Field Possible Results', () => {
    cy.get('[data-cy="search-filter"]').should('exist')
    cy.get('[data-cy="results"] > :nth-child(1)').contains('Apple')
    cy.get('[data-cy="results"] > :nth-child(2)').contains('Banana')
    cy.get('[data-cy="results"] > :nth-child(3)').contains('Cherry')
    cy.get('[data-cy="results"] > :nth-child(4)').contains('Date')
    cy.get('[data-cy="results"] > :nth-child(5)').contains('Elderberry')
  })


 it('Search Field Input', () => {
    cy.get('[data-cy="search-input"]').should('exist')
    .type('Apple')
    cy.get('[data-cy="result-item"]').should('exist')
    .contains('Apple')
    })
})