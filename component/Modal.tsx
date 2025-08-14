import React, { useEffect, useRef } from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnBackdrop = true,
  closeOnEscape = true
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        closeOnBackdrop
      ) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, closeOnEscape, closeOnBackdrop])

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: '400px', maxWidth: '90vw' }
      case 'large':
        return { width: '800px', maxWidth: '90vw' }
      default:
        return { width: '600px', maxWidth: '90vw' }
    }
  }

  if (!isOpen) return null

  return (
    <div
      data-cy="modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        data-cy="modal-content"
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          ...getSizeStyles(),
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        role="document"
      >
        {/* Header */}
        {(title || closeOnBackdrop) && (
          <div
            data-cy="modal-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 20px 0 20px',
              borderBottom: title ? '1px solid #e9ecef' : 'none'
            }}
          >
            {title && (
              <h2
                id="modal-title"
                data-cy="modal-title"
                style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}
              >
                {title}
              </h2>
            )}
            <button
              data-cy="modal-close"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}

        {/* Body */}
        <div
          data-cy="modal-body"
          style={{
            padding: '20px',
            overflow: 'auto',
            flex: 1
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
