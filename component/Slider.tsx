import React, { useState, useEffect, useRef } from 'react'

type SliderProps = {
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  onAfterChange?: (value: number) => void
  disabled?: boolean
  showValue?: boolean
  marks?: Record<number, string>
  vertical?: boolean
}

export default function Slider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue,
  onChange,
  onAfterChange,
  disabled = false,
  showValue = true,
  marks = {},
  vertical = false
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? defaultValue ?? min)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  const currentValue = controlledValue ?? internalValue

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue)
    }
  }, [controlledValue])

  const handleChange = (newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue))
    const steppedValue = Math.round(clampedValue / step) * step
    
    if (controlledValue === undefined) {
      setInternalValue(steppedValue)
    }
    onChange?.(steppedValue)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    
    setIsDragging(true)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const clientX = e.clientX
    const clientY = e.clientY

    let percentage: number
    if (vertical) {
      percentage = 1 - (clientY - rect.top) / rect.height
    } else {
      percentage = (clientX - rect.left) / rect.width
    }

    percentage = Math.max(0, Math.min(1, percentage))
    const newValue = min + percentage * (max - min)
    handleChange(newValue)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    onAfterChange?.(currentValue)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return
    
    const rect = sliderRef.current?.getBoundingClientRect()
    if (!rect) return

    const clientX = e.clientX
    const clientY = e.clientY

    let percentage: number
    if (vertical) {
      percentage = 1 - (clientY - rect.top) / rect.height
    } else {
      percentage = (clientX - rect.left) / rect.width
    }

    percentage = Math.max(0, Math.min(1, percentage))
    const newValue = min + percentage * (max - min)
    handleChange(newValue)
    onAfterChange?.(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    let newValue = currentValue
    const stepAmount = e.shiftKey ? step * 10 : step

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault()
        newValue = currentValue - stepAmount
        break
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault()
        newValue = currentValue + stepAmount
        break
      case 'Home':
        e.preventDefault()
        newValue = min
        break
      case 'End':
        e.preventDefault()
        newValue = max
        break
      case 'PageDown':
        e.preventDefault()
        newValue = currentValue - stepAmount * 10
        break
      case 'PageUp':
        e.preventDefault()
        newValue = currentValue + stepAmount * 10
        break
      default:
        return
    }

    handleChange(newValue)
    onAfterChange?.(newValue)
  }

  const percentage = ((currentValue - min) / (max - min)) * 100

  const getMarkPositions = () => {
    return Object.keys(marks).map(key => {
      const markValue = Number(key)
      return {
        value: markValue,
        label: marks[markValue],
        position: ((markValue - min) / (max - min)) * 100
      }
    })
  }

  return (
    <div 
      data-cy="slider"
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: 'center',
        gap: '10px',
        opacity: disabled ? 0.6 : 1
      }}
    >
      {showValue && (
        <div 
          data-cy="slider-value"
          style={{
            minWidth: '40px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          {currentValue}
        </div>
      )}
      
      <div
        ref={sliderRef}
        data-cy="slider-track"
        onClick={handleClick}
        style={{
          position: 'relative',
          width: vertical ? '4px' : '200px',
          height: vertical ? '200px' : '4px',
          backgroundColor: '#e9ecef',
          borderRadius: '2px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          ...(vertical && {
            display: 'flex',
            flexDirection: 'column-reverse'
          })
        }}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        {/* Track fill */}
        <div
          data-cy="slider-fill"
          style={{
            position: 'absolute',
            backgroundColor: '#007bff',
            borderRadius: '2px',
            transition: isDragging ? 'none' : 'width 0.1s ease, height 0.1s ease',
            ...(vertical ? {
              bottom: 0,
              left: 0,
              width: '100%',
              height: `${percentage}%`
            } : {
              top: 0,
              left: 0,
              width: `${percentage}%`,
              height: '100%'
            })
          }}
        />

        {/* Marks */}
        {Object.keys(marks).length > 0 && getMarkPositions().map((mark) => (
          <div
            key={mark.value}
            data-cy={`slider-mark-${mark.value}`}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              backgroundColor: '#6c757d',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              ...(vertical ? {
                left: '50%',
                bottom: `${mark.position}%`
              } : {
                top: '50%',
                left: `${mark.position}%`
              })
            }}
            title={mark.label}
          />
        ))}

        {/* Thumb */}
        <div
          ref={thumbRef}
          data-cy="slider-thumb"
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            width: '16px',
            height: '16px',
            backgroundColor: '#007bff',
            border: '2px solid white',
            borderRadius: '50%',
            cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: isDragging ? 'none' : 'transform 0.1s ease',
            ...(vertical ? {
              left: '50%',
              bottom: `${percentage}%`
            } : {
              top: '50%',
              left: `${percentage}%`
            })
          }}
        />
      </div>

      {/* Min/Max labels */}
      <div
        data-cy="slider-labels"
        style={{
          display: 'flex',
          flexDirection: vertical ? 'column' : 'row',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#6c757d',
          ...(vertical ? {
            height: '200px',
            alignItems: 'center'
          } : {
            width: '200px'
          })
        }}
      >
        <span data-cy="slider-min">{min}</span>
        <span data-cy="slider-max">{max}</span>
      </div>
    </div>
  )
}
