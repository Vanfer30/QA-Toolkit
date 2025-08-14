import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Rating from '../../component/Rating'

describe('Rating', () => {
  beforeEach(() => {
    render(<Rating />)
  })

  it('renders default 5 stars', () => {
    const stars = screen.getAllByTestId(/^rating-star-/)
    expect(stars).toHaveLength(5)
  })

  it('shows default value of 0', () => {
    expect(screen.getByText('0/5')).toBeInTheDocument()
  })

  it('displays correct value when clicked', () => {
    const thirdStar = screen.getByTestId('rating-star-2')
    fireEvent.click(thirdStar)
    
    expect(screen.getByText('3/5')).toBeInTheDocument()
  })

  it('calls onChange when star is clicked', () => {
    const onChange = jest.fn()
    render(<Rating onChange={onChange} />)
    
    const thirdStar = screen.getByTestId('rating-star-2')
    fireEvent.click(thirdStar)
    
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('shows hover value when mouse enters star', () => {
    const thirdStar = screen.getByTestId('rating-star-2')
    fireEvent.mouseEnter(thirdStar)
    
    expect(screen.getByText('3/5')).toBeInTheDocument()
  })

  it('calls onHover when mouse enters star', () => {
    const onHover = jest.fn()
    render(<Rating onHover={onHover} />)
    
    const thirdStar = screen.getByTestId('rating-star-2')
    fireEvent.mouseEnter(thirdStar)
    
    expect(onHover).toHaveBeenCalledWith(3)
  })

  it('resets hover value when mouse leaves', () => {
    const onHover = jest.fn()
    render(<Rating onHover={onHover} />)
    
    const thirdStar = screen.getByTestId('rating-star-2')
    fireEvent.mouseEnter(thirdStar)
    fireEvent.mouseLeave(thirdStar)
    
    expect(onHover).toHaveBeenCalledWith(0)
  })

  it('handles controlled value', () => {
    render(<Rating value={3} />)
    expect(screen.getByText('3/5')).toBeInTheDocument()
  })

  it('handles custom max value', () => {
    render(<Rating max={10} />)
    const stars = screen.getAllByTestId(/^rating-star-/)
    expect(stars).toHaveLength(10)
    expect(screen.getByText('0/10')).toBeInTheDocument()
  })

  it('handles custom default value', () => {
    render(<Rating defaultValue={4} />)
    expect(screen.getByText('4/5')).toBeInTheDocument()
  })

  it('disables interaction when disabled prop is true', () => {
    const onChange = jest.fn()
    const onHover = jest.fn()
    render(<Rating disabled={true} onChange={onChange} onHover={onHover} />)
    
    const thirdStar = screen.getByTestId('rating-star-2')
    fireEvent.click(thirdStar)
    fireEvent.mouseEnter(thirdStar)
    
    expect(onChange).not.toHaveBeenCalled()
    expect(onHover).not.toHaveBeenCalled()
  })

  it('disables interaction when readonly prop is true', () => {
    const onChange = jest.fn()
    const onHover = jest.fn()
    render(<Rating readonly={true} onChange={onChange} onHover={onHover} />)
    
    const thirdStar = screen.getByTestId('rating-star-2')
    fireEvent.click(thirdStar)
    fireEvent.mouseEnter(thirdStar)
    
    expect(onChange).not.toHaveBeenCalled()
    expect(onHover).not.toHaveBeenCalled()
  })

  it('applies correct size styles', () => {
    render(<Rating size="small" />)
    const star = screen.getByTestId('rating-star-0')
    expect(star).toHaveStyle({ fontSize: '16px' })
    
    render(<Rating size="large" />)
    const largeStar = screen.getByTestId('rating-star-0')
    expect(largeStar).toHaveStyle({ fontSize: '32px' })
  })

  it('hides value when showValue is false', () => {
    render(<Rating showValue={false} />)
    expect(screen.queryByText('0/5')).not.toBeInTheDocument()
  })

  it('handles custom character', () => {
    render(<Rating character="⭐" />)
    const stars = screen.getAllByTestId(/^rating-star-/)
    stars.forEach(star => {
      expect(star).toHaveTextContent('⭐')
    })
  })

  it('handles custom colors', () => {
    render(<Rating activeColor="#ff0000" inactiveColor="#000000" />)
    const stars = screen.getAllByTestId(/^rating-star-/)
    stars.forEach(star => {
      expect(star).toHaveStyle({ color: '#000000' })
    })
  })

  describe('Half star functionality', () => {
    beforeEach(() => {
      render(<Rating allowHalf={true} />)
    })

    it('renders half star components', () => {
      const halfStars = screen.getAllByTestId(/^rating-half-/)
      const fullStars = screen.getAllByTestId(/^rating-full-/)
      expect(halfStars).toHaveLength(5)
      expect(fullStars).toHaveLength(5)
    })

    it('handles half star clicks', () => {
      const halfStar = screen.getByTestId('rating-half-2')
      fireEvent.click(halfStar)
      
      expect(screen.getByText('2.5/5')).toBeInTheDocument()
    })

    it('handles full star clicks', () => {
      const fullStar = screen.getByTestId('rating-full-2')
      fireEvent.click(fullStar)
      
      expect(screen.getByText('3/5')).toBeInTheDocument()
    })

    it('shows hover value for half stars', () => {
      const halfStar = screen.getByTestId('rating-half-2')
      fireEvent.mouseEnter(halfStar)
      
      expect(screen.getByText('2.5/5')).toBeInTheDocument()
    })

    it('shows hover value for full stars', () => {
      const fullStar = screen.getByTestId('rating-full-2')
      fireEvent.mouseEnter(fullStar)
      
      expect(screen.getByText('3/5')).toBeInTheDocument()
    })

    it('calls onChange with half values', () => {
      const onChange = jest.fn()
      render(<Rating allowHalf={true} onChange={onChange} />)
      
      const halfStar = screen.getByTestId('rating-half-2')
      fireEvent.click(halfStar)
      
      expect(onChange).toHaveBeenCalledWith(2.5)
    })

    it('calls onHover with half values', () => {
      const onHover = jest.fn()
      render(<Rating allowHalf={true} onHover={onHover} />)
      
      const halfStar = screen.getByTestId('rating-half-2')
      fireEvent.mouseEnter(halfStar)
      
      expect(onHover).toHaveBeenCalledWith(2.5)
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const stars = screen.getAllByTestId(/^rating-star-/)
      stars.forEach((star, index) => {
        expect(star).toHaveAttribute('role', 'button')
      })
    })

    it('handles keyboard navigation', () => {
      const firstStar = screen.getByTestId('rating-star-0')
      firstStar.focus()
      
      fireEvent.keyDown(firstStar, { key: 'Enter' })
      expect(screen.getByText('1/5')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('handles value greater than max', () => {
      render(<Rating value={10} max={5} />)
      expect(screen.getByText('5/5')).toBeInTheDocument()
    })

    it('handles negative value', () => {
      render(<Rating value={-1} />)
      expect(screen.getByText('0/5')).toBeInTheDocument()
    })

    it('handles zero max value', () => {
      render(<Rating max={0} />)
      const stars = screen.queryAllByTestId(/^rating-star-/)
      expect(stars).toHaveLength(0)
    })

    it('handles decimal values correctly', () => {
      render(<Rating value={3.7} allowHalf={true} />)
      expect(screen.getByText('3.5/5')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('handles large max values efficiently', () => {
      render(<Rating max={100} />)
      const stars = screen.getAllByTestId(/^rating-star-/)
      expect(stars).toHaveLength(100)
    })

    it('updates efficiently when value changes', () => {
      const { rerender } = render(<Rating value={1} />)
      
      rerender(<Rating value={5} />)
      expect(screen.getByText('5/5')).toBeInTheDocument()
    })
  })
})
