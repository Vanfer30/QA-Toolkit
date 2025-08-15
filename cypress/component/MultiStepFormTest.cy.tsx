import React from 'react'
import MultiStepForm from '../../component/MultiStepForm'

// Mock step components
const Step1Component = ({ data, onChange, onNext, isFirst, isLast }: any) => (
  <div>
    <input
      data-cy="step1-input"
      value={data.step1 || ''}
      onChange={(e) => onChange({ step1: e.target.value })}
      placeholder="Step 1 input"
    />
    <button data-cy="step1-next" onClick={onNext}>Next</button>
  </div>
)

const Step2Component = ({ data, onChange, onNext, onPrevious, isFirst, isLast }: any) => (
  <div>
    <input
      data-cy="step2-input"
      value={data.step2 || ''}
      onChange={(e) => onChange({ step2: e.target.value })}
      placeholder="Step 2 input"
    />
    <button data-cy="step2-prev" onClick={onPrevious}>Previous</button>
    <button data-cy="step2-next" onClick={onNext}>Next</button>
  </div>
)

const Step3Component = ({ data, onChange, onPrevious, isFirst, isLast }: any) => (
  <div>
    <input
      data-cy="step3-input"
      value={data.step3 || ''}
      onChange={(e) => onChange({ step3: e.target.value })}
      placeholder="Step 3 input"
    />
    <button data-cy="step3-prev" onClick={onPrevious}>Previous</button>
    <button data-cy="step3-submit" type="submit">Submit</button>
  </div>
)

const steps = [
  {
    id: 'step1',
    title: 'Step 1',
    component: Step1Component,
    validation: (data: any) => data.step1 && data.step1.length > 0
  },
  {
    id: 'step2',
    title: 'Step 2',
    component: Step2Component,
    validation: (data: any) => data.step2 && data.step2.length > 0
  },
  {
    id: 'step3',
    title: 'Step 3',
    component: Step3Component,
    validation: (data: any) => data.step3 && data.step3.length > 0
  }
]

describe('<MultiStepForm />', () => {
  beforeEach(() => {
    cy.mount(<MultiStepForm steps={steps} />)
  })

  it('renders the first step by default', () => {
    cy.get('[data-cy="multi-step-form"]').should('be.visible')
    cy.get('[data-cy="step-title"]').should('contain', 'Step 1')
    cy.get('[data-cy="step1-input"]').should('be.visible')
  })

  it('shows progress bar and step indicators', () => {
    cy.get('[data-cy="progress-bar"]').should('be.visible')
    cy.get('[data-cy="step-0"]').should('be.visible')
    cy.get('[data-cy="step-1"]').should('be.visible')
    cy.get('[data-cy="step-2"]').should('be.visible')
  })

  it('shows correct progress percentage', () => {
    cy.get('[data-cy="progress-fill"]').should('have.css', 'width', '33.3333%')
  })

  it('navigates to next step when valid', () => {
    cy.get('[data-cy="step1-input"]').type('test value')
    cy.get('[data-cy="step1-next"]').click()
    
    cy.get('[data-cy="step-title"]').should('contain', 'Step 2')
    cy.get('[data-cy="step2-input"]').should('be.visible')
    cy.get('[data-cy="progress-fill"]').should('have.css', 'width', '66.6667%')
  })

  it('shows error when trying to proceed without validation', () => {
    cy.get('[data-cy="step1-next"]').click()
    cy.get('[data-cy="step-error"]').should('contain', 'Please complete all required fields')
  })

  it('navigates back to previous step', () => {
    // Go to step 2
    cy.get('[data-cy="step1-input"]').type('test value')
    cy.get('[data-cy="step1-next"]').click()
    
    // Go back to step 1
    cy.get('[data-cy="step2-prev"]').click()
    cy.get('[data-cy="step-title"]').should('contain', 'Step 1')
    cy.get('[data-cy="step1-input"]').should('be.visible')
  })

  it('completes the entire form flow', () => {
    // Step 1
    cy.get('[data-cy="step1-input"]').type('step 1 value')
    cy.get('[data-cy="step1-next"]').click()
    
    // Step 2
    cy.get('[data-cy="step-title"]').should('contain', 'Step 2')
    cy.get('[data-cy="step2-input"]').type('step 2 value')
    cy.get('[data-cy="step2-next"]').click()
    
    // Step 3
    cy.get('[data-cy="step-title"]').should('contain', 'Step 3')
    cy.get('[data-cy="step3-input"]').type('step 3 value')
    cy.get('[data-cy="progress-fill"]').should('have.css', 'width', '100%')
  })

  it('calls onSubmit with form data when completed', () => {
    const submitSpy = cy.stub().as('submitSpy')
    cy.mount(<MultiStepForm steps={steps} onSubmit={submitSpy} />)
    
    // Complete all steps
    cy.get('[data-cy="step1-input"]').type('step 1 value')
    cy.get('[data-cy="step1-next"]').click()
    
    cy.get('[data-cy="step2-input"]').type('step 2 value')
    cy.get('[data-cy="step2-next"]').click()
    
    cy.get('[data-cy="step3-input"]').type('step 3 value')
    cy.get('[data-cy="next-button"]').click()
    
    cy.get('@submitSpy').should('have.been.calledWith', {
      step1: 'step 1 value',
      step2: 'step 2 value',
      step3: 'step 3 value'
    })
  })

  it('preserves form data when navigating between steps', () => {
    cy.get('[data-cy="step1-input"]').type('step 1 value')
    cy.get('[data-cy="step1-next"]').click()
    
    cy.get('[data-cy="step2-input"]').type('step 2 value')
    cy.get('[data-cy="step2-prev"]').click()
    
    cy.get('[data-cy="step1-input"]').should('have.value', 'step 1 value')
  })

  it('shows correct button text on last step', () => {
    // Navigate to last step
    cy.get('[data-cy="step1-input"]').type('test')
    cy.get('[data-cy="step1-next"]').click()
    cy.get('[data-cy="step2-input"]').type('test')
    cy.get('[data-cy="step2-next"]').click()
    
    cy.get('[data-cy="next-button"]').should('contain', 'Submit')
  })

  it('handles initial data correctly', () => {
    const initialData = { step1: 'initial value' }
    cy.mount(<MultiStepForm steps={steps} initialData={initialData} />)
    
    cy.get('[data-cy="step1-input"]').should('have.value', 'initial value')
  })

  it('clears errors when navigating back', () => {
    cy.get('[data-cy="step1-next"]').click()
    cy.get('[data-cy="step-error"]').should('be.visible')
    
    cy.get('[data-cy="step1-input"]').type('test value')
    cy.get('[data-cy="step1-next"]').click()
    cy.get('[data-cy="step-error"]').should('not.exist')
  })

  it('updates step indicators correctly', () => {
    cy.get('[data-cy="step-0"]').should('have.css', 'background-color', 'rgb(0, 123, 255)')
    cy.get('[data-cy="step-1"]').should('have.css', 'background-color', 'rgb(233, 236, 239)')
    cy.get('[data-cy="step-2"]').should('have.css', 'background-color', 'rgb(233, 236, 239)')
    
    cy.get('[data-cy="step1-input"]').type('test')
    cy.get('[data-cy="step1-next"]').click()
    
    cy.get('[data-cy="step-0"]').should('have.css', 'background-color', 'rgb(0, 123, 255)')
    cy.get('[data-cy="step-1"]').should('have.css', 'background-color', 'rgb(0, 123, 255)')
    cy.get('[data-cy="step-2"]').should('have.css', 'background-color', 'rgb(233, 236, 239)')
  })
})
