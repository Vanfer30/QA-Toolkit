import React, { useState } from 'react'
import Modal from '../../component/Modal'

const TestModal = ({ isOpen, onClose, ...props }: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <div>Modal content goes here</div>
    </Modal>
  )
}

const TestApp = ({ modalProps = {} }: { modalProps?: any }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>
      <button data-cy="open-modal" onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      <TestModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        {...modalProps}
      />
    </div>
  )
}

describe('<Modal />', () => {
  it('renders modal when isOpen is true', () => {
    cy.mount(<TestModal isOpen={true} onClose={() => {}} />)
    cy.get('[data-cy="modal-backdrop"]').should('be.visible')
    cy.get('[data-cy="modal-content"]').should('be.visible')
  })

  it('does not render when isOpen is false', () => {
    cy.mount(<TestModal isOpen={false} onClose={() => {}} />)
    cy.get('[data-cy="modal-backdrop"]').should('not.exist')
  })

  it('displays title when provided', () => {
    cy.mount(<TestModal isOpen={true} onClose={() => {}} title="Test Modal" />)
    cy.get('[data-cy="modal-title"]').should('contain', 'Test Modal')
  })

  it('renders children content', () => {
    cy.mount(<TestModal isOpen={true} onClose={() => {}}>Custom content</TestModal>)
    cy.get('[data-cy="modal-body"]').should('contain', 'Custom content')
  })

  it('calls onClose when close button is clicked', () => {
    const closeSpy = cy.stub().as('closeSpy')
    cy.mount(<TestModal isOpen={true} onClose={closeSpy} />)
    
    cy.get('[data-cy="modal-close"]').click()
    cy.get('@closeSpy').should('have.been.called')
  })

  it('calls onClose when backdrop is clicked', () => {
    const closeSpy = cy.stub().as('closeSpy')
    cy.mount(<TestModal isOpen={true} onClose={closeSpy} closeOnBackdrop={true} />)
    
    cy.get('[data-cy="modal-backdrop"]').click({ force: true })
    cy.get('@closeSpy').should('have.been.called')
  })

  it('does not call onClose when backdrop is clicked and closeOnBackdrop is false', () => {
    const closeSpy = cy.stub().as('closeSpy')
    cy.mount(<TestModal isOpen={true} onClose={closeSpy} closeOnBackdrop={false} />)
    
    cy.get('[data-cy="modal-backdrop"]').click({ force: true })
    cy.get('@closeSpy').should('not.have.been.called')
  })

  it('calls onClose when Escape key is pressed', () => {
    const closeSpy = cy.stub().as('closeSpy')
    cy.mount(<TestModal isOpen={true} onClose={closeSpy} closeOnEscape={true} />)
    
    cy.get('body').type('{esc}')
    cy.get('@closeSpy').should('have.been.called')
  })

  it('does not call onClose when Escape key is pressed and closeOnEscape is false', () => {
    const closeSpy = cy.stub().as('closeSpy')
    cy.mount(<TestModal isOpen={true} onClose={closeSpy} closeOnEscape={false} />)
    
    cy.get('body').type('{esc}')
    cy.get('@closeSpy').should('not.have.been.called')
  })

  it('prevents body scroll when modal is open', () => {
    cy.mount(<TestModal isOpen={true} onClose={() => {}} />)
    cy.get('body').should('have.css', 'overflow', 'hidden')
  })

  it('restores body scroll when modal is closed', () => {
    cy.mount(<TestApp />)
    cy.get('[data-cy="open-modal"]').click()
    cy.get('body').should('have.css', 'overflow', 'hidden')
    
    cy.get('[data-cy="modal-close"]').click()
    cy.get('body').should('have.css', 'overflow', 'unset')
  })

  it('applies correct size styles', () => {
    cy.mount(<TestModal isOpen={true} onClose={() => {}} size="small" />)
    cy.get('[data-cy="modal-content"]').should('have.css', 'width', '400px')
    
    cy.mount(<TestModal isOpen={true} onClose={() => {}} size="large" />)
    cy.get('[data-cy="modal-content"]').should('have.css', 'width', '800px')
  })

  it('has proper ARIA attributes', () => {
    cy.mount(<TestModal isOpen={true} onClose={() => {}} title="Test Modal" />)
    cy.get('[data-cy="modal-backdrop"]').should('have.attr', 'role', 'dialog')
    cy.get('[data-cy="modal-backdrop"]').should('have.attr', 'aria-modal', 'true')
    cy.get('[data-cy="modal-backdrop"]').should('have.attr', 'aria-labelledby', 'modal-title')
    cy.get('[data-cy="modal-content"]').should('have.attr', 'role', 'document')
  })

  it('focuses close button on hover', () => {
    cy.mount(<TestModal isOpen={true} onClose={() => {}} />)
    cy.get('[data-cy="modal-close"]').trigger('mouseenter')
    cy.get('[data-cy="modal-close"]').should('have.css', 'background-color', 'rgb(248, 249, 250)')
  })

  it('handles multiple modals correctly', () => {
    const closeSpy1 = cy.stub().as('closeSpy1')
    const closeSpy2 = cy.stub().as('closeSpy2')
    
    cy.mount(
      <div>
        <TestModal isOpen={true} onClose={closeSpy1} title="Modal 1" />
        <TestModal isOpen={true} onClose={closeSpy2} title="Modal 2" />
      </div>
    )
    
    cy.get('[data-cy="modal-backdrop"]').should('have.length', 2)
    cy.get('[data-cy="modal-title"]').should('have.length', 2)
  })

  it('handles dynamic content changes', () => {
    const DynamicModal = ({ isOpen, onClose }: any) => {
      const [content, setContent] = useState('Initial content')
      
      return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <div>
            <div data-cy="modal-content-text">{content}</div>
            <button data-cy="change-content" onClick={() => setContent('Updated content')}>
              Change Content
            </button>
          </div>
        </Modal>
      )
    }
    
    cy.mount(<DynamicModal isOpen={true} onClose={() => {}} />)
    cy.get('[data-cy="modal-content-text"]').should('contain', 'Initial content')
    cy.get('[data-cy="change-content"]').click()
    cy.get('[data-cy="modal-content-text"]').should('contain', 'Updated content')
  })

  it('handles long content with scrolling', () => {
    const longContent = Array.from({ length: 50 }, (_, i) => 
      `<div key=${i}>Line ${i + 1}</div>`
    ).join('')
    
    cy.mount(
      <Modal isOpen={true} onClose={() => {}}>
        <div dangerouslySetInnerHTML={{ __html: longContent }} />
      </Modal>
    )
    
    cy.get('[data-cy="modal-body"]').should('have.css', 'overflow', 'auto')
  })

  it('maintains focus management', () => {
    cy.mount(<TestModal isOpen={true} onClose={() => {}} />)
    cy.get('[data-cy="modal-close"]').should('be.focused')
  })

  it('handles rapid open/close cycles', () => {
    cy.mount(<TestApp />)
    
    // Open and close rapidly
    for (let i = 0; i < 3; i++) {
      cy.get('[data-cy="open-modal"]').click()
      cy.get('[data-cy="modal-close"]').click()
    }
    
    cy.get('[data-cy="modal-backdrop"]').should('not.exist')
  })
})
