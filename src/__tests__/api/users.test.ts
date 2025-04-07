// __tests__/api/users.test.ts
import { createMocks } from 'node-mocks-http'
import type { NextApiRequest, NextApiResponse } from 'next'
import handler from '../../../src/app/api/users/route';

describe('Users API', () => {
  test('GET /api/users returns list of users', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET'
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    
    const data = JSON.parse(res._getData())
    expect(Array.isArray(data.users)).toBeTruthy()
    expect(data.users.length).toBe(3)
    expect(data.users[0]).toHaveProperty('id')
    expect(data.users[0]).toHaveProperty('name')
    expect(data.users[0]).toHaveProperty('email')
  })

  test('POST /api/users creates a new user', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com'
      }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(201)
    
    const data = JSON.parse(res._getData())
    expect(data.user).toBeDefined()
    expect(data.user.name).toBe('Test User')
    expect(data.user.email).toBe('test@example.com')
    expect(data.message).toBe('User created successfully')
  })

  test('POST /api/users returns 400 when required fields are missing', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        name: 'Test User'
        // email is missing
      }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(400)
    
    const data = JSON.parse(res._getData())
    expect(data.error).toBe('Name and email are required')
  })

  test('PUT /api/users returns 405 Method Not Allowed', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT'
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(405)
    
    const data = JSON.parse(res._getData())
    expect(data.error).toBe('Method PUT not allowed')
  })
})