import React, { useState } from 'react'

type RatingProps = {
  value?: number
  defaultValue?: number
  max?: number
  onChange?: (value: number) => void
  onHover?: (value: number) => void
  disabled?: boolean
  readonly?: boolean
  size?: 'small' | 'medium' | 'large'
  showValue?: boolean
  allowHalf?: boolean
  character?: React.ReactNode
  activeColor?: string
  inactiveColor?: string
}

export default function Rating({
  value: controlledValue,
  defaultValue = 0,
  max = 5,
  onChange,
  onHover,
  disabled = false,
  readonly = false,
  size = 'medium',
  showValue = true,
  allowHalf = false,
  character = '★',
  activeColor = '#ffc107',
  inactiveColor = '#e9ecef'
}: RatingProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? defaultValue)
  const [hoverValue, setHoverValue] = useState(0)

  const currentValue = controlledValue ?? internalValue
  const displayValue = hoverValue || currentValue

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { fontSize: '16px', width: '16px', height: '16px' }
      case 'large':
        return { fontSize: '32px', width: '32px', height: '32px' }
      default:
        return { fontSize: '24px', width: '24px', height: '24px' }
    }
  }

  const handleClick = (index: number, isHalf: boolean = false) => {
    if (disabled || readonly) return

    const newValue = isHalf ? index + 0.5 : index + 1
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  const handleMouseEnter = (index: number, isHalf: boolean = false) => {
    if (disabled || readonly) return

    const newHoverValue = isHalf ? index + 0.5 : index + 1
    setHoverValue(newHoverValue)
    onHover?.(newHoverValue)
  }

  const handleMouseLeave = () => {
    if (disabled || readonly) return

    setHoverValue(0)
    onHover?.(0)
  }

  const renderStar = (index: number) => {
    const isActive = displayValue > index
    const isHalfActive = allowHalf && displayValue === index + 0.5
    const isClickable = !disabled && !readonly

    const starStyle = {
      ...getSizeStyles(),
      color: isActive || isHalfActive ? activeColor : inactiveColor,
      cursor: isClickable ? 'pointer' : 'default',
      display: 'inline-block',
      position: 'relative' as const,
      transition: 'color 0.2s ease'
    }

    if (allowHalf) {
      return (
        <div
          key={index}
          data-cy={`rating-star-${index}`}
          style={starStyle}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Half star (left side) */}
          <div
            data-cy={`rating-half-${index}`}
            style={{
              position: 'absolute',
              width: '50%',
              height: '100%',
              overflow: 'hidden',
              color: isHalfActive ? activeColor : inactiveColor
            }}
            onClick={(e) => {
              e.stopPropagation()
              handleClick(index, true)
            }}
            onMouseEnter={(e) => {
              e.stopPropagation()
              handleMouseEnter(index, true)
            }}
          >
            {character}
          </div>
          {/* Full star (right side) */}
          <div
            data-cy={`rating-full-${index}`}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              color: isActive ? activeColor : inactiveColor
            }}
            onClick={(e) => {
              e.stopPropagation()
              handleClick(index, false)
            }}
            onMouseEnter={(e) => {
              e.stopPropagation()
              handleMouseEnter(index, false)
            }}
          >
            {character}
          </div>
        </div>
      )
    }

    return (
      <span
        key={index}
        data-cy={`rating-star-${index}`}
        style={starStyle}
        onClick={() => handleClick(index)}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
      >
        {character}
      </span>
    )
  }

  return (
    <div 
      data-cy="rating"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: disabled ? 0.6 : 1
      }}
    >
      <div
        data-cy="rating-stars"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px'
        }}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: max }, (_, index) => renderStar(index))}
      </div>
      
      {showValue && (
        <div
          data-cy="rating-value"
          style={{
            fontSize: '14px',
            color: '#6c757d',
            fontWeight: 'bold'
          }}
        >
          {displayValue.toFixed(allowHalf ? 1 : 0)}/{max}
        </div>
      )}
    </div>
  )
}
