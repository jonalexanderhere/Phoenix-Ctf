import { supabaseAdmin } from './supabase'

export interface Submission {
  id: string
  user_id: string
  challenge_id: string
  flag: string
  is_correct: boolean
  submitted_at: string
}

export async function createSubmission(submissionData: {
  user_id: string
  challenge_id: string
  flag: string
  is_correct: boolean
}): Promise<Submission> {
  try {
    const { data, error } = await supabaseAdmin
      .from('submissions')
      .insert({
        user_id: submissionData.user_id,
        challenge_id: submissionData.challenge_id,
        flag: submissionData.flag,
        is_correct: submissionData.is_correct
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating submission:', error)
      throw error
    }

    console.log('Submission created in Supabase:', data.id)
    return data
  } catch (error) {
    console.error('Create submission error:', error)
    throw error
  }
}

export async function getUserSubmissions(userId: string): Promise<Submission[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Error getting user submissions:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Get user submissions error:', error)
    throw error
  }
}

export async function checkExistingSubmission(userId: string, challengeId: string): Promise<Submission | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .eq('is_correct', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // No existing correct submission
      }
      console.error('Error checking existing submission:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Check existing submission error:', error)
    throw error
  }
}

export async function getAllSubmissions(): Promise<Submission[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Error getting all submissions:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Get all submissions error:', error)
    throw error
  }
}
