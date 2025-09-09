import { supabaseAdmin } from './supabase'

export interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  points: number
  flag: string
  hint?: string
  attachment?: string
  is_active: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export async function createChallenge(challengeData: {
  title: string
  description: string
  category: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  points: number
  flag: string
  hint?: string
  attachment?: string
  created_by?: string
}): Promise<Challenge> {
  try {
    const { data, error } = await supabaseAdmin
      .from('challenges')
      .insert({
        title: challengeData.title,
        description: challengeData.description,
        category: challengeData.category,
        difficulty: challengeData.difficulty,
        points: challengeData.points,
        flag: challengeData.flag,
        hint: challengeData.hint || null,
        attachment: challengeData.attachment || null,
        is_active: true,
        created_by: challengeData.created_by || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating challenge:', error)
      throw error
    }

    console.log('Challenge created in Supabase:', data.title)
    return data
  } catch (error) {
    console.error('Create challenge error:', error)
    throw error
  }
}

export async function getAllChallenges(): Promise<Challenge[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error getting challenges:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Get challenges error:', error)
    throw error
  }
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('challenges')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Challenge not found
      }
      console.error('Error getting challenge by id:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Get challenge by id error:', error)
    throw error
  }
}

export async function deleteChallenge(id: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('challenges')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      console.error('Error deleting challenge:', error)
      throw error
    }

    console.log('Challenge deleted in Supabase:', id)
  } catch (error) {
    console.error('Delete challenge error:', error)
    throw error
  }
}
