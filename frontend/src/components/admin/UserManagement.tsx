import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Lock,
  AlertCircle,
  Download
} from 'lucide-react'
import Button from '../common/UI/Button'
import Input from '../common/UI/Input'
import Select from '../common/UI/Select'
import { format } from 'date-fns'

interface UserData {
  id: string
  email: string
  fullName: string
  phone: string
  role: 'user' | 'admin' | 'verifier'
  identityVerified: boolean
  verificationLevel: 'basic' | 'intermediate' | 'advanced'
  accountStatus: 'active' | 'suspended' | 'pending_verification'
  lastLogin: string
  createdAt: string
  itemsReported: number
  itemsClaimed: number
  totalRewards: number
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    verification: '',
  })
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockUsers: UserData[] = Array.from({ length: 50 }, (_, i) => ({
          id: `user_${i + 1}`,
          email: `user${i + 1}@example.com`,
          fullName: `User ${i + 1}`,
          phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
          role: i === 0 ? 'admin' : i < 5 ? 'verifier' : 'user',
          identityVerified: i % 3 !== 0,
          verificationLevel: i % 3 === 0 ? 'basic' : i % 3 === 1 ? 'intermediate' : 'advanced',
          accountStatus: i % 10 === 0 ? 'suspended' : i % 5 === 0 ? 'pending_verification' : 'active',
          lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          itemsReported: Math.floor(Math.random() * 20),
          itemsClaimed: Math.floor(Math.random() * 10),
          totalRewards: Math.floor(Math.random() * 500),
        }))
        
        setUsers(mockUsers)
        setTotalPages(Math.ceil(mockUsers.length / itemsPerPage))
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    // Search filter
    if (searchTerm && !user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !user.phone.includes(searchTerm)) {
      return false
    }

    // Role filter
    if (filters.role && user.role !== filters.role) {
      return false
    }

    // Status filter
    if (filters.status && user.accountStatus !== filters.status) {
      return false
    }

    // Verification filter
    if (filters.verification) {
      if (filters.verification === 'verified' && !user.identityVerified) return false
      if (filters.verification === 'pending' && user.accountStatus !== 'pending_verification') return false
    }

    return true
  })

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id))
    }
  }

  const handleRoleChange = (userId: string, newRole: UserData['role']) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    )
  }

  const handleStatusChange = (userId: string, newStatus: UserData['accountStatus']) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, accountStatus: newStatus } : user
      )
    )
  }

  const getStatusBadge = (status: UserData['accountStatus']) => {
    const config = {
      active: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle size={12} />,
        label: 'Active',
      },
      suspended: {
        color: 'bg-red-100 text-red-800',
        icon: <XCircle size={12} />,
        label: 'Suspended',
      },
      pending_verification: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <AlertCircle size={12} />,
        label: 'Pending',
      },
    }

    const { color, icon, label } = config[status]
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <span className="mr-1">{icon}</span>
        {label}
      </span>
    )
  }

  const getVerificationBadge = (level: UserData['verificationLevel']) => {
    const config = {
      basic: {
        color: 'bg-gray-100 text-gray-800',
        label: 'Basic',
      },
      intermediate: {
        color: 'bg-blue-100 text-blue-800',
        label: 'Intermediate',
      },
      advanced: {
        color: 'bg-green-100 text-green-800',
        label: 'Advanced',
      },
    }

    const { color, label } = config[level]
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Shield size={10} className="mr-1" />
        {label}
      </span>
    )
  }

  const getRoleBadge = (role: UserData['role']) => {
    const config = {
      user: {
        color: 'bg-gray-100 text-gray-800',
        label: 'User',
      },
      admin: {
        color: 'bg-purple-100 text-purple-800',
        label: 'Admin',
      },
      verifier: {
        color: 'bg-blue-100 text-blue-800',
        label: 'Verifier',
      },
    }

    const { color, label } = config[role]
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  const exportToCSV = () => {
    // In real app, this would generate and download a CSV file
    alert('Exporting data to CSV...')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage and monitor all platform users</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={exportToCSV}>
            <Download size={18} className="mr-2" />
            Export CSV
          </Button>
          <Button variant="primary">
            <User size={18} className="mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            <span>+12.5% from last month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.accountStatus === 'active').length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            <span>94% active rate</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.identityVerified).length}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            <span>85% verified</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspended Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.accountStatus === 'suspended').length}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-red-600">
            <span>2% suspension rate</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={20} className="text-gray-400" />
              </div>
              <Select
                value={filters.role}
                onChange={(value) => setFilters({ ...filters, role: value })}
                options={[
                  { value: '', label: 'All Roles' },
                  { value: 'user', label: 'Users' },
                  { value: 'admin', label: 'Admins' },
                  { value: 'verifier', label: 'Verifiers' },
                ]}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={20} className="text-gray-400" />
              </div>
              <Select
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'suspended', label: 'Suspended' },
                  { value: 'pending_verification', label: 'Pending Verification' },
                ]}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield size={20} className="text-gray-400" />
              </div>
              <Select
                value={filters.verification}
                onChange={(value) => setFilters({ ...filters, verification: value })}
                options={[
                  { value: '', label: 'All Verification' },
                  { value: 'verified', label: 'Verified' },
                  { value: 'pending', label: 'Pending' },
                ]}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {paginatedUsers.length} of {filteredUsers.length} users
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilters({
                role: '',
                status: '',
                verification: '',
              })}
            >
              Clear Filters
            </Button>
            <Button variant="primary" size="sm">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">
                  {selectedUsers.length} users selected
                </p>
                <p className="text-sm text-blue-700">
                  Choose an action to perform on selected users
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Lock size={16} className="mr-1" />
                Suspend
              </Button>
              <Button variant="outline" size="sm">
                <CheckCircle size={16} className="mr-1" />
                Activate
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail size={12} className="mr-1" />
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Phone size={10} className="mr-1" />
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div>{getRoleBadge(user.role)}</div>
                      <div>{getStatusBadge(user.accountStatus)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div>{getVerificationBadge(user.verificationLevel)}</div>
                      <div className="text-xs text-gray-500">
                        {user.identityVerified ? 'Verified' : 'Not Verified'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Last login: {formatDate(user.lastLogin)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Joined: {formatDate(user.createdAt)}
                      </div>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-gray-600">
                          Reports: {user.itemsReported}
                        </span>
                        <span className="text-gray-600">
                          Claims: {user.itemsClaimed}
                        </span>
                        <span className="text-gray-600">
                          Rewards: ${user.totalRewards}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-green-600"
                        title="Edit User"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="relative">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical size={18} />
                        </button>
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 hidden group-hover:block">
                          <div className="py-1">
                            <button
                              onClick={() => handleRoleChange(user.id, 'admin')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Make Admin
                            </button>
                            <button
                              onClick={() => handleStatusChange(user.id, 'active')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Activate Account
                            </button>
                            <button
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Suspend Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }
            
            return (
              <button
                key={i}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserManagement