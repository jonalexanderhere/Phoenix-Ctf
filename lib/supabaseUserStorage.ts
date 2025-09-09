import { supabaseAdmin } from './supabase'
import bcrypt from 'bcryptjs'

// Fallback in-memory storage
declare global {
  var __fallbackUsers: any[] | undefined
}

if (!global.__fallbackUsers) {
  global.__fallbackUsers = [
    {
      id: 'admin-prod-001',
      name: 'Admin User',
      email: 'admin@ctf.com',
      username: 'admin',
      password: '$2b$12$wDuNwtyQOiO7HpuG5TG6Nu3sLzSteQ7dvMR4M8OcfNmRM968WXIf.',
      role: 'ADMIN',
      score: 1000,
      badges: JSON.stringify(['First Blood', 'Admin', 'Web Security Expert']),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
}

const fallbackUsers = global.__fallbackUsers

export interface User {
  id: string
  name: string
  email: string
  username: string
  password: string
  role: 'USER' | 'ADMIN'
  score: number
  badges: string
  created_at: string
  updated_at: string
}

export async function addUser(userData: {
  name: string
  email: string
  username: string
  password: string
}): Promise<User> {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    // Try Supabase first
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        name: userData.name,
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        role: 'USER',
        score: 0,
        badges: JSON.stringify([])
      })
      .select()
      .single()

    if (error) {
      console.log('Supabase not available, using fallback storage')
      // Fallback to in-memory storage if Supabase fails
      const fallbackUser = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        role: 'USER' as const,
        score: 0,
        badges: JSON.stringify([]),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      fallbackUsers.push(fallbackUser)
      console.log('✅ User added to fallback storage:', fallbackUser.email, 'Total users:', fallbackUsers.length)
      return fallbackUser
    }

    console.log('✅ User added to Supabase:', data.email)
    return data
  } catch (error) {
    console.log('Supabase error, using fallback storage')
    // Fallback to in-memory storage
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    const fallbackUser = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      username: userData.username,
      password: hashedPassword,
      role: 'USER' as const,
      score: 0,
      badges: JSON.stringify([]),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    fallbackUsers.push(fallbackUser)
    console.log('✅ User added to fallback storage:', fallbackUser.email, 'Total users:', fallbackUsers.length)
    return fallbackUser
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // User not found
      }
      console.error('Error getting user by email from Supabase:', error)
      // Fallback to in-memory storage
      const fallbackUser = fallbackUsers.find(u => u.email === email)
      return fallbackUser || null
    }

    return data
  } catch (error) {
    console.error('Get user by email error:', error)
    // Fallback to in-memory storage
    const fallbackUser = fallbackUsers.find(u => u.email === email)
    return fallbackUser || null
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // User not found
      }
      console.error('Error getting user by id from Supabase:', error)
      // Fallback to in-memory storage
      const fallbackUser = fallbackUsers.find(u => u.id === id)
      return fallbackUser || null
    }

    return data
  } catch (error) {
    console.error('Get user by id error:', error)
    // Fallback to in-memory storage
    const fallbackUser = fallbackUsers.find(u => u.id === id)
    return fallbackUser || null
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('score', { ascending: false })

    if (error) {
      console.log('Supabase not available, using fallback users storage')
      // Fallback to in-memory storage
      return fallbackUsers.sort((a, b) => b.score - a.score)
    }

    return data || []
  } catch (error) {
    console.log('Supabase error, using fallback users storage')
    // Fallback to in-memory storage
    return fallbackUsers.sort((a, b) => b.score - a.score)
  }
}

export async function updateUserScore(userId: string, points: number): Promise<void> {
  try {
    // First get current user
    const { data: user, error: getUserError } = await supabaseAdmin
      .from('users')
      .select('score')
      .eq('id', userId)
      .single()

    if (getUserError) {
      console.error('Error getting user for score update:', getUserError)
      // Fallback to in-memory storage
      const fallbackUser = fallbackUsers.find(u => u.id === userId)
      if (fallbackUser) {
        fallbackUser.score += points
        fallbackUser.updated_at = new Date().toISOString()
        console.log('User score updated in fallback storage:', userId, '+', points, 'points')
      }
      return
    }

    // Update with new score
    const { error } = await supabaseAdmin
      .from('users')
      .update({ 
        score: (user.score || 0) + points,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user score:', error)
      // Fallback to in-memory storage
      const fallbackUser = fallbackUsers.find(u => u.id === userId)
      if (fallbackUser) {
        fallbackUser.score += points
        fallbackUser.updated_at = new Date().toISOString()
        console.log('User score updated in fallback storage:', userId, '+', points, 'points')
      }
      return
    }

    console.log('User score updated in Supabase:', userId, '+', points, 'points')
  } catch (error) {
    console.error('Update user score error:', error)
    // Fallback to in-memory storage
    const fallbackUser = fallbackUsers.find(u => u.id === userId)
    if (fallbackUser) {
      fallbackUser.score += points
      fallbackUser.updated_at = new Date().toISOString()
      console.log('User score updated in fallback storage:', userId, '+', points, 'points')
    }
  }
}
