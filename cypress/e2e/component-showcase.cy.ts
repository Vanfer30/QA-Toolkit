describe('Component Showcase', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('demonstrates DataTable functionality', () => {
    // Test sorting
    cy.get('[data-cy="sort-name"]').click()
    cy.get('[data-cy="cell-name"]').first().should('contain', 'Alice Brown')
    
    // Test filtering
    cy.get('[data-cy="filter-role"]').type('Admin')
    cy.get('[data-cy="table-row"]').should('have.length', 2)
    
    // Test pagination
    cy.get('[data-cy="next-page"]').click()
    cy.get('[data-cy="page-info"]').should('contain', 'Page 2 of 2')
  })

  it('demonstrates MultiStepForm workflow', () => {
    // Complete step 1
    cy.get('[data-cy="step1-input"]').type('Personal Information')
    cy.get('[data-cy="step1-next"]').click()
    
    // Complete step 2
    cy.get('[data-cy="step-title"]').should('contain', 'Step 2')
    cy.get('[data-cy="step2-input"]').type('Contact Details')
    cy.get('[data-cy="step2-next"]').click()
    
    // Complete step 3
    cy.get('[data-cy="step-title"]').should('contain', 'Step 3')
    cy.get('[data-cy="step3-input"]').type('Final Step')
    cy.get('[data-cy="next-button"]').click()
    
    // Verify completion
    cy.get('[data-cy="multi-step-form"]').should('not.exist')
  })

  it('demonstrates FileUpload functionality', () => {
    // Test file selection
    cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/example.json')
    cy.get('[data-cy="file-item"]').should('be.visible')
    cy.get('[data-cy="file-name"]').should('contain', 'example.json')
    
    // Test file removal
    cy.get('[data-cy="remove-file"]').click()
    cy.get('[data-cy="file-item"]').should('not.exist')
  })

  it('demonstrates Modal functionality', () => {
    // Open modal
    cy.get('[data-cy="open-modal"]').click()
    cy.get('[data-cy="modal-backdrop"]').should('be.visible')
    cy.get('[data-cy="modal-content"]').should('be.visible')
    
    // Close modal
    cy.get('[data-cy="modal-close"]').click()
    cy.get('[data-cy="modal-backdrop"]').should('not.exist')
  })

  it('demonstrates Tabs functionality', () => {
    // Switch tabs
    cy.get('[data-cy="tab-tab2"]').click()
    cy.get('[data-cy="tab-tab2"]').should('have.attr', 'aria-selected', 'true')
    cy.get('[data-cy="tab-panel"]').should('contain', 'Content for tab 2')
    
    // Test keyboard navigation
    cy.get('[data-cy="tab-tab1"]').focus()
    cy.get('[data-cy="tab-tab1"]').type('{rightarrow}')
    cy.get('[data-cy="tab-tab2"]').should('be.focused')
  })

  it('demonstrates Toast notifications', () => {
    // Show different types of toasts
    cy.get('[data-cy="show-success"]').click()
    cy.get('[data-cy="toast"]').should('contain', 'Success message')
    
    cy.get('[data-cy="show-error"]').click()
    cy.get('[data-cy="toast"]').should('have.length', 2)
    
    // Close toast
    cy.get('[data-cy="toast-close"]').first().click()
    cy.get('[data-cy="toast"]').should('have.length', 1)
  })

  it('demonstrates Slider functionality', () => {
    // Test slider interaction
    cy.get('[data-cy="slider-track"]').click({ position: 'right' })
    cy.get('[data-cy="slider-value"]').should('not.contain', '0')
    
    // Test keyboard navigation
    cy.get('[data-cy="slider-track"]').focus()
    cy.get('[data-cy="slider-track"]').type('{rightarrow}')
    cy.get('[data-cy="slider-value"]').should('not.contain', '0')
  })

  it('demonstrates Rating functionality', () => {
    // Test star rating
    cy.get('[data-cy="rating-star-3"]').click()
    cy.get('[data-cy="rating-value"]').should('contain', '4/5')
    
    // Test hover
    cy.get('[data-cy="rating-star-2"]').trigger('mouseenter')
    cy.get('[data-cy="rating-value"]').should('contain', '3/5')
  })

  it('demonstrates component integration', () => {
    // Use DataTable to select a row
    cy.get('[data-cy="table-row"]').first().click()
    
    // Open modal with selected data
    cy.get('[data-cy="open-modal"]').click()
    cy.get('[data-cy="modal-content"]').should('be.visible')
    
    // Show success toast
    cy.get('[data-cy="show-success"]').click()
    cy.get('[data-cy="toast"]').should('be.visible')
    
    // Close modal
    cy.get('[data-cy="modal-close"]').click()
    cy.get('[data-cy="modal-backdrop"]').should('not.exist')
  })

  it('demonstrates accessibility features', () => {
    // Test keyboard navigation for tabs
    cy.get('[data-cy="tab-tab1"]').focus()
    cy.get('[data-cy="tab-tab1"]').type('{rightarrow}')
    cy.get('[data-cy="tab-tab2"]').should('be.focused')
    
    // Test ARIA attributes
    cy.get('[data-cy="tab-tab1"]').should('have.attr', 'aria-selected', 'true')
    cy.get('[data-cy="modal-backdrop"]').should('have.attr', 'aria-modal', 'true')
    
    // Test screen reader support
    cy.get('[data-cy="slider-track"]').should('have.attr', 'role', 'slider')
    cy.get('[data-cy="slider-track"]').should('have.attr', 'aria-valuemin')
  })

  it('demonstrates responsive behavior', () => {
    // Test mobile viewport
    cy.viewport(375, 667)
    cy.get('[data-cy="data-table"]').should('be.visible')
    cy.get('[data-cy="tabs"]').should('be.visible')
    
    // Test tablet viewport
    cy.viewport(768, 1024)
    cy.get('[data-cy="multi-step-form"]').should('be.visible')
    
    // Test desktop viewport
    cy.viewport(1920, 1080)
    cy.get('[data-cy="file-upload"]').should('be.visible')
  })

  it('demonstrates error handling', () => {
    // Test file upload error
    cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/large-file.json')
    cy.get('[data-cy="toast"]').should('contain', 'too large')
    
    // Test form validation error
    cy.get('[data-cy="step1-next"]').click()
    cy.get('[data-cy="step-error"]').should('contain', 'Please complete all required fields')
  })

  it('demonstrates performance under load', () => {
    // Test with large dataset
    cy.get('[data-cy="data-table"]').should('be.visible')
    cy.get('[data-cy="table-row"]').should('have.length.at.least', 1)
    
    // Test multiple toasts
    for (let i = 0; i < 5; i++) {
      cy.get('[data-cy="show-info"]').click()
    }
    cy.get('[data-cy="toast"]').should('have.length', 5)
  })
})
