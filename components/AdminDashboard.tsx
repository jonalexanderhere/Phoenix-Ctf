'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import FileUpload from './FileUpload'

interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  points: number
  flag: string
  hint?: string
  attachment?: string
  isActive: boolean
  createdAt: string
}

interface ChallengeForm {
  title: string
  description: string
  category: string
  difficulty: string
  points: number
  flag: string
  hint: string
  attachment: string
  webUrl?: string
  file?: File
}

export default function AdminDashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ChallengeForm>()
  const [uploadedFile, setUploadedFile] = useState<{ fileName: string; url: string; originalName: string; size: number; type: string } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [webUrl, setWebUrl] = useState('')

  const categories = [
    { value: 'WEB', label: 'Web Exploitation' },
    { value: 'CRYPTO', label: 'Cryptography' },
    { value: 'FORENSICS', label: 'Forensics' },
    { value: 'REVERSE', label: 'Reverse Engineering' },
    { value: 'PWN', label: 'Binary Exploitation' },
    { value: 'MISC', label: 'Miscellaneous' },
  ]

  const difficulties = [
    { value: 'EASY', label: 'Easy' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HARD', label: 'Hard' },
  ]

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges')
      const data = await response.json()
      setChallenges(data)
    } catch (error) {
      toast.error('Failed to fetch challenges')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setUploadedFile(result)
        setValue('attachment', result.url)
        toast.success(`File uploaded successfully: ${result.originalName}`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Upload failed')
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: ChallengeForm) => {
    if (isSubmitting) return // Prevent double submission
    
    setIsSubmitting(true)
    try {
      const url = editingChallenge ? `/api/challenges/${editingChallenge.id}` : '/api/challenges'
      const method = editingChallenge ? 'PUT' : 'POST'
      
      // Prepare submission data
      const submissionData = {
        ...data,
        attachment: data.category === 'WEB' ? webUrl : data.attachment,
        webUrl: data.category === 'WEB' ? webUrl : undefined
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (response.ok) {
        toast.success(editingChallenge ? 'Challenge updated successfully' : 'Challenge created successfully')
        await fetchChallenges() // Wait for fetch to complete
        reset()
        setShowCreateForm(false)
        setEditingChallenge(null)
        setUploadedFile(null)
        setWebUrl('')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save challenge')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge)
    setValue('title', challenge.title)
    setValue('description', challenge.description)
    setValue('category', challenge.category)
    setValue('difficulty', challenge.difficulty)
    setValue('points', challenge.points)
    setValue('flag', challenge.flag)
    setValue('hint', challenge.hint || '')
    setValue('attachment', challenge.attachment || '')
    
    // Set web URL if it's a web challenge
    if (challenge.category === 'WEB') {
      setWebUrl(challenge.attachment || '')
    }
    
    setShowCreateForm(true)
  }

  const handleDelete = async (challengeId: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) {
      return
    }

    try {
      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Challenge deleted successfully')
        fetchChallenges()
      } else {
        toast.error('Failed to delete challenge')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const toggleChallengeStatus = async (challenge: Challenge) => {
    try {
      const response = await fetch(`/api/challenges/${challenge.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...challenge,
          isActive: !challenge.isActive,
        }),
      })

      if (response.ok) {
        toast.success(`Challenge ${!challenge.isActive ? 'activated' : 'deactivated'}`)
        fetchChallenges()
      } else {
        toast.error('Failed to update challenge status')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {editingChallenge ? 'Edit Challenge' : 'Create New Challenge'}
            </h2>
            <button
              onClick={() => {
                setShowCreateForm(false)
                setEditingChallenge(null)
                reset()
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  type="text"
                  className="input"
                  placeholder="Challenge title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points
                </label>
                <input
                  {...register('points', { 
                    required: 'Points is required',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Points must be at least 1' }
                  })}
                  type="number"
                  className="input"
                  placeholder="Challenge points"
                />
                {errors.points && (
                  <p className="mt-1 text-sm text-red-600">{errors.points.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="input"
                placeholder="Challenge description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="input"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  {...register('difficulty', { required: 'Difficulty is required' })}
                  className="input"
                >
                  <option value="">Select difficulty</option>
                  {difficulties.map(diff => (
                    <option key={diff.value} value={diff.value}>
                      {diff.label}
                    </option>
                  ))}
                </select>
                {errors.difficulty && (
                  <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flag
              </label>
              <input
                {...register('flag', { required: 'Flag is required' })}
                type="text"
                className="input"
                placeholder="Challenge flag"
              />
              {errors.flag && (
                <p className="mt-1 text-sm text-red-600">{errors.flag.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hint (Optional)
              </label>
              <input
                {...register('hint')}
                type="text"
                className="input"
                placeholder="Challenge hint"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challenge Resources
              </label>
              
              {/* Dynamic content based on category */}
              <div className="space-y-4">
                {/* File Upload for RE, PWN, FORENSICS, CRYPTO, MISC */}
                {['REVERSE', 'PWN', 'FORENSICS', 'CRYPTO', 'MISC'].includes(watch('category')) && (
                  <div className="space-y-4">
                    <FileUpload
                      onFileUpload={handleFileUpload}
                      isUploading={isUploading}
                      uploadedFile={uploadedFile}
                      category={watch('category')}
                    />
                    
                    {/* File Info Display */}
                    {uploadedFile && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-green-800">
                                {uploadedFile.originalName}
                              </p>
                              <p className="text-xs text-green-600">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {uploadedFile.type}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedFile(null)
                              setValue('attachment', '')
                            }}
                            className="text-green-600 hover:text-green-800"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* URL Input for WEB category */}
                {watch('category') === 'WEB' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🌐 Web Challenge URL
                    </label>
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={webUrl}
                        onChange={(e) => setWebUrl(e.target.value)}
                        className="input"
                        placeholder="https://example.com/web-challenge"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Enter the URL where players can access the web challenge
                      </p>
                      {webUrl && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Preview:</strong> <a href={webUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {webUrl}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Manual URL Input for other categories */}
                {!['WEB'].includes(watch('category')) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔗 Alternative URL (Optional)
                    </label>
                    <input
                      {...register('attachment')}
                      type="url"
                      className="input"
                      placeholder="https://example.com/external-file.zip"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use this if you want to provide an external link instead of uploading a file
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingChallenge(null)
                  reset()
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (editingChallenge ? 'Updating...' : 'Creating...') 
                  : (editingChallenge ? 'Update Challenge' : 'Create Challenge')
                }
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Challenges List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Challenges</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            Create Challenge
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resources
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {challenges.map((challenge) => (
                <tr key={challenge.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {challenge.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {categories.find(c => c.value === challenge.category)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {difficulties.find(d => d.value === challenge.difficulty)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {challenge.points}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {challenge.attachment ? (
                      <div className="flex items-center space-x-2">
                        {challenge.category === 'WEB' ? (
                          <a
                            href={challenge.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            🌐 Web URL
                          </a>
                        ) : (
                          <a
                            href={challenge.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            📁 Download
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No resources</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleChallengeStatus(challenge)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        challenge.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {challenge.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(challenge)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(challenge.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
