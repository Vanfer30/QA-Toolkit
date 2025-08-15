import React from 'react'
import { Toast, ToastContainer, useToast } from '../../component/Toast'

describe('<Toast />', () => {
  it('renders toast with message', () => {
    cy.mount(<Toast message="Test message" />)
    cy.get('[data-cy="toast"]').should('be.visible')
    cy.get('[data-cy="toast-message"]').should('contain', 'Test message')
  })

  it('displays correct icon for each type', () => {
    cy.mount(<Toast message="Success" type="success" />)
    cy.get('[data-cy="toast-icon"]').should('contain', '✓')
    
    cy.mount(<Toast message="Error" type="error" />)
    cy.get('[data-cy="toast-icon"]').should('contain', '✕')
    
    cy.mount(<Toast message="Warning" type="warning" />)
    cy.get('[data-cy="toast-icon"]').should('contain', '⚠')
    
    cy.mount(<Toast message="Info" type="info" />)
    cy.get('[data-cy="toast-icon"]').should('contain', 'ℹ')
  })

  it('applies correct styles for each type', () => {
    cy.mount(<Toast message="Success" type="success" />)
    cy.get('[data-cy="toast"]').should('have.css', 'background-color', 'rgb(212, 237, 218)')
    
    cy.mount(<Toast message="Error" type="error" />)
    cy.get('[data-cy="toast"]').should('have.css', 'background-color', 'rgb(248, 215, 218)')
    
    cy.mount(<Toast message="Warning" type="warning" />)
    cy.get('[data-cy="toast"]').should('have.css', 'background-color', 'rgb(255, 243, 205)')
    
    cy.mount(<Toast message="Info" type="info" />)
    cy.get('[data-cy="toast"]').should('have.css', 'background-color', 'rgb(209, 236, 241)')
  })

  it('calls onClose when close button is clicked', () => {
    const closeSpy = cy.stub().as('closeSpy')
    cy.mount(<Toast message="Test" onClose={closeSpy} />)
    
    cy.get('[data-cy="toast-close"]').click()
    cy.get('@closeSpy').should('have.been.called')
  })

  it('auto-dismisses after specified duration', () => {
    const closeSpy = cy.stub().as('closeSpy')
    cy.mount(<Toast message="Test" duration={1000} onClose={closeSpy} />)
    
    cy.wait(1100) // Wait slightly longer than duration
    cy.get('@closeSpy').should('have.been.called')
  })

  it('does not auto-dismiss when duration is 0', () => {
    const closeSpy = cy.stub().as('closeSpy')
    cy.mount(<Toast message="Test" duration={0} onClose={closeSpy} />)
    
    cy.wait(2000) // Wait 2 seconds
    cy.get('@closeSpy').should('not.have.been.called')
    cy.get('[data-cy="toast"]').should('be.visible')
  })

  it('animates out when closing', () => {
    const closeSpy = cy.stub().as('closeSpy')
    cy.mount(<Toast message="Test" onClose={closeSpy} />)
    
    cy.get('[data-cy="toast-close"]').click()
    cy.get('[data-cy="toast"]').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 100, 0)')
    cy.get('[data-cy="toast"]').should('have.css', 'opacity', '0')
  })

  it('hides when show prop is false', () => {
    cy.mount(<Toast message="Test" show={false} />)
    cy.get('[data-cy="toast"]').should('not.exist')
  })

  it('shows when show prop changes to true', () => {
    const TestComponent = () => {
      const [show, setShow] = React.useState(false)
      return (
        <div>
          <button data-cy="show-toast" onClick={() => setShow(true)}>Show Toast</button>
          <Toast message="Test" show={show} />
        </div>
      )
    }
    
    cy.mount(<TestComponent />)
    cy.get('[data-cy="toast"]').should('not.exist')
    cy.get('[data-cy="show-toast"]').click()
    cy.get('[data-cy="toast"]').should('be.visible')
  })

  it('has proper accessibility attributes', () => {
    cy.mount(<Toast message="Test" />)
    cy.get('[data-cy="toast-close"]').should('have.attr', 'aria-label', 'Close notification')
  })
})

describe('<ToastContainer />', () => {
  it('renders container with correct positioning', () => {
    cy.mount(
      <ToastContainer position="top-right">
        <Toast message="Test" />
      </ToastContainer>
    )
    cy.get('[data-cy="toast-container"]').should('be.visible')
    cy.get('[data-cy="toast-container"]').should('have.css', 'top', '0px')
    cy.get('[data-cy="toast-container"]').should('have.css', 'right', '0px')
  })

  it('positions toasts correctly for different positions', () => {
    const positions = [
      { pos: 'top-left', top: '0px', left: '0px' },
      { pos: 'bottom-right', bottom: '0px', right: '0px' },
      { pos: 'bottom-left', bottom: '0px', left: '0px' },
      { pos: 'top-center', top: '0px', transform: 'translateX(-50%)' },
      { pos: 'bottom-center', bottom: '0px', transform: 'translateX(-50%)' }
    ]

    positions.forEach(({ pos, ...styles }) => {
      cy.mount(
        <ToastContainer position={pos as any}>
          <Toast message="Test" />
        </ToastContainer>
      )
      
      Object.entries(styles).forEach(([property, value]) => {
        cy.get('[data-cy="toast-container"]').should('have.css', property, value)
      })
    })
  })

  it('renders multiple toasts', () => {
    cy.mount(
      <ToastContainer>
        <Toast message="Toast 1" />
        <Toast message="Toast 2" />
        <Toast message="Toast 3" />
      </ToastContainer>
    )
    cy.get('[data-cy="toast"]').should('have.length', 3)
  })
})

describe('useToast hook', () => {
  const TestComponent = () => {
    const { toasts, showSuccess, showError, showWarning, showInfo, removeToast } = useToast()
    
    return (
      <div>
        <button data-cy="show-success" onClick={() => showSuccess('Success message')}>
          Show Success
        </button>
        <button data-cy="show-error" onClick={() => showError('Error message')}>
          Show Error
        </button>
        <button data-cy="show-warning" onClick={() => showWarning('Warning message')}>
          Show Warning
        </button>
        <button data-cy="show-info" onClick={() => showInfo('Info message')}>
          Show Info
        </button>
        <button data-cy="remove-first" onClick={() => toasts.length > 0 && removeToast(toasts[0].id)}>
          Remove First
        </button>
        
        <ToastContainer>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </ToastContainer>
      </div>
    )
  }

  it('shows success toast', () => {
    cy.mount(<TestComponent />)
    cy.get('[data-cy="show-success"]').click()
    cy.get('[data-cy="toast"]').should('contain', 'Success message')
    cy.get('[data-cy="toast-icon"]').should('contain', '✓')
  })

  it('shows error toast', () => {
    cy.mount(<TestComponent />)
    cy.get('[data-cy="show-error"]').click()
    cy.get('[data-cy="toast"]').should('contain', 'Error message')
    cy.get('[data-cy="toast-icon"]').should('contain', '✕')
  })

  it('shows warning toast', () => {
    cy.mount(<TestComponent />)
    cy.get('[data-cy="show-warning"]').click()
    cy.get('[data-cy="toast"]').should('contain', 'Warning message')
    cy.get('[data-cy="toast-icon"]').should('contain', '⚠')
  })

  it('shows info toast', () => {
    cy.mount(<TestComponent />)
    cy.get('[data-cy="show-info"]').click()
    cy.get('[data-cy="toast"]').should('contain', 'Info message')
    cy.get('[data-cy="toast-icon"]').should('contain', 'ℹ')
  })

  it('removes toast when close button is clicked', () => {
    cy.mount(<TestComponent />)
    cy.get('[data-cy="show-success"]').click()
    cy.get('[data-cy="toast"]').should('be.visible')
    cy.get('[data-cy="toast-close"]').click()
    cy.get('[data-cy="toast"]').should('not.exist')
  })

  it('removes toast programmatically', () => {
    cy.mount(<TestComponent />)
    cy.get('[data-cy="show-success"]').click()
    cy.get('[data-cy="show-error"]').click()
    cy.get('[data-cy="toast"]').should('have.length', 2)
    cy.get('[data-cy="remove-first"]').click()
    cy.get('[data-cy="toast"]').should('have.length', 1)
  })

  it('shows multiple toasts simultaneously', () => {
    cy.mount(<TestComponent />)
    cy.get('[data-cy="show-success"]').click()
    cy.get('[data-cy="show-error"]').click()
    cy.get('[data-cy="show-warning"]').click()
    cy.get('[data-cy="toast"]').should('have.length', 3)
  })

  it('auto-dismisses toasts with default duration', () => {
    cy.mount(<TestComponent />)
    cy.get('[data-cy="show-success"]').click()
    cy.get('[data-cy="toast"]').should('be.visible')
    cy.wait(5500) // Wait for auto-dismiss
    cy.get('[data-cy="toast"]').should('not.exist')
  })

  it('allows custom duration', () => {
    const TestComponentWithDuration = () => {
      const { toasts, addToast, removeToast } = useToast()
      
      return (
        <div>
          <button 
            data-cy="show-custom" 
            onClick={() => addToast({ message: 'Custom duration', duration: 2000 })}
          >
            Show Custom Duration
          </button>
          
          <ToastContainer>
            {toasts.map(toast => (
              <Toast
                key={toast.id}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </ToastContainer>
        </div>
      )
    }
    
    cy.mount(<TestComponentWithDuration />)
    cy.get('[data-cy="show-custom"]').click()
    cy.get('[data-cy="toast"]').should('be.visible')
    cy.wait(2100) // Wait for custom duration
    cy.get('[data-cy="toast"]').should('not.exist')
  })
})
