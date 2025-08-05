import React, { useState } from 'react'

type ButtonToggleProps = {
  toggle?: boolean
}

export default function ButtonToggle({ toggle = false }: ButtonToggleProps) {
  const [on, setOn] = useState(toggle)

  return (
    <button data-cy="toggle" onClick={() => setOn(!on)}>
      {on ? 'ON' : 'OFF'}
    </button>
  )
}
