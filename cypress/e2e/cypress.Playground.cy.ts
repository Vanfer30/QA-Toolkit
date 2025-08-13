import { popupHandle, googleSearchBar } from '../support/e2e.helpers';


describe('Basic Cypress Interactions - Part 1', () => {
  beforeEach(() => {
    // Any global setup can go here, e.g. viewport
    cy.viewport(1280, 720);
    cy.visit("https://www.google.co.uk");

  });

  it("navigate to google consent and optional popup", () => {
   
   
  });

    it("navigate to google and handle consent and optional popup", () => {
    popupHandle()
   
  });

  it("navigate to google and handle consent and optional popup and find search bar", () => {
    popupHandle()
    cy.get('#APjFqb').should('be.visible')
    .type("{enter}")
    
   
  });

 
});

describe.only("Basic Cypress Interactions - Part 2", () => {

  it("Find elements by .get()", ()=> {
    cy.visit("https://example.cypress.io/commands/querying")
    cy.get('#query-btn').should('exist').should('contain', 'Button').click()
  })

  it("Find elements by .contains()", ()=> {
    cy.visit("https://example.cypress.io/commands/querying")
    
    cy.get('.query-list')
    .contains('apples')
    .should('have.class', 'first')

    cy.get('.query-list')
    .contains('oranges')
    .should('have.class', 'second')

    cy.get('.query-list')
    .contains('bananas')
    .should('have.class', 'third')

    cy.get('.query-list')
    .contains('more apples')
    .should('have.class', 'fourth')

    cy.get('.query-button')
    .contains('Save Form')
    .should('have.class', 'btn')
    })

  it("Find elements by .within()", ()=> {
    cy.visit("https://example.cypress.io/commands/querying")
    
    cy.get('.query-form').within(() => {
    cy.get('input:first').should('have.attr', 'placeholder', 'Email')
    cy.get('input:last').should('have.attr', 'placeholder', 'Password')
})
    })



  })
 