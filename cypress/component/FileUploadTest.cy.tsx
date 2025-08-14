import React from 'react'
import FileUpload from '../../component/FileUpload'

describe('<FileUpload />', () => {
  beforeEach(() => {
    cy.mount(<FileUpload />)
  })

  it('renders drop zone with correct text', () => {
    cy.get('[data-cy="file-upload"]').should('be.visible')
    cy.get('[data-cy="drop-zone"]').should('be.visible')
    cy.get('[data-cy="upload-text"]').should('contain', 'Drag and drop files here')
  })

  it('shows file input when drop zone is clicked', () => {
    cy.get('[data-cy="drop-zone"]').click()
    // The file input should be triggered (we can't directly test the file dialog)
  })

  it('accepts files via file input', () => {
    cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/example.json', { force: true })
    cy.get('[data-cy="file-list"]').should('be.visible')
    cy.get('[data-cy="file-item"]').should('have.length', 1)
    cy.get('[data-cy="file-name"]').should('contain', 'example.json')
  })

  it('accepts multiple files when multiple prop is true', () => {
    cy.mount(<FileUpload multiple={true} />)
    cy.get('[data-cy="file-input"]').selectFile([
      'cypress/fixtures/example.json',
      'cypress/fixtures/test-app.html'
    ], { force: true })
    cy.get('[data-cy="file-item"]').should('have.length', 2)
  })

  it('shows file size information', () => {
    cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/example.json', { force: true })
    cy.get('[data-cy="file-size"]').should('be.visible')
  })

  it('allows removing individual files', () => {
    cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/example.json', { force: true })
    cy.get('[data-cy="file-item"]').should('have.length', 1)
    cy.get('[data-cy="remove-file"]').click()
    cy.get('[data-cy="file-item"]').should('not.exist')
  })

  it('calls onUpload when upload button is clicked', () => {
    const uploadSpy = cy.stub().as('uploadSpy')
    cy.mount(<FileUpload onUpload={uploadSpy} />)
    
    cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/example.json', { force: true })
    cy.get('[data-cy="upload-button"]').click()
    cy.get('@uploadSpy').should('have.been.called')
  })

  it('shows uploading state', () => {
    const uploadSpy = cy.stub().as('uploadSpy')
    cy.mount(<FileUpload onUpload={uploadSpy} />)
    
    cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/example.json', { force: true })
    cy.get('[data-cy="upload-button"]').click()
    cy.get('[data-cy="upload-button"]').should('contain', 'Uploading...')
  })

  it('clears files after successful upload', () => {
    const uploadSpy = cy.stub().as('uploadSpy')
    cy.mount(<FileUpload onUpload={uploadSpy} />)
    
    cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/example.json', { force: true })
    cy.get('[data-cy="upload-button"]').click()
    cy.get('[data-cy="file-item"]').should('not.exist')
  })

  it('handles drag and drop events', () => {
    cy.get('[data-cy="drop-zone"]').trigger('dragover')
    cy.get('[data-cy="drop-zone"]').should('have.css', 'border-color', 'rgb(0, 123, 255)')
    
    cy.get('[data-cy="drop-zone"]').trigger('dragleave')
    cy.get('[data-cy="drop-zone"]').should('have.css', 'border-color', 'rgb(204, 204, 204)')
  })

  it('validates file size when maxSize is set', () => {
    const errorSpy = cy.stub().as('errorSpy')
    cy.mount(<FileUpload maxSize={100} onError={errorSpy} />)
    
    // Create a large file for testing
    cy.fixture('example.json').then((content) => {
      const largeContent = content + 'x'.repeat(1000) // Make it larger than 100 bytes
      cy.writeFile('cypress/fixtures/large-file.json', largeContent)
      
      cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/large-file.json', { force: true })
      cy.get('@errorSpy').should('have.been.called')
    })
  })

  it('validates file type when accept is set', () => {
    const errorSpy = cy.stub().as('errorSpy')
    cy.mount(<FileUpload accept="image/*" onError={errorSpy} />)
    
    cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/example.json', { force: true })
    cy.get('@errorSpy').should('have.been.called')
  })

  it('shows accepted file types in the UI', () => {
    cy.mount(<FileUpload accept="image/*" />)
    cy.get('[data-cy="upload-text"]').should('contain', 'Accepted types: image/*')
  })

  it('shows max file size in the UI', () => {
    cy.mount(<FileUpload maxSize={1024 * 1024} />) // 1MB
    cy.get('[data-cy="upload-text"]').should('contain', 'Max size: 1 MB')
  })

  it('handles empty file list', () => {
    cy.get('[data-cy="file-list"]').should('not.exist')
  })

  it('prevents upload when no files are selected', () => {
    const uploadSpy = cy.stub().as('uploadSpy')
    cy.mount(<FileUpload onUpload={uploadSpy} />)
    
    cy.get('[data-cy="upload-button"]').should('not.exist')
  })

  it('handles multiple file removal', () => {
    cy.mount(<FileUpload multiple={true} />)
    cy.get('[data-cy="file-input"]').selectFile([
      'cypress/fixtures/example.json',
      'cypress/fixtures/test-app.html'
    ], { force: true })
    
    cy.get('[data-cy="file-item"]').should('have.length', 2)
    cy.get('[data-cy="remove-file"]').first().click()
    cy.get('[data-cy="file-item"]').should('have.length', 1)
  })

  it('maintains file order when removing files', () => {
    cy.mount(<FileUpload multiple={true} />)
    cy.get('[data-cy="file-input"]').selectFile([
      'cypress/fixtures/example.json',
      'cypress/fixtures/test-app.html'
    ], { force: true })
    
    // Remove the first file
    cy.get('[data-cy="file-item"]').first().find('[data-cy="remove-file"]').click()
    cy.get('[data-cy="file-name"]').should('contain', 'test-app.html')
  })

  it('handles upload errors gracefully', () => {
    const uploadSpy = cy.stub().throws(new Error('Upload failed')).as('uploadSpy')
    const errorSpy = cy.stub().as('errorSpy')
    cy.mount(<FileUpload onUpload={uploadSpy} onError={errorSpy} />)
    
    cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/example.json', { force: true })
    cy.get('[data-cy="upload-button"]').click()
    cy.get('@errorSpy').should('have.been.calledWith', 'Upload failed')
  })

  it('resets uploading state after error', () => {
    const uploadSpy = cy.stub().throws(new Error('Upload failed')).as('uploadSpy')
    cy.mount(<FileUpload onUpload={uploadSpy} />)
    
    cy.get('[data-cy="file-input"]').selectFile('cypress/fixtures/example.json', { force: true })
    cy.get('[data-cy="upload-button"]').click()
    cy.get('[data-cy="upload-button"]').should('contain', 'Upload Files')
  })
})
