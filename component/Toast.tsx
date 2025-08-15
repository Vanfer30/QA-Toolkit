import React, { useState, useEffect } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

type ToastProps = {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
  show?: boolean
}

type ToastContainerProps = {
  children: React.ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export function Toast({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  show = true
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(show)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setIsVisible(show)
  }, [show])

  useEffect(() => {
    if (duration > 0 && isVisible) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, isVisible])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  const getToastStyles = () => {
    const baseStyles = {
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minWidth: '300px',
      maxWidth: '400px',
      transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
      opacity: isExiting ? 0 : 1,
      transition: 'all 0.3s ease',
      position: 'relative' as const
    }

    const typeStyles = {
      success: {
        backgroundColor: '#d4edda',
        color: '#155724',
        borderLeft: '4px solid #28a745'
      },
      error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderLeft: '4px solid #dc3545'
      },
      warning: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        borderLeft: '4px solid #ffc107'
      },
      info: {
        backgroundColor: '#d1ecf1',
        color: '#0c5460',
        borderLeft: '4px solid #17a2b8'
      }
    }

    return { ...baseStyles, ...typeStyles[type] }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
        return 'ℹ'
      default:
        return 'ℹ'
    }
  }

  if (!isVisible) return null

  return (
    <div data-cy="toast" style={getToastStyles()}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <span
          data-cy="toast-icon"
          style={{
            marginRight: '8px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {getIcon()}
        </span>
        <span data-cy="toast-message">{message}</span>
      </div>
      <button
        data-cy="toast-close"
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          marginLeft: '12px',
          color: 'inherit',
          opacity: 0.7,
          padding: '0',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.7'
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  )
}

export function ToastContainer({ children, position = 'top-right' }: ToastContainerProps) {
  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 1000,
      padding: '16px'
    }

    const positionStyles = {
      'top-right': {
        top: 0,
        right: 0
      },
      'top-left': {
        top: 0,
        left: 0
      },
      'bottom-right': {
        bottom: 0,
        right: 0
      },
      'bottom-left': {
        bottom: 0,
        left: 0
      },
      'top-center': {
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)'
      },
      'bottom-center': {
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)'
      }
    }

    return { ...baseStyles, ...positionStyles[position] }
  }

  return (
    <div data-cy="toast-container" style={getPositionStyles()}>
      {children}
    </div>
  )
}

// Hook for managing multiple toasts
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string } & ToastProps>>([])

  const addToast = (toast: Omit<ToastProps, 'show'>) => {
    const id = Date.now().toString()
    const newToast = { ...toast, id, show: true }
    setToasts(prev => [...prev, newToast])
    return id
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (message: string, duration?: number) => {
    return addToast({ message, type: 'success', duration })
  }

  const showError = (message: string, duration?: number) => {
    return addToast({ message, type: 'error', duration })
  }

  const showWarning = (message: string, duration?: number) => {
    return addToast({ message, type: 'warning', duration })
  }

  const showInfo = (message: string, duration?: number) => {
    return addToast({ message, type: 'info', duration })
  }

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
