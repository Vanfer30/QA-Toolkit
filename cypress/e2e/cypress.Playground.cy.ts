import { popupHandle, googleSearchBar } from '../support/e2e.helpers';


describe("Cypress Interactions - (Querying)", () => {

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
 

describe("Cypress Interactions - (Actions)", () => {
  // cypress/e2e/kitchen-sink/actions.cy.ts
// Covers all examples on https://example.cypress.io/commands/actions

describe('Kitchen Sink — Actions', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/actions');
  });

  it('.type() — typing into inputs incl. sequences, modifiers, delay, force', () => {
    cy.get('.action-email').type('[email protected]');
    cy.get('.action-email').should('have.value', '[email protected]');

    cy.get('.action-email').type('{leftarrow}{rightarrow}{uparrow}{downarrow}');
    cy.get('.action-email').type('{del}{selectall}{backspace}');

    cy.get('.action-email').type('{alt}{option}');
    cy.get('.action-email').type('{ctrl}{control}');
    cy.get('.action-email').type('{meta}{command}{cmd}');
    cy.get('.action-email').type('{shift}');

    cy.get('.action-email').type('[email protected]', { delay: 100 });
    cy.get('.action-email').should('have.value', '[email protected]');

    cy.get('.action-disabled').type('disabled error checking', { force: true });
    cy.get('.action-disabled').should('have.value', 'disabled error checking');
  });

  it('.focus() — focusing an element sets styles', () => {
    cy.get('.action-focus').focus();
    cy.get('.action-focus')
      .should('have.class', 'focus')
      .prev()
      .should('have.attr', 'style', 'color: orange;');
  });

  it('.blur() — blurring an element sets error styles', () => {
    cy.get('.action-blur').type('About to blur');
    cy.get('.action-blur').blur();
    cy.get('.action-blur')
      .should('have.class', 'error')
      .prev()
      .should('have.attr', 'style', 'color: red;');
  });

  it('.clear() — clearing input content', () => {
    cy.get('.action-clear').type('Clear this text').should('have.value', 'Clear this text');
    cy.get('.action-clear').clear().should('have.value', '');
  });

  it('.submit() — submitting a form', () => {
    cy.get('.action-form').find('[type="text"]').type('HALFOFF');
    cy.get('.action-form').submit();
    cy.get('.action-form').next().should('contain', 'Your form has been submitted!');
  });

  it('.click() — default, positions, coordinates, multiple, force', () => {
    cy.get('.action-btn').click();

    cy.get('#action-canvas').click(); // center by default

    cy.get('#action-canvas').click('topLeft');
    cy.get('#action-canvas').click('top');
    cy.get('#action-canvas').click('topRight');
    cy.get('#action-canvas').click('left');
    cy.get('#action-canvas').click('right');
    cy.get('#action-canvas').click('bottomLeft');
    cy.get('#action-canvas').click('bottom');
    cy.get('#action-canvas').click('bottomRight');

    cy.get('#action-canvas').click(80, 75);
    cy.get('#action-canvas').click(170, 75);
    cy.get('#action-canvas').click(80, 165);
    cy.get('#action-canvas').click(100, 185);
    cy.get('#action-canvas').click(125, 190);
    cy.get('#action-canvas').click(150, 185);
    cy.get('#action-canvas').click(170, 165);

    cy.get('.action-labels>.label').click({ multiple: true });

    cy.get('.action-opacity>.btn').click({ force: true });
  });

  it('.dblclick() — double‑click toggles to input', () => {
    cy.get('.action-div').dblclick();
    cy.get('.action-div').should('not.be.visible');
    cy.get('.action-input-hidden').should('be.visible');
  });

  it('.rightclick() — right‑click context edit', () => {
    cy.get('.rightclick-action-div').rightclick();
    cy.get('.rightclick-action-div').should('not.be.visible');
    cy.get('.rightclick-action-input-hidden').should('be.visible');
  });

  it('.check() — check checkboxes & radios (values, arrays, force)', () => {
    cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]').check();
    cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]').should('be.checked');

    cy.get('.action-radios [type="radio"]').not('[disabled]').check();
    cy.get('.action-radios [type="radio"]').not('[disabled]').should('be.checked');

    cy.get('.action-radios [type="radio"]').check('radio1');
    cy.get('.action-radios [type="radio"]').should('be.checked');

    cy.get('.action-multiple-checkboxes [type="checkbox"]').check(['checkbox1', 'checkbox2']);
    cy.get('.action-multiple-checkboxes [type="checkbox"]').should('be.checked');

    cy.get('.action-checkboxes [disabled]').check({ force: true }).should('be.checked');
    cy.get('.action-radios [type="radio"]').check('radio3', { force: true });
    cy.get('.action-radios [type="radio"]').should('be.checked');
  });

  it('.uncheck() — uncheck (single, arrays, force)', () => {
    cy.get('.action-check [type="checkbox"]').not('[disabled]').uncheck();
    cy.get('.action-check [type="checkbox"]').not('[disabled]').should('not.be.checked');

    cy.get('.action-check [type="checkbox"]').check('checkbox1');
    cy.get('.action-check [type="checkbox"]').uncheck('checkbox1');
    cy.get('.action-check [type="checkbox"][value="checkbox1"]').should('not.be.checked');

    cy.get('.action-check [type="checkbox"]').check(['checkbox1', 'checkbox3']);
    cy.get('.action-check [type="checkbox"]').uncheck(['checkbox1', 'checkbox3']);
    cy.get('.action-check [type="checkbox"][value="checkbox1"]').should('not.be.checked');
    cy.get('.action-check [type="checkbox"][value="checkbox3"]').should('not.be.checked');

    cy.get('.action-check [disabled]').uncheck({ force: true }).should('not.be.checked');
  });

  it('.select() — single & multiple, by text and by value', () => {
    cy.get('.action-select').should('have.value', '--Select a fruit--');

    cy.get('.action-select').select('apples');
    cy.get('.action-select').should('have.value', 'fr-apples');

    cy.get('.action-select-multiple').select(['apples', 'oranges', 'bananas']);
    cy.get('.action-select-multiple')
      .invoke('val')
      .should('deep.equal', ['fr-apples', 'fr-oranges', 'fr-bananas']);

    cy.get('.action-select').select('fr-bananas').should('have.value', 'fr-bananas');

    cy.get('.action-select-multiple').select(['fr-apples', 'fr-oranges', 'fr-bananas']);
    cy.get('.action-select-multiple')
      .invoke('val')
      .should('deep.equal', ['fr-apples', 'fr-oranges', 'fr-bananas'])
      .and('include', 'fr-oranges');
  });

  it('.scrollIntoView() — reveals hidden buttons', () => {
    cy.get('#scroll-horizontal button').should('not.be.visible');
    cy.get('#scroll-horizontal button').scrollIntoView().should('be.visible');

    cy.get('#scroll-vertical button').should('not.be.visible');
    cy.get('#scroll-vertical button').scrollIntoView().should('be.visible');

    cy.get('#scroll-both button').should('not.be.visible');
    cy.get('#scroll-both button').scrollIntoView().should('be.visible');
  });

  it('cy.scrollTo() — window & element scrolling with coords, easing, duration', () => {
    cy.scrollTo('bottom');
    cy.get('#scrollable-horizontal').scrollTo('right');
    cy.get('#scrollable-vertical').scrollTo(250, 250);
    cy.get('#scrollable-both').scrollTo('75%', '25%');
    cy.get('#scrollable-vertical').scrollTo('center', { easing: 'linear' });
    cy.get('#scrollable-both').scrollTo('center', { duration: 2000 });
  });

  it('.trigger() — set range value and assert output', () => {
    cy.get('.trigger-input-range').invoke('val', 25);
    cy.get('.trigger-input-range').trigger('change');
    cy.get('.trigger-input-range')
      .get('input[type=range]')
      .siblings('p')
      .should('have.text', '25');
  });
});


 })

 // cypress/e2e/kitchen-sink/network-requests.cy.ts
// Covers https://example.cypress.io/commands/network-requests

describe.only('Cypress Interactions - (Network Requests)', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/network-requests');
  });

  // ---------- cy.intercept() UI-driven requests ----------
  it('GET — intercepts the "Get Comment" button request and validates response', () => {
    cy.intercept('GET', '**/comments/*').as('getComment');

    cy.get('.network-btn').click();

    cy.wait('@getComment')
      .its('response.statusCode')
      .should('eq', 200);

    // The page renders fetched text into .network-comment
    cy.get('.network-comment')
      .should('be.visible')
      .and('not.be.empty');
  });

  

  // ---------- cy.request() programmatic requests ----------
  it('cy.request() — simple GET returns JSON list of comments', () => {
    cy.request('https://jsonplaceholder.cypress.io/comments').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.headers).to.be.an('object');
      expect(res.body).to.be.an('array');
      // Known dataset usually contains hundreds of comments; just sanity‑check non‑empty
      expect(res.body.length).to.be.greaterThan(0);
      expect(res.body[0]).to.include.keys('postId', 'id', 'name', 'email', 'body');
    });
  });

  it('cy.request() with query params — filters by postId', () => {
    cy.request({
      url: 'https://jsonplaceholder.cypress.io/comments',
      qs: { postId: 1 },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array').and.not.be.empty;
      // all returned comments should match the filter
      res.body.forEach((c: any) => expect(c.postId).to.eq(1));
    });
  });

  it('cy.request() POST — creates a resource and returns id', () => {
    cy.request('POST', 'https://jsonplaceholder.cypress.io/comments', {
      name: 'Cypress Test',
      email: 'hello@cypress.io',
      body: 'Posting via cy.request()',
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 201]);
      expect(res.body).to.include.keys('id', 'name', 'email', 'body');
      expect(res.body.name).to.eq('Cypress Test');
    });
  });

  it('cy.request() PUT — updates a resource', () => {
    cy.request('PUT', 'https://jsonplaceholder.cypress.io/comments/1', {
      id: 1,
      name: 'Updated via cy.request()',
      email: 'hello@cypress.io',
      body: 'Updated text',
    }).then((res) => {
      expect(res.status).to.be.within(200, 204);
      expect(res.body).to.include({ id: 1 });
    });
  });

  it('cy.request() custom assertions — headers & duration', () => {
    cy.request('https://jsonplaceholder.cypress.io/comments').then((res) => {
      expect(res.duration).to.be.a('number');
      expect(res.headers).to.have.property('content-type');
      expect(res.headers['content-type']).to.match(/application\/json/);
    });
  });
});
