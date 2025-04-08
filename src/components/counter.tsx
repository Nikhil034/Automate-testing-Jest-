// components/Counter.js
"use client";
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="counter">
      <h2>Counter: {cont}</h2>
      <button 
        onClick={() => setCount(count + 1)}
        aria-label="Increment"
      >
        Increment
      </button>
      <button 
        onClick={() => setCount(count - 1)}
        aria-label="Decrement"
      >
        Decrement
      </button>
    </div>
  )
}