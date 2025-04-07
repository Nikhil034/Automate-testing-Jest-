// __tests__/components/Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '@/components/counter';

describe('Counter Component', () => {
  it('renders with initial count of 0', () => {
    render(<Counter />)
    expect(screen.getByText(/counter: 0/i)).toBeInTheDocument()
  })

  it('increments the count when increment button is clicked', () => {
    render(<Counter />)
    const incrementButton = screen.getByRole('button', { name: /increment/i })
    fireEvent.click(incrementButton)
    expect(screen.getByText(/counter: 1/i)).toBeInTheDocument()
    
    fireEvent.click(incrementButton)
    expect(screen.getByText(/counter: 2/i)).toBeInTheDocument()
  })

  it('decrements the count when decrement button is clicked', () => {
    render(<Counter />)
    const decrementButton = screen.getByRole('button', { name: /decrement/i })   
    fireEvent.click(decrementButton)
    expect(screen.getByText(/counter: -1/i)).toBeInTheDocument()
  })

  it('allows both increment and decrement operations', () => {
    render(<Counter />)
    const incrementButton = screen.getByRole('button', { name: /increment/i })
    const decrementButton = screen.getByRole('button', { name: /decrement/i })
    
    fireEvent.click(incrementButton)
    fireEvent.click(incrementButton)
    expect(screen.getByText(/counter: 2/i)).toBeInTheDocument()
    
    fireEvent.click(decrementButton)
    expect(screen.getByText(/counter: 1/i)).toBeInTheDocument()
  })
})