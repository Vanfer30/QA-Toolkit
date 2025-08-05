import React from 'react'

export default function UserCard({ name, role }: { name: string, role: string }) {
  return (
    <div data-cy="user-card">
      <h2 data-cy="user-name">{name}</h2>
      <p data-cy="user-role">{role}</p>
    </div>
  )
}
