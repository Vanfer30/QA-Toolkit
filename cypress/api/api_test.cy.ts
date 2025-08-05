describe('dog breed API - GET Tests', () => {
  it('returns a list of dog breeds', () => {
    cy.request('GET', 'https://dog.ceo/api/breeds/list/all')
      .its('status')
      .should('eq', 200)
  })

it('log the api results', () => {
  cy.request('https://dog.ceo/api/breeds/list/all')
    .then((response) => {
      // ✅ Log full response body
      cy.log(JSON.stringify(response.body))

      // ✅ Assert the response status
      expect(response.status).to.eq(200)

      // ✅ Assert structure and some data
      expect(response.body).to.have.property('message')
      expect(response.body).to.have.property('status', 'success')

      // ✅ Assert that message contains at least one breed
      const breeds = Object.keys(response.body.message)
      expect(breeds.length).to.be.greaterThan(0)

      // ✅ Optional: assert a specific breed exists
      expect(breeds).to.include('labrador')
    })
})

})