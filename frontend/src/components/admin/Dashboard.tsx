import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Package, 
  Shield, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle,
  BarChart3,
  Activity
} from 'lucide-react'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import Button from '../common/UI/Button'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalItems: number
  openItems: number
  pendingVerifications: number
  resolvedClaims: number
  totalRevenue: number
  avgResolutionTime: number // in hours
}

interface DashboardChartData {
  userGrowth: number[]
  itemReports: number[]
  verificationStatus: {
    pending: number
    approved: number
    rejected: number
  }
  categoryDistribution: Record<string, number>
  monthlyTrends: {
    labels: string[]
    lost: number[]
    found: number[]
  }
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalItems: 0,
    openItems: 0,
    pendingVerifications: 0,
    resolvedClaims: 0,
    totalRevenue: 0,
    avgResolutionTime: 0,
  })

  const [chartData, setChartData] = useState<DashboardChartData>({
    userGrowth: [],
    itemReports: [],
    verificationStatus: {
      pending: 0,
      approved: 0,
      rejected: 0,
    },
    categoryDistribution: {},
    monthlyTrends: {
      labels: [],
      lost: [],
      found: [],
    },
  })

  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        const mockStats: DashboardStats = {
          totalUsers: 1245,
          activeUsers: 892,
          totalItems: 567,
          openItems: 234,
          pendingVerifications: 45,
          resolvedClaims: 189,
          totalRevenue: 4520,
          avgResolutionTime: 72,
        }

        const mockChartData: DashboardChartData = {
          userGrowth: [100, 200, 350, 450, 600, 800, 950, 1100, 1245],
          itemReports: [45, 67, 89, 78, 92, 105, 120, 98, 112, 135, 145, 167],
          verificationStatus: {
            pending: 45,
            approved: 856,
            rejected: 23,
          },
          categoryDistribution: {
            electronics: 156,
            documents: 89,
            jewelry: 67,
            bags: 45,
            clothing: 123,
            keys: 34,
            pets: 12,
            other: 41,
          },
          monthlyTrends: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            lost: [45, 52, 67, 89, 76, 92],
            found: [34, 45, 56, 67, 78, 89],
          },
        }

        setStats(mockStats)
        setChartData(mockChartData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [timeRange])

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12.5%',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Items',
      value: stats.openItems.toLocaleString(),
      change: '+8.2%',
      icon: <Package className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingVerifications,
      change: '-5.3%',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+15.7%',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Resolved Claims',
      value: stats.resolvedClaims.toLocaleString(),
      change: '+23.1%',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Avg Resolution Time',
      value: `${stats.avgResolutionTime}h`,
      change: '-12.4%',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-red-500',
    },
  ]

  const userGrowthChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'User Growth',
        data: chartData.userGrowth,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const verificationChartData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [
          chartData.verificationStatus.pending,
          chartData.verificationStatus.approved,
          chartData.verificationStatus.rejected,
        ],
        backgroundColor: [
          'rgba(245, 158, 11, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgb(245, 158, 11)',
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const categoryChartData = {
    labels: Object.keys(chartData.categoryDistribution),
    datasets: [
      {
        label: 'Items by Category',
        data: Object.values(chartData.categoryDistribution),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(14, 165, 233, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(107, 114, 128, 0.7)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(139, 92, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(14, 165, 233)',
          'rgb(236, 72, 153)',
          'rgb(107, 114, 128)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const monthlyTrendsChartData = {
    labels: chartData.monthlyTrends.labels,
    datasets: [
      {
        label: 'Lost Items',
        data: chartData.monthlyTrends.lost,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Found Items',
        data: chartData.monthlyTrends.found,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'reported a lost item',
      item: 'iPhone 14 Pro',
      time: '2 minutes ago',
      type: 'item',
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'completed identity verification',
      item: '',
      time: '15 minutes ago',
      type: 'verification',
    },
    {
      id: 3,
      user: 'Admin',
      action: 'approved a claim',
      item: 'Lost Wallet',
      time: '1 hour ago',
      type: 'claim',
    },
    {
      id: 4,
      user: 'Robert Johnson',
      action: 'reported a found item',
      item: 'Keychain',
      time: '2 hours ago',
      type: 'item',
    },
    {
      id: 5,
      user: 'System',
      action: 'flagged suspicious activity',
      item: 'User #4567',
      time: '3 hours ago',
      type: 'security',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of platform statistics and metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="primary">
            <Activity size={18} className="mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <div className={stat.color.replace('bg-', 'text-')}>
                  {stat.icon}
                </div>
              </div>
              <div className={`flex items-center text-sm ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp size={14} className="mr-1" />
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          <div className="h-64">
            <Line data={userGrowthChartData} options={chartOptions} />
          </div>
        </div>

        {/* Verification Status Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
            <Shield size={20} className="text-gray-400" />
          </div>
          <div className="h-64">
            <Pie data={verificationChartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
            <Package size={20} className="text-gray-400" />
          </div>
          <div className="h-64">
            <Bar data={categoryChartData} options={chartOptions} />
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
            <TrendingUp size={20} className="text-gray-400" />
          </div>
          <div className="h-64">
            <Line data={monthlyTrendsChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          <Activity size={20} className="text-gray-400" />
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'item' ? 'bg-blue-100' :
                  activity.type === 'verification' ? 'bg-green-100' :
                  activity.type === 'claim' ? 'bg-purple-100' :
                  'bg-red-100'
                }`}>
                  {activity.type === 'item' && <Package size={20} className="text-blue-600" />}
                  {activity.type === 'verification' && <Shield size={20} className="text-green-600" />}
                  {activity.type === 'claim' && <DollarSign size={20} className="text-purple-600" />}
                  {activity.type === 'security' && <AlertCircle size={20} className="text-red-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    <span className="font-semibold">{activity.user}</span>{' '}
                    {activity.action}
                    {activity.item && <span className="text-gray-700">: {activity.item}</span>}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Details
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline">View All Activities</Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="flex items-center justify-center">
            <Users size={18} className="mr-2" />
            Manage Users
          </Button>
          <Button variant="outline" className="flex items-center justify-center">
            <Shield size={18} className="mr-2" />
            Review Verifications
          </Button>
          <Button variant="outline" className="flex items-center justify-center">
            <Package size={18} className="mr-2" />
            View Reports
          </Button>
          <Button variant="outline" className="flex items-center justify-center">
            <BarChart3 size={18} className="mr-2" />
            Analytics
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard