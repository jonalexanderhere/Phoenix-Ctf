// Global user storage
declare global {
  var __users: any[] | undefined
}

if (!global.__users) {
  global.__users = [
    {
      id: 'admin-prod-001',
      name: 'Admin User',
      email: 'admin@ctf.com',
      username: 'admin',
      password: '$2b$12$wDuNwtyQOiO7HpuG5TG6Nu3sLzSteQ7dvMR4M8OcfNmRM968WXIf.', // admin123
      role: 'ADMIN',
      score: 1000,
      badges: JSON.stringify(['First Blood', 'Admin', 'Web Security Expert']),
      createdAt: new Date().toISOString()
    }
  ]
}

const users = global.__users

export function addUser(user: any) {
  users.push(user)
  console.log('User added:', user.email, 'Total users:', users.length)
}

export function getUserByEmail(email: string) {
  return users.find(u => u.email === email)
}

export function getUserById(id: string) {
  return users.find(u => u.id === id)
}

export function getAllUsers() {
  return users
}

export function updateUserScore(userId: string, points: number) {
  const user = users.find(u => u.id === userId)
  if (user) {
    user.score += points
    console.log('User score updated:', user.email, 'New score:', user.score)
  }
}
