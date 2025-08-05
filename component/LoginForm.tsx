import React, { useState, useEffect } from 'react'

type LoginFormProps = {
  initialEmail?: string
  initialPassword?: string
  onSubmit?: (email: string, password: string) => void
}

export default function LoginForm({
  initialEmail = '',
  initialPassword = '',
  onSubmit,
}: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState(initialPassword)
  const [valid, setValid] = useState(false)

  useEffect(() => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const isPasswordValid = password.length >= 6
    setValid(isValidEmail && isPasswordValid)
  }, [email, password])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit && valid) {
      onSubmit(email, password)
    }
  }

  return (
    <form data-cy="login-form" onSubmit={handleSubmit}>
      <input
        data-cy="email-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        data-cy="password-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button
        data-cy="submit-button"
        type="submit"
        disabled={!valid}
      >
        Login
      </button>
    </form>
  )
}
