import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import LoginForm from '../component/LoginForm'
import DataTable from '../component/DataTable'
import FileUpload from '../component/FileUpload'
import Modal from '../component/Modal'
import Tabs from '../component/Tabs'
import { Toast } from '../component/Toast'
import MultiStepForm from '../component/MultiStepForm'
import SearchFilter from '../component/SearchFilter'
import UserCard from '../component/UserCard'
import UserCardForm from '../component/UserCardForm'

// Mock data for DataTable
const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' }
]

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true, filterable: true },
  { key: 'email', label: 'Email', sortable: true, filterable: true },
  { key: 'role', label: 'Role', sortable: true, filterable: true }
]

// Mock steps for MultiStepForm
const steps = [
  {
    id: 'step1',
    title: 'Step 1',
    component: ({ data, onChange }: any) => (
      <div>
        <input
          data-cy="step1-input"
          value={data.step1 || ''}
          onChange={(e) => onChange({ step1: e.target.value })}
          placeholder="Step 1 input"
        />
      </div>
    ),
    validation: (data: any) => data.step1 && data.step1.length > 0
  },
  {
    id: 'step2',
    title: 'Step 2',
    component: ({ data, onChange }: any) => (
      <div>
        <input
          data-cy="step2-input"
          value={data.step2 || ''}
          onChange={(e) => onChange({ step2: e.target.value })}
          placeholder="Step 2 input"
        />
      </div>
    ),
    validation: (data: any) => data.step2 && data.step2.length > 0
  },
  {
    id: 'step3',
    title: 'Step 3',
    component: ({ data, onChange }: any) => (
      <div>
        <input
          data-cy="step3-input"
          value={data.step3 || ''}
          onChange={(e) => onChange({ step3: e.target.value })}
          placeholder="Step 3 input"
        />
      </div>
    ),
    validation: (data: any) => data.step3 && data.step3.length > 0
  }
]

function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('tab1')
  const [showToast, setShowToast] = React.useState(false)

  const tabs = [
    { id: 'tab1', label: 'Tab 1', content: 'Content for tab 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content for tab 2' },
    { id: 'tab3', label: 'Tab 3', content: 'Content for tab 3' }
  ]

  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
          <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
          <Link to="/search" style={{ marginRight: '10px' }}>Search</Link>
        </nav>

        <Routes>
          <Route path="/" element={
            <div>
              <h1>QA Toolkit Component Showcase</h1>
              <DataTable data={mockData} columns={columns} />
              <MultiStepForm steps={steps} />
              <FileUpload />
              <button data-cy="open-modal" onClick={() => setIsModalOpen(true)}>
                Open Modal
              </button>
              <Tabs 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
              />
              <button data-cy="show-success" onClick={() => setShowToast(true)}>
                Show Success Toast
              </button>
              <button data-cy="show-error" onClick={() => setShowToast(true)}>
                Show Error Toast
              </button>
              <SearchFilter />
              <UserCard 
                name="John Doe"
                email="john@example.com"
                role="Admin"
              />
            </div>
          } />
          
          <Route path="/login" element={<LoginForm />} />
          
          <Route path="/register" element={
            <div>
              <h1>Register</h1>
              <form>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <input type="password" placeholder="Confirm Password" />
                <button type="submit">Register</button>
              </form>
            </div>
          } />
          
          <Route path="/search" element={
            <div>
              <h1>Search</h1>
              <SearchFilter />
            </div>
          } />
        </Routes>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Test Modal">
          <div data-cy="modal-content">
            <p>This is a test modal content</p>
            <button data-cy="modal-close" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </div>
        </Modal>

        {showToast && (
          <Toast
            message="Success message"
            type="success"
            show={showToast}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </Router>
  )
}

export default App
