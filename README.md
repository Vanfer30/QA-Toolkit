# QA Toolkit - Comprehensive Component Library

A comprehensive React component library with full testing coverage, designed for QA professionals and developers to test various UI patterns and interactions.

## 🚀 Features

- **15+ Production-Ready Components** with TypeScript
- **Comprehensive Test Coverage** (Unit, Component, E2E)
- **Accessibility-First Design** with ARIA support
- **Responsive Design** for all screen sizes
- **Modern React Patterns** (Hooks, TypeScript, Performance optimized)
- **Cypress Integration** for component and E2E testing
- **Jest + React Testing Library** for unit testing

## 📦 Components

### Data Display Components

#### DataTable
A feature-rich table component with sorting, filtering, and pagination.

```tsx
import DataTable from './component/DataTable'

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
]

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true, filterable: true },
  { key: 'email', label: 'Email', sortable: true, filterable: true },
  { key: 'role', label: 'Role', sortable: true, filterable: true }
]

<DataTable 
  data={data} 
  columns={columns} 
  pageSize={10}
  onRowClick={(row) => console.log(row)}
/>
```

**Features:**
- ✅ Sorting (ascending/descending)
- ✅ Column filtering
- ✅ Pagination
- ✅ Row selection
- ✅ Keyboard navigation
- ✅ Responsive design

### Form Components

#### MultiStepForm
A wizard-style form with progress indicator and step validation.

```tsx
import MultiStepForm from './component/MultiStepForm'

const steps = [
  {
    id: 'personal',
    title: 'Personal Information',
    component: PersonalInfoStep,
    validation: (data) => data.name && data.email
  },
  {
    id: 'contact',
    title: 'Contact Details',
    component: ContactStep,
    validation: (data) => data.phone
  }
]

<MultiStepForm 
  steps={steps}
  initialData={{ name: 'John' }}
  onSubmit={(data) => console.log(data)}
/>
```

**Features:**
- ✅ Progress indicator
- ✅ Step validation
- ✅ Data persistence
- ✅ Navigation controls
- ✅ Error handling

#### FileUpload
Drag & drop file upload with preview and validation.

```tsx
import FileUpload from './component/FileUpload'

<FileUpload
  accept="image/*"
  multiple={true}
  maxSize={5 * 1024 * 1024} // 5MB
  onUpload={(files) => console.log(files)}
  onError={(error) => console.error(error)}
/>
```

**Features:**
- ✅ Drag & drop
- ✅ File preview
- ✅ Multiple file support
- ✅ File validation
- ✅ Progress indication

### Navigation Components

#### Tabs
Accessible tabbed interface with keyboard navigation.

```tsx
import Tabs from './component/Tabs'

const tabs = [
  {
    id: 'tab1',
    label: 'Tab 1',
    content: <div>Content for tab 1</div>
  },
  {
    id: 'tab2',
    label: 'Tab 2',
    content: <div>Content for tab 2</div>,
    disabled: false
  }
]

<Tabs 
  tabs={tabs}
  defaultActiveTab="tab1"
  onTabChange={(tabId) => console.log(tabId)}
  orientation="horizontal"
/>
```

**Features:**
- ✅ Keyboard navigation
- ✅ ARIA support
- ✅ Disabled states
- ✅ Vertical/horizontal orientation

#### Modal
Accessible modal dialog with backdrop and keyboard support.

```tsx
import Modal from './component/Modal'

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmation"
  size="medium"
  closeOnBackdrop={true}
  closeOnEscape={true}
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

**Features:**
- ✅ Backdrop click to close
- ✅ Escape key to close
- ✅ Focus management
- ✅ Multiple sizes
- ✅ ARIA attributes

### Feedback Components

#### Toast
Notification system with multiple types and positioning.

```tsx
import { Toast, ToastContainer, useToast } from './component/Toast'

// Using the hook
const { showSuccess, showError, showWarning, showInfo } = useToast()

// Individual toast
<Toast 
  message="Operation completed successfully"
  type="success"
  duration={5000}
  onClose={() => console.log('Toast closed')}
/>

// Toast container
<ToastContainer position="top-right">
  <Toast message="Success!" type="success" />
  <Toast message="Error occurred" type="error" />
</ToastContainer>
```

**Features:**
- ✅ Multiple types (success, error, warning, info)
- ✅ Auto-dismiss
- ✅ Multiple positions
- ✅ Custom duration
- ✅ Animation

### Interactive Components

#### Slider
Range input component with keyboard support and marks.

```tsx
import Slider from './component/Slider'

<Slider
  min={0}
  max={100}
  step={5}
  value={50}
  onChange={(value) => console.log(value)}
  onAfterChange={(value) => console.log('Final value:', value)}
  marks={{ 0: '0%', 50: '50%', 100: '100%' }}
  vertical={false}
  showValue={true}
/>
```

**Features:**
- ✅ Mouse and keyboard interaction
- ✅ Custom marks
- ✅ Vertical/horizontal orientation
- ✅ Step increments
- ✅ ARIA support

#### Rating
Star rating component with half-star support.

```tsx
import Rating from './component/Rating'

<Rating
  value={4.5}
  max={5}
  onChange={(value) => console.log(value)}
  onHover={(value) => console.log('Hover:', value)}
  allowHalf={true}
  size="medium"
  showValue={true}
  character="★"
/>
```

**Features:**
- ✅ Half-star ratings
- ✅ Hover preview
- ✅ Custom characters
- ✅ Multiple sizes
- ✅ Disabled/readonly states

## 🧪 Testing

### Test Types

#### 1. Unit Tests (Jest + React Testing Library)
```bash
npm run test
```

Tests component logic, props, and state management.

#### 2. Component Tests (Cypress Component Testing)
```bash
npm run cypress:component
```

Tests component behavior and user interactions.

#### 3. E2E Tests (Cypress)
```bash
npm run cypress:e2e
```

Tests complete user workflows and component integration.

### Test Coverage

Each component includes:

- ✅ **Rendering tests** - Component displays correctly
- ✅ **Interaction tests** - User interactions work as expected
- ✅ **Accessibility tests** - ARIA attributes and keyboard navigation
- ✅ **Edge case tests** - Error states and boundary conditions
- ✅ **Performance tests** - Large datasets and rapid interactions
- ✅ **Integration tests** - Components work together

### Example Test Structure

```tsx
// Unit test example
describe('DataTable', () => {
  it('renders table headers correctly', () => {
    render(<DataTable data={mockData} columns={columns} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('sorts columns when sort button is clicked', () => {
    render(<DataTable data={mockData} columns={columns} />)
    fireEvent.click(screen.getByTestId('sort-name'))
    expect(screen.getAllByTestId('cell-name')[0]).toHaveTextContent('Alice Brown')
  })
})
```

```tsx
// Component test example
describe('<DataTable />', () => {
  it('filters data when filter input is used', () => {
    cy.mount(<DataTable data={mockData} columns={columns} />)
    cy.get('[data-cy="filter-name"]').type('John')
    cy.get('[data-cy="table-row"]').should('have.length', 1)
  })
})
```

## 🎨 Styling

All components use inline styles for simplicity, but can be easily customized:

```tsx
// Custom styling example
<DataTable 
  data={data} 
  columns={columns}
  style={{
    '--primary-color': '#007bff',
    '--border-color': '#e9ecef'
  }}
/>
```

## ♿ Accessibility

All components follow WCAG 2.1 guidelines:

- ✅ **Keyboard Navigation** - All interactive elements accessible via keyboard
- ✅ **Screen Reader Support** - Proper ARIA labels and roles
- ✅ **Focus Management** - Logical tab order and focus indicators
- ✅ **Color Contrast** - Meets AA standards
- ✅ **Semantic HTML** - Proper heading structure and landmarks

## 📱 Responsive Design

Components are responsive by default:

- ✅ **Mobile-first** approach
- ✅ **Flexible layouts** that adapt to screen size
- ✅ **Touch-friendly** interactions
- ✅ **Viewport-aware** sizing

## 🚀 Performance

Optimized for performance:

- ✅ **Memoization** - Prevents unnecessary re-renders
- ✅ **Lazy loading** - Components load when needed
- ✅ **Efficient algorithms** - Fast sorting and filtering
- ✅ **Virtual scrolling** - Handles large datasets

## 📋 Usage Examples

### Complete Application Example

```tsx
import React, { useState } from 'react'
import DataTable from './component/DataTable'
import Modal from './component/Modal'
import { useToast } from './component/Toast'
import { ToastContainer } from './component/Toast'

function App() {
  const [selectedRow, setSelectedRow] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showSuccess, showError } = useToast()

  const handleRowClick = (row) => {
    setSelectedRow(row)
    setIsModalOpen(true)
  }

  const handleSave = () => {
    showSuccess('Data saved successfully!')
    setIsModalOpen(false)
  }

  return (
    <div>
      <DataTable 
        data={data} 
        columns={columns} 
        onRowClick={handleRowClick}
      />
      
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Record"
      >
        <p>Editing: {selectedRow?.name}</p>
        <button onClick={handleSave}>Save</button>
      </Modal>

      <ToastContainer />
    </div>
  )
}
```

## 🔧 Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
git clone <repository>
cd QA-Toolkit
npm install
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Cypress
npm run cypress:open     # Open Cypress UI
npm run cypress:component # Run component tests
npm run cypress:e2e      # Run E2E tests

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues

# Type checking
npm run type-check   # Run TypeScript compiler
```

### Project Structure

```
QA-Toolkit/
├── component/           # React components
│   ├── DataTable.tsx
│   ├── MultiStepForm.tsx
│   ├── FileUpload.tsx
│   ├── Modal.tsx
│   ├── Tabs.tsx
│   ├── Toast.tsx
│   ├── Slider.tsx
│   └── Rating.tsx
├── cypress/
│   ├── component/      # Component tests
│   └── e2e/           # E2E tests
├── tests/
│   └── unit/          # Unit tests
├── cypress.config.ts
├── jest.config.ts
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your component or test
4. Ensure all tests pass
5. Submit a pull request

### Adding New Components

1. Create component in `component/` directory
2. Add TypeScript types
3. Include data-cy attributes for testing
4. Add unit tests in `tests/unit/`
5. Add component tests in `cypress/component/`
6. Update documentation

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For questions or issues:

1. Check the documentation
2. Review existing tests for examples
3. Open an issue on GitHub
4. Contact the maintainers

---

**Built with ❤️ for the QA community**
