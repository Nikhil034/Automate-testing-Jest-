// components/Counter.js
"use client";
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  // const test="Testing";
  // This will log every time the component re-renders

  return (
    <div className="counter">
      <h2>Counter: {count}</h2>
      <button 
        onClick={() => setCount(count + 1)}
        aria-label="Increment"
      >
        Increment here
      </button>
      <button 
        onClick={() => setCount(count - 1)}
        aria-label="Decrement"
      >
        Decrement here
      </button>
    </div>
  )
}