import React, { useState } from 'react'

type Step = {
  id: string
  title: string
  component: React.ComponentType<{
    data: any
    onChange: (data: any) => void
    onNext: () => void
    onPrevious: () => void
    isFirst: boolean
    isLast: boolean
  }>
  validation?: (data: any) => boolean
}

type MultiStepFormProps = {
  steps: Step[]
  initialData?: Record<string, any>
  onSubmit?: (data: Record<string, any>) => void
}

export default function MultiStepForm({ 
  steps, 
  initialData = {}, 
  onSubmit 
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentStepData = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  const updateFormData = (newData: any) => {
    setFormData(prev => ({ ...prev, ...newData }))
  }

  const validateCurrentStep = () => {
    if (currentStepData.validation) {
      return currentStepData.validation(formData)
    }
    return true
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (isLast) {
        onSubmit?.(formData)
      } else {
        setCurrentStep(currentStep + 1)
      }
    } else {
      setErrors({ [currentStepData.id]: 'Please complete all required fields' })
    }
  }

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div data-cy="multi-step-form">
      {/* Progress Bar */}
      <div data-cy="progress-bar" style={{ marginBottom: '20px' }}>
        <div 
          data-cy="progress-fill"
          style={{
            width: `${progressPercentage}%`,
            height: '4px',
            backgroundColor: '#007bff',
            transition: 'width 0.3s ease'
          }}
        />
        <div data-cy="step-indicators" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              data-cy={`step-${index}`}
              style={{
                padding: '8px 12px',
                borderRadius: '50%',
                backgroundColor: index <= currentStep ? '#007bff' : '#e9ecef',
                color: index <= currentStep ? 'white' : '#6c757d',
                fontSize: '12px'
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Step Title */}
      <h2 data-cy="step-title">{currentStepData.title}</h2>

      {/* Error Display */}
      {errors[currentStepData.id] && (
        <div data-cy="step-error" style={{ color: 'red', marginBottom: '10px' }}>
          {errors[currentStepData.id]}
        </div>
      )}

      {/* Step Content */}
      <div data-cy="step-content">
        <currentStepData.component
          data={formData}
          onChange={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirst={isFirst}
          isLast={isLast}
        />
      </div>

      {/* Navigation Buttons */}
      <div data-cy="step-navigation" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        {!isFirst && (
          <button
            data-cy="previous-button"
            onClick={handlePrevious}
            type="button"
          >
            Previous
          </button>
        )}
        <button
          data-cy="next-button"
          onClick={handleNext}
          type="button"
        >
          {isLast ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  )
}
