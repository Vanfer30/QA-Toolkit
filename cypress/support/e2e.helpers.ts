// No declare global, no typings magic — just plain functions that return Chainables.

export const popupHandle = () => {
  // Return the last Cypress command so the caller can chain/await it
  return cy.get('body', { log: false }).then(($body) => {
    const selectors = [
      '#L2AGLb',
      "button:contains('I agree')",
      "button:contains('Accept all')",
      "button:contains('Accept')",
    ];
    const found = selectors.find(sel => $body.find(sel).length > 0);
    if (found) {
      cy.get(found).click({ scrollBehavior: 'center' });
      cy.log(`Consent clicked via selector: ${found}`);
    } else {
      cy.log('Consent banner not found — continuing');
    }
  })
}

export const googleSearchBar = () => {
  cy.get('#APjFqb').should('be.visible');
};
