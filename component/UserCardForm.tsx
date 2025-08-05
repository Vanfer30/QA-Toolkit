import React, { useState } from 'react'

export default function UserCardForm({ onSubmit }: { onSubmit: (name: string, role: string) => void }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  return (
    <form
      data-cy="user-card-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(name, role)
      }}
    >
      <input data-cy="name-input" value={name} onChange={(e) => setName(e.target.value)} />
      <input data-cy="role-input" value={role} onChange={(e) => setRole(e.target.value)} />
      <button type="submit" data-cy="submit-button">Submit</button>
    </form>
  )
}