'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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
  file?: File
}

interface Stats {
  totalChallenges: number
  activeChallenges: number
  totalUsers: number
  totalSubmissions: number
}

export default function OptimizedAdminDashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [stats, setStats] = useState<Stats>({ totalChallenges: 0, activeChallenges: 0, totalUsers: 0, totalSubmissions: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ChallengeForm>()
  const [uploadedFile, setUploadedFile] = useState<{ fileName: string; url: string } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = useMemo(() => [
    { value: 'WEB', label: 'Web Exploitation' },
    { value: 'CRYPTO', label: 'Cryptography' },
    { value: 'FORENSICS', label: 'Forensics' },
    { value: 'REVERSE', label: 'Reverse Engineering' },
    { value: 'PWN', label: 'Binary Exploitation' },
    { value: 'MISC', label: 'Miscellaneous' },
  ], [])

  const difficulties = useMemo(() => [
    { value: 'EASY', label: 'Easy' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HARD', label: 'Hard' },
  ], [])

  // Memoized filtered challenges
  const filteredChallenges = useMemo(() => {
    return challenges.filter(challenge => {
      const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !filterCategory || challenge.category === filterCategory
      const matchesDifficulty = !filterDifficulty || challenge.difficulty === filterDifficulty
      
      return matchesSearch && matchesCategory && matchesDifficulty
    })
  }, [challenges, searchTerm, filterCategory, filterDifficulty])

  // Paginated challenges
  const paginatedChallenges = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredChallenges.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredChallenges, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredChallenges.length / itemsPerPage)

  const fetchChallenges = useCallback(async () => {
    try {
      const response = await fetch('/api/challenges', {
        cache: 'no-store'
      })
      const data = await response.json()
      setChallenges(data)
      
      // Calculate stats
      setStats({
        totalChallenges: data.length,
        activeChallenges: data.filter((c: Challenge) => c.isActive).length,
        totalUsers: 0, // Will be fetched separately
        totalSubmissions: 0 // Will be fetched separately
      })
    } catch (error) {
      toast.error('Failed to fetch challenges')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchChallenges()
  }, [fetchChallenges])

  const handleFileUpload = useCallback(async (file: File) => {
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
        toast.success('File uploaded successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Upload failed')
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [setValue])

  const onSubmit = useCallback(async (data: ChallengeForm) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      const url = editingChallenge ? `/api/challenges/${editingChallenge.id}` : '/api/challenges'
      const method = editingChallenge ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(editingChallenge ? 'Challenge updated successfully' : 'Challenge created successfully')
        await fetchChallenges()
        reset()
        setShowCreateForm(false)
        setEditingChallenge(null)
        setUploadedFile(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save challenge')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }, [editingChallenge, isSubmitting, fetchChallenges, reset])

  const handleEdit = useCallback((challenge: Challenge) => {
    setEditingChallenge(challenge)
    setValue('title', challenge.title)
    setValue('description', challenge.description)
    setValue('category', challenge.category)
    setValue('difficulty', challenge.difficulty)
    setValue('points', challenge.points)
    setValue('flag', challenge.flag)
    setValue('hint', challenge.hint || '')
    setValue('attachment', challenge.attachment || '')
    setShowCreateForm(true)
  }, [setValue])

  const handleDelete = useCallback(async (challengeId: string) => {
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
  }, [fetchChallenges])

  const toggleChallengeStatus = useCallback(async (challenge: Challenge) => {
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
  }, [fetchChallenges])

  const resetForm = useCallback(() => {
    setShowCreateForm(false)
    setEditingChallenge(null)
    reset()
    setUploadedFile(null)
  }, [reset])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📝</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Challenges</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalChallenges}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Challenges</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeChallenges}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🎯</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Submissions</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalSubmissions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {editingChallenge ? 'Edit Challenge' : 'Create New Challenge'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 text-xl"
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
              
              <div className="space-y-4">
                {['REVERSE', 'PWN', 'FORENSICS', 'CRYPTO', 'MISC'].includes(watch('category')) && (
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    isUploading={isUploading}
                    uploadedFile={uploadedFile}
                    category={watch('category')}
                  />
                )}

                {watch('category') === 'WEB' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🌐 Web Challenge URL
                    </label>
                    <input
                      {...register('attachment')}
                      type="url"
                      className="input"
                      placeholder="https://example.com/web-challenge"
                    />
                  </div>
                )}

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
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
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
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold">Challenges</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary"
              >
                Create Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input text-sm"
                placeholder="Search challenges..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="input text-sm"
              >
                <option value="">All Difficulties</option>
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterCategory('')
                  setFilterDifficulty('')
                }}
                className="btn btn-secondary text-sm w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedChallenges.map((challenge) => (
                <tr key={challenge.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {challenge.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {challenge.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {categories.find(c => c.value === challenge.category)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      challenge.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                      challenge.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {difficulties.find(d => d.value === challenge.difficulty)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {challenge.points}
                    </span>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredChallenges.length)} of {filteredChallenges.length} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
