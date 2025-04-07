// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next'

interface User {
  id: number
  name: string
  email: string
}

interface UsersResponse {
  users?: User[]
  user?: User
  message?: string
  error?: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UsersResponse>
) {
  if (req.method === 'GET') {
    // Return a list of mock users
    res.status(200).json({
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
      ]
    })
    console.log('GET request received')
  } else if (req.method === 'POST') {
    // Check if name and email are provided
    const { name, email } = req.body
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }

    console.log('POST request received');
    
    // In a real app, we would save the user to a database here
    // For this example, we'll just return the created user with a mock ID
    return res.status(201).json({ 
      user: { 
        id: Date.now(), 
        name, 
        email 
      },
      message: 'User created successfully'
    })
    
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
}