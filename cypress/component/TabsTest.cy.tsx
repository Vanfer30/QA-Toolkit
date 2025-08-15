import React from 'react'
import Tabs from '../../component/Tabs'

const tabs = [
  {
    id: 'tab1',
    label: 'Tab 1',
    content: <div data-cy="tab1-content">Content for tab 1</div>
  },
  {
    id: 'tab2',
    label: 'Tab 2',
    content: <div data-cy="tab2-content">Content for tab 2</div>
  },
  {
    id: 'tab3',
    label: 'Tab 3',
    content: <div data-cy="tab3-content">Content for tab 3</div>
  },
  {
    id: 'tab4',
    label: 'Disabled Tab',
    content: <div data-cy="tab4-content">Disabled content</div>,
    disabled: true
  }
]

describe('<Tabs />', () => {
  beforeEach(() => {
    cy.mount(<Tabs tabs={tabs} />)
  })

  it('renders all tabs', () => {
    cy.get('[data-cy="tabs"]').should('be.visible')
    cy.get('[data-cy="tab-tab1"]').should('contain', 'Tab 1')
    cy.get('[data-cy="tab-tab2"]').should('contain', 'Tab 2')
    cy.get('[data-cy="tab-tab3"]').should('contain', 'Tab 3')
    cy.get('[data-cy="tab-tab4"]').should('contain', 'Disabled Tab')
  })

  it('shows first tab as active by default', () => {
    cy.get('[data-cy="tab-tab1"]').should('have.attr', 'aria-selected', 'true')
    cy.get('[data-cy="tab-tab2"]').should('have.attr', 'aria-selected', 'false')
    cy.get('[data-cy="tab-tab3"]').should('have.attr', 'aria-selected', 'false')
  })

  it('displays content for active tab', () => {
    cy.get('[data-cy="tab-panel"]').should('contain', 'Content for tab 1')
    cy.get('[data-cy="tab1-content"]').should('be.visible')
  })

  it('switches to clicked tab', () => {
    cy.get('[data-cy="tab-tab2"]').click()
    cy.get('[data-cy="tab-tab2"]').should('have.attr', 'aria-selected', 'true')
    cy.get('[data-cy="tab-tab1"]').should('have.attr', 'aria-selected', 'false')
    cy.get('[data-cy="tab-panel"]').should('contain', 'Content for tab 2')
  })

  it('calls onTabChange when tab is clicked', () => {
    const tabChangeSpy = cy.stub().as('tabChangeSpy')
    cy.mount(<Tabs tabs={tabs} onTabChange={tabChangeSpy} />)
    
    cy.get('[data-cy="tab-tab2"]').click()
    cy.get('@tabChangeSpy').should('have.been.calledWith', 'tab2')
  })

  it('disables disabled tabs', () => {
    cy.get('[data-cy="tab-tab4"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[data-cy="tab-tab4"]').should('have.css', 'cursor', 'not-allowed')
  })

  it('does not switch to disabled tab when clicked', () => {
    cy.get('[data-cy="tab-tab4"]').click()
    cy.get('[data-cy="tab-tab4"]').should('have.attr', 'aria-selected', 'false')
    cy.get('[data-cy="tab-tab1"]').should('have.attr', 'aria-selected', 'true')
  })

  it('navigates with arrow keys', () => {
    cy.get('[data-cy="tab-tab1"]').focus()
    cy.get('[data-cy="tab-tab1"]').type('{rightarrow}')
    cy.get('[data-cy="tab-tab2"]').should('be.focused')
    
    cy.get('[data-cy="tab-tab2"]').type('{rightarrow}')
    cy.get('[data-cy="tab-tab3"]').should('be.focused')
  })

  it('navigates with arrow keys in reverse', () => {
    cy.get('[data-cy="tab-tab2"]').click()
    cy.get('[data-cy="tab-tab2"]').focus()
    cy.get('[data-cy="tab-tab2"]').type('{leftarrow}')
    cy.get('[data-cy="tab-tab1"]').should('be.focused')
  })

  it('wraps around with arrow keys', () => {
    cy.get('[data-cy="tab-tab1"]').focus()
    cy.get('[data-cy="tab-tab1"]').type('{leftarrow}')
    cy.get('[data-cy="tab-tab3"]').should('be.focused') // Should wrap to last enabled tab
  })

  it('navigates to first tab with Home key', () => {
    cy.get('[data-cy="tab-tab3"]').click()
    cy.get('[data-cy="tab-tab3"]').focus()
    cy.get('[data-cy="tab-tab3"]').type('{home}')
    cy.get('[data-cy="tab-tab1"]').should('be.focused')
  })

  it('navigates to last tab with End key', () => {
    cy.get('[data-cy="tab-tab1"]').focus()
    cy.get('[data-cy="tab-tab1"]').type('{end}')
    cy.get('[data-cy="tab-tab3"]').should('be.focused') // Should focus last enabled tab
  })

  it('activates tab with Enter key', () => {
    cy.get('[data-cy="tab-tab2"]').focus()
    cy.get('[data-cy="tab-tab2"]').type('{enter}')
    cy.get('[data-cy="tab-tab2"]').should('have.attr', 'aria-selected', 'true')
    cy.get('[data-cy="tab-panel"]').should('contain', 'Content for tab 2')
  })

  it('activates tab with Space key', () => {
    cy.get('[data-cy="tab-tab2"]').focus()
    cy.get('[data-cy="tab-tab2"]').type(' ')
    cy.get('[data-cy="tab-tab2"]').should('have.attr', 'aria-selected', 'true')
  })

  it('skips disabled tabs in keyboard navigation', () => {
    cy.get('[data-cy="tab-tab1"]').focus()
    cy.get('[data-cy="tab-tab1"]').type('{rightarrow}')
    cy.get('[data-cy="tab-tab2"]').should('be.focused')
    
    cy.get('[data-cy="tab-tab2"]').type('{rightarrow}')
    cy.get('[data-cy="tab-tab3"]').should('be.focused') // Should skip disabled tab4
  })

  it('sets default active tab when provided', () => {
    cy.mount(<Tabs tabs={tabs} defaultActiveTab="tab2" />)
    cy.get('[data-cy="tab-tab2"]').should('have.attr', 'aria-selected', 'true')
    cy.get('[data-cy="tab-panel"]').should('contain', 'Content for tab 2')
  })

  it('handles vertical orientation', () => {
    cy.mount(<Tabs tabs={tabs} orientation="vertical" />)
    cy.get('[data-cy="tabs"]').should('have.css', 'flex-direction', 'row')
    cy.get('[role="tablist"]').should('have.attr', 'aria-orientation', 'vertical')
  })

  it('handles empty tabs array', () => {
    cy.mount(<Tabs tabs={[]} />)
    cy.get('[data-cy="tabs"]').should('be.visible')
    cy.get('[role="tab"]').should('not.exist')
  })

  it('updates active tab when defaultActiveTab changes', () => {
    cy.mount(<Tabs tabs={tabs} defaultActiveTab="tab1" />)
    cy.get('[data-cy="tab-tab1"]').should('have.attr', 'aria-selected', 'true')
    
    cy.mount(<Tabs tabs={tabs} defaultActiveTab="tab2" />)
    cy.get('[data-cy="tab-tab2"]').should('have.attr', 'aria-selected', 'true')
  })

  it('maintains focus state correctly', () => {
    cy.get('[data-cy="tab-tab1"]').focus()
    cy.get('[data-cy="tab-tab1"]').should('have.css', 'outline', '2px solid rgb(0, 123, 255)')
    
    cy.get('[data-cy="tab-tab1"]').blur()
    cy.get('[data-cy="tab-tab1"]').should('have.css', 'outline', 'none')
  })

  it('handles dynamic tab content changes', () => {
    const DynamicTabs = () => {
      const [content, setContent] = React.useState('Initial content')
      
      const dynamicTabs = [
        {
          id: 'dynamic',
          label: 'Dynamic Tab',
          content: (
            <div>
              <div data-cy="dynamic-content">{content}</div>
              <button data-cy="change-content" onClick={() => setContent('Updated content')}>
                Change Content
              </button>
            </div>
          )
        }
      ]
      
      return <Tabs tabs={dynamicTabs} />
    }
    
    cy.mount(<DynamicTabs />)
    cy.get('[data-cy="dynamic-content"]').should('contain', 'Initial content')
    cy.get('[data-cy="change-content"]').click()
    cy.get('[data-cy="dynamic-content"]').should('contain', 'Updated content')
  })

  it('has proper ARIA attributes', () => {
    cy.get('[role="tablist"]').should('have.attr', 'aria-orientation', 'horizontal')
    cy.get('[data-cy="tab-tab1"]').should('have.attr', 'aria-controls', 'panel-tab1')
    cy.get('[data-cy="tab-panel"]').should('have.attr', 'aria-labelledby', 'tab-tab1')
  })
})
