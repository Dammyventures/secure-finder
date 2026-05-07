import React, { useState, useMemo, useCallback } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Divider,
  Tab,
  Tabs,
  Avatar,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Collapse,
  CircularProgress,
  Badge,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Drawer,
  Switch,
  FormControlLabel,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as VerifyIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Inventory as InventoryIcon,
  VerifiedUser as VerifiedUserIcon,
  Gavel as GavelIcon,
  Assignment as AssignmentIcon,
  Attachment as AttachmentIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { format, subDays } from 'date-fns'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'

// Mock API Services - Replace with actual imports when files exist
const mockAdminApi = {
  getStats: async (filter: any) => {
    console.log('Fetching stats with filter:', filter)
    return {
      users: {
        total: 1245,
        today: 45,
        yesterday: 32,
        active: 1134,
        pending: 67,
        suspended: 44,
        activePercentage: 91,
      },
      items: {
        total: 567,
        today: 23,
        yesterday: 18,
        active: 432,
        pending: 89,
        resolved: 46,
        activePercentage: 76,
      },
      claims: {
        total: 234,
        today: 12,
        yesterday: 8,
        pending: 67,
        resolved: 145,
        rejected: 22,
      },
      verifications: {
        total: 189,
        today: 9,
        yesterday: 6,
        pending: 45,
        approved: 132,
        rejected: 12,
      },
      trends: Array.from({ length: 30 }, (_, i) => ({
        date: subDays(new Date(), 29 - i).toISOString(),
        users: Math.floor(Math.random() * 100) + 20,
        items: Math.floor(Math.random() * 50) + 10,
        claims: Math.floor(Math.random() * 30) + 5,
        verifications: Math.floor(Math.random() * 20) + 3,
      })),
      locations: [
        { city: 'New York', count: 234, latitude: 40.7128, longitude: -74.006 },
        { city: 'London', count: 189, latitude: 51.5074, longitude: -0.1278 },
        { city: 'Tokyo', count: 156, latitude: 35.6762, longitude: 139.6503 },
        { city: 'Sydney', count: 98, latitude: -33.8688, longitude: 151.2093 },
      ],
    }
  },
  getUsers: async (params: any) => {
    console.log('Fetching users with params:', params)
    return {
      data: Array.from({ length: params.limit }, (_, i) => ({
        id: `user-${i + params.page * params.limit}`,
        fullName: `User ${i + 1}`,
        username: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'verifier' : 'user',
        status: i % 4 === 0 ? 'active' : i % 4 === 1 ? 'pending' : i % 4 === 2 ? 'suspended' : 'active',
        verificationLevel: i % 3 === 0 ? 'basic' : i % 3 === 1 ? 'advanced' : 'pro',
        identityVerified: i % 2 === 0,
        avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
        createdAt: subDays(new Date(), i).toISOString(),
      })),
      total: 1245,
      page: params.page,
      limit: params.limit,
    }
  },
  getItems: async (params: any) => {
    console.log('Fetching items with params:', params)
    return {
      data: Array.from({ length: params.limit }, (_, i) => ({
        id: `item-${i + params.page * params.limit}`,
        title: `Lost Item ${i + 1}`,
        shortId: `ITEM${String(i + 1).padStart(6, '0')}`,
        category: i % 3 === 0 ? 'Electronics' : i % 3 === 1 ? 'Documents' : 'Personal',
        itemType: i % 2 === 0 ? 'lost' : 'found',
        status: i % 4 === 0 ? 'active' : i % 4 === 1 ? 'pending' : i % 4 === 2 ? 'resolved' : 'closed',
        images: [{ thumbnail: `https://picsum.photos/seed/item${i}/100/100` }],
        reportedBy: {
          fullName: `User ${i}`,
          avatar: `https://i.pravatar.cc/150?img=${i}`,
        },
        location: {
          city: i % 4 === 0 ? 'New York' : i % 4 === 1 ? 'London' : i % 4 === 2 ? 'Tokyo' : 'Sydney',
          country: i % 4 === 0 ? 'USA' : i % 4 === 1 ? 'UK' : i % 4 === 2 ? 'Japan' : 'Australia',
        },
        createdAt: subDays(new Date(), i).toISOString(),
      })),
      total: 567,
      page: params.page,
      limit: params.limit,
    }
  },
  getClaims: async (params: any) => {
    console.log('Fetching claims with params:', params)
    return {
      data: Array.from({ length: params.limit }, (_, i) => ({
        id: `claim-${i + params.page * params.limit}`,
        item: {
          title: `Lost Item ${i}`,
          category: i % 3 === 0 ? 'Electronics' : i % 3 === 1 ? 'Documents' : 'Personal',
          images: [{ thumbnail: `https://picsum.photos/seed/item${i}/100/100` }],
        },
        claimant: {
          fullName: `Claimant ${i}`,
          avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
        },
        claimType: i % 2 === 0 ? 'ownership' : 'usage',
        status: i % 4 === 0 ? 'pending' : i % 4 === 1 ? 'under_review' : i % 4 === 2 ? 'approved' : 'rejected',
        verificationLevel: i % 3 === 0 ? 'basic' : i % 3 === 1 ? 'advanced' : 'pro',
        verificationScore: Math.floor(Math.random() * 40) + 60,
        evidence: Array.from({ length: Math.floor(Math.random() * 3) + 1 }),
        createdAt: subDays(new Date(), i).toISOString(),
      })),
      total: 234,
      page: params.page,
      limit: params.limit,
    }
  },
  getVerifications: async (params: any) => {
    console.log('Fetching verifications with params:', params)
    return {
      data: Array.from({ length: params.limit }, (_, i) => ({
        id: `verification-${i + params.page * params.limit}`,
        user: {
          fullName: `User ${i}`,
          email: `user${i}@example.com`,
          avatar: `https://i.pravatar.cc/150?img=${i + 20}`,
        },
        verificationType: i % 3 === 0 ? 'identity' : i % 3 === 1 ? 'address' : 'document',
        status: i % 4 === 0 ? 'pending' : i % 4 === 1 ? 'under_review' : i % 4 === 2 ? 'approved' : 'rejected',
        method: i % 2 === 0 ? 'manual' : 'automatic',
        documents: Array.from({ length: Math.floor(Math.random() * 3) + 1 }),
        verificationScore: Math.floor(Math.random() * 100),
        submittedAt: subDays(new Date(), i).toISOString(),
      })),
      total: 189,
      page: params.page,
      limit: params.limit,
    }
  },
  getActivityLogs: async (params: any) => {
    console.log('Fetching activity logs with params:', params)
    return Array.from({ length: params.limit || 20 }, (_, i) => ({
      id: `activity-${i}`,
      user: {
        name: `User ${i}`,
        avatar: `https://i.pravatar.cc/150?img=${i + 30}`,
      },
      action: i % 4 === 0 ? 'created' : i % 4 === 1 ? 'updated' : i % 4 === 2 ? 'deleted' : 'verified',
      target: i % 5 === 0 ? 'user' : i % 5 === 1 ? 'item' : i % 5 === 2 ? 'claim' : i % 5 === 3 ? 'verification' : 'system',
      details: `Sample activity ${i + 1}`,
      timestamp: subDays(new Date(), Math.floor(i / 5)).toISOString(),
    }))
  },
  getSystemMetrics: async () => {
    return Array.from({ length: 24 }, (_, i) => ({
      timestamp: format(subDays(new Date(), 23 - i), 'MMM dd'),
      cpu: Math.floor(Math.random() * 30) + 20,
      memory: Math.floor(Math.random() * 40) + 30,
      disk: Math.floor(Math.random() * 20) + 60,
      network: Math.floor(Math.random() * 50) + 10,
    }))
  },
  updateUserStatus: async (data: any) => {
    console.log('Updating user status:', data)
    return { success: true }
  },
  updateItemStatus: async (data: any) => {
    console.log('Updating item status:', data)
    return { success: true }
  },
  processVerification: async (data: any) => {
    console.log('Processing verification:', data)
    return { success: true }
  },
  resolveClaim: async (data: any) => {
    console.log('Resolving claim:', data)
    return { success: true }
  },
  deleteRecord: async (data: any) => {
    console.log('Deleting record:', data)
    return { success: true }
  },
  exportData: async () => {
    console.log('Exporting data')
    return { success: true }
  },
  createBackup: async () => {
    console.log('Creating backup')
    return { success: true }
  },
}

// Mock Components - Replace with actual imports when files exist
const StatCard: React.FC<{
  title: string
  value: number
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
  color: string
}> = ({ title, value, change, trend, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4">{value.toLocaleString()}</Typography>
          <Box display="flex" alignItems="center" mt={1}>
            {trend === 'up' ? (
              <ArrowUpwardIcon sx={{ color: '#4CAF50', fontSize: 16 }} />
            ) : (
              <ArrowDownwardIcon sx={{ color: '#F44336', fontSize: 16 }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: trend === 'up' ? '#4CAF50' : '#F44336',
                ml: 0.5,
              }}
            >
              {change}%
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
              vs yesterday
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: '50%',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon as React.ReactElement, { style: { color, fontSize: 28 } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const DataTable: React.FC<{
  title: string
  data: any[]
  total: number
  columns: Array<{
    id: string
    label: string
    align?: 'left' | 'right' | 'center'
    width?: string
    sortable?: boolean
  }>
  loading: boolean
  selectedRows: string[]
  onRowSelect: (id: string) => void
  onSelectAll: (ids: string[]) => void
  onSort: (field: string) => void
  sortBy: string
  sortOrder: 'asc' | 'desc'
  page: number
  rowsPerPage: number
  onPageChange: (event: unknown, page: number) => void
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  renderRow: (row: any) => React.ReactNode
}> = ({
  title,
  data,
  total,
  columns,
  loading,
  selectedRows,
  onRowSelect,
  onSelectAll,
  onSort,
  sortBy,
  sortOrder,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  renderRow,
}) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  style={{ 
                    textAlign: column.align as any, 
                    width: column.width,
                    padding: '16px',
                    borderBottom: '1px solid #e0e0e0'
                  }}
                  onClick={() => column.sortable && onSort(column.id)}
                >
                  {column.label}
                  {column.sortable && (
                    <span style={{ marginLeft: 4 }}>
                      {sortBy === column.id ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px' }}>
                  <CircularProgress />
                </td>
              </tr>
            ) : (
              data.map((row) => renderRow(row))
            )}
          </tbody>
        </table>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            Rows per page:
          </Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={(e) => {
              // Create a proper ChangeEvent
              const event = {
                target: {
                  value: String(e.target.value)
                }
              } as React.ChangeEvent<HTMLInputElement>
              onRowsPerPageChange(event)
            }}
          >
            {[5, 10, 25, 50].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Typography variant="body2">
          {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, total)} of {total}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            size="small" 
            disabled={page === 0}
            onClick={() => onPageChange(null, page - 1)}
          >
            ←
          </IconButton>
          <IconButton 
            size="small" 
            disabled={(page + 1) * rowsPerPage >= total}
            onClick={() => onPageChange(null, page + 1)}
          >
            →
          </IconButton>
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const ActivityFeed: React.FC<{
  activities: any[]
  loading: boolean
  title: string
  onRefresh: () => void
}> = ({ activities, loading, title, onRefresh }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{title}</Typography>
        <IconButton size="small" onClick={onRefresh} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {activities.map((activity) => (
            <Box key={activity.id} mb={2} display="flex" alignItems="flex-start">
              <Avatar src={activity.user?.avatar} sx={{ mr: 2 }}>
                {activity.user?.name?.charAt(0)}
              </Avatar>
              <Box flex={1}>
                <Typography variant="body2">
                  <strong>{activity.user?.name}</strong> {activity.action}{' '}
                  {activity.target}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {activity.details}
                </Typography>
                <Typography variant="caption" display="block" color="textSecondary">
                  {format(new Date(activity.timestamp), 'MMM dd, hh:mm a')}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </CardContent>
  </Card>
)

const SystemStatus: React.FC<{
  metrics: any[]
  loading: boolean
  onRefresh: () => void
}> = ({ metrics, loading, onRefresh }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">System Status</Typography>
        <IconButton size="small" onClick={onRefresh} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          {['CPU', 'Memory', 'Disk', 'Network'].map((metric, index) => {
            const latestMetric = metrics[metrics.length - 1]
            const value = latestMetric?.[metric.toLowerCase()] || 0
            return (
              <Box key={metric} mb={2}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">{metric} Usage</Typography>
                  <Typography variant="body2">{value}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={value}
                  sx={{ height: 6, borderRadius: 3 }}
                  color={
                    value < 70 ? 'success' : value < 85 ? 'warning' : 'error'
                  }
                />
              </Box>
            )
          })}
        </Box>
      )}
    </CardContent>
  </Card>
)

const QuickActions: React.FC<{
  onAction: (action: string) => void
}> = ({ onAction }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {[
          { icon: <AddIcon />, label: 'Add User', action: 'add_user' },
          { icon: <VerifyIcon />, label: 'Verify All', action: 'verify_all' },
          { icon: <DownloadIcon />, label: 'Export Data', action: 'export_data' },
          { icon: <RefreshIcon />, label: 'System Backup', action: 'system_backup' },
        ].map((item) => (
          <Button
            key={item.action}
            variant="outlined"
            startIcon={item.icon}
            onClick={() => onAction(item.action)}
            sx={{ flex: '1 0 calc(50% - 8px)', minWidth: '120px' }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </CardContent>
  </Card>
)

const MapView: React.FC<{
  data: any[]
}> = ({ data }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Activity Map
      </Typography>
      <Box
        sx={{
          height: 300,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <Box textAlign="center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Activity Map
          </Typography>
          <Typography variant="body2">
            Showing activity from {data.length} locations
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
)

// Types
interface DashboardFilter {
  dateRange: {
    start: Date
    end: Date
  }
  status?: string
  category?: string
  location?: string
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      style={{ height: '100%' }}
    >
      {value === index && <Box sx={{ p: 3, height: '100%' }}>{children}</Box>}
    </div>
  )
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // State management
  const [tabValue, setTabValue] = useState(0)
  const [filter, setFilter] = useState<DashboardFilter>({
    dateRange: {
      start: subDays(new Date(), 30),
      end: new Date()
    }
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'view' | 'edit' | 'delete' | 'action'>('view')
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error' | 'warning' | 'info'
  }>({
    open: false,
    message: '',
    severity: 'info'
  })

  // Data fetching
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['adminStats', filter],
    queryFn: () => mockAdminApi.getStats(filter),
    refetchInterval: 30000
  })

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers', page, rowsPerPage, sortBy, sortOrder, searchQuery, filter],
    queryFn: () => mockAdminApi.getUsers({
      page: page + 1,
      limit: rowsPerPage,
      sortBy,
      sortOrder,
      search: searchQuery,
      ...filter
    }),
    placeholderData: (previousData) => previousData,
  })

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ['adminItems', page, rowsPerPage, sortBy, sortOrder, searchQuery, filter],
    queryFn: () => mockAdminApi.getItems({
      page: page + 1,
      limit: rowsPerPage,
      sortBy,
      sortOrder,
      search: searchQuery,
      ...filter
    }),
    placeholderData: (previousData) => previousData,
  })

  const { data: claims, isLoading: claimsLoading } = useQuery({
    queryKey: ['adminClaims', page, rowsPerPage, sortBy, sortOrder, searchQuery, filter],
    queryFn: () => mockAdminApi.getClaims({
      page: page + 1,
      limit: rowsPerPage,
      sortBy,
      sortOrder,
      search: searchQuery,
      ...filter
    }),
    placeholderData: (previousData) => previousData,
  })

  const { data: verifications, isLoading: verificationsLoading } = useQuery({
    queryKey: ['adminVerifications', page, rowsPerPage, sortBy, sortOrder, searchQuery, filter],
    queryFn: () => mockAdminApi.getVerifications({
      page: page + 1,
      limit: rowsPerPage,
      sortBy,
      sortOrder,
      search: searchQuery,
      ...filter
    }),
    placeholderData: (previousData) => previousData,
  })

  const { data: activityLogs, isLoading: activityLoading } = useQuery({
    queryKey: ['adminActivity'],
    queryFn: () => mockAdminApi.getActivityLogs({ limit: 20 }),
    refetchInterval: 15000
  })

  const { data: systemMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['systemMetrics'],
    queryFn: () => mockAdminApi.getSystemMetrics(),
    refetchInterval: 10000
  })

  // Mutations
  const updateUserStatusMutation = useMutation({
    mutationFn: mockAdminApi.updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      showSnackbar('User status updated successfully', 'success')
    },
    onError: (error: any) => {
      showSnackbar(error.message || 'Failed to update user status', 'error')
    }
  })

  const updateItemStatusMutation = useMutation({
    mutationFn: mockAdminApi.updateItemStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminItems'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      showSnackbar('Item status updated successfully', 'success')
    },
    onError: (error: any) => {
      showSnackbar(error.message || 'Failed to update item status', 'error')
    }
  })

  const processVerificationMutation = useMutation({
    mutationFn: mockAdminApi.processVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVerifications'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      showSnackbar('Verification processed successfully', 'success')
    },
    onError: (error: any) => {
      showSnackbar(error.message || 'Failed to process verification', 'error')
    }
  })

  const resolveClaimMutation = useMutation({
    mutationFn: mockAdminApi.resolveClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminClaims'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      showSnackbar('Claim resolved successfully', 'success')
    },
    onError: (error: any) => {
      showSnackbar(error.message || 'Failed to resolve claim', 'error')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: mockAdminApi.deleteRecord,
    onSuccess: (_, variables) => {
      const { type } = variables
      queryClient.invalidateQueries({ 
        queryKey: [`admin${type.charAt(0).toUpperCase() + type.slice(1)}s`] 
      })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      showSnackbar(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, 'success')
    },
    onError: (error: any) => {
      showSnackbar(error.message || 'Failed to delete record', 'error')
    }
  })

  // Event handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setPage(0)
    setSelectedRows([])
  }

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setPage(0)
  }, [])

  const handleFilterChange = useCallback((newFilter: Partial<DashboardFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }))
    setPage(0)
  }, [])

  const handleSort = useCallback((field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }, [sortBy, sortOrder])

  const handleRowSelect = useCallback((id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    )
  }, [])

  const handleSelectAll = useCallback((ids: string[]) => {
    if (selectedRows.length === ids.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(ids)
    }
  }, [selectedRows.length])

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedItem(item)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedItem(null)
  }

  const handleDialogOpen = (type: 'view' | 'edit' | 'delete' | 'action', item?: any) => {
    setDialogType(type)
    setSelectedItem(item || null)
    setDialogOpen(true)
    handleMenuClose()
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedItem(null)
  }

  const handleAction = async (action: string, data?: any) => {
    try {
      switch (action) {
        case 'verify_user':
          await updateUserStatusMutation.mutateAsync({
            userId: selectedItem.id,
            status: 'active',
            verificationLevel: 'advanced'
          })
          break
        case 'suspend_user':
          await updateUserStatusMutation.mutateAsync({
            userId: selectedItem.id,
            status: 'suspended',
            reason: data?.reason || 'Violation of terms'
          })
          break
        case 'approve_verification':
          await processVerificationMutation.mutateAsync({
            verificationId: selectedItem.id,
            status: 'verified',
            notes: data?.notes
          })
          break
        case 'reject_verification':
          await processVerificationMutation.mutateAsync({
            verificationId: selectedItem.id,
            status: 'rejected',
            notes: data?.notes
          })
          break
        case 'resolve_claim':
          await resolveClaimMutation.mutateAsync({
            claimId: selectedItem.id,
            status: 'resolved',
            resolution: data?.resolution
          })
          break
        case 'delete':
          await deleteMutation.mutateAsync({
            type: selectedItem.type,
            id: selectedItem.id
          })
          break
        default:
          break
      }
      handleDialogClose()
    } catch (error) {
      console.error('Action failed:', error)
    }
  }

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  // Data processing
  const processedStats = useMemo(() => {
    if (!stats) return null

    const growth = {
      users: stats.users.today - stats.users.yesterday,
      items: stats.items.today - stats.items.yesterday,
      claims: stats.claims.today - stats.claims.yesterday,
      verifications: stats.verifications.today - stats.verifications.yesterday
    }

    const growthPercent = {
      users: stats.users.yesterday > 0 
        ? ((growth.users / stats.users.yesterday) * 100).toFixed(1)
        : '0',
      items: stats.items.yesterday > 0 
        ? ((growth.items / stats.items.yesterday) * 100).toFixed(1)
        : '0',
      claims: stats.claims.yesterday > 0 
        ? ((growth.claims / stats.claims.yesterday) * 100).toFixed(1)
        : '0',
      verifications: stats.verifications.yesterday > 0 
        ? ((growth.verifications / stats.verifications.yesterday) * 100).toFixed(1)
        : '0'
    }

    return { ...stats, growth, growthPercent }
  }, [stats])

  const chartData = useMemo(() => {
    if (!stats?.trends) return []
    
    return stats.trends.map((trend: any) => ({
      date: format(new Date(trend.date), 'MMM dd'),
      users: trend.users,
      items: trend.items,
      claims: trend.claims,
      verifications: trend.verifications
    }))
  }, [stats?.trends])

  const pieData = useMemo(() => {
    if (!stats) return []
    
    return [
      { name: 'Users', value: stats.users.total },
      { name: 'Active Items', value: stats.items.active },
      { name: 'Pending Claims', value: stats.claims.pending },
      { name: 'Verifications', value: stats.verifications.pending }
    ]
  }, [stats])

  const locationData = useMemo(() => {
    if (!stats?.locations) return []
    
    return stats.locations.map((loc: any) => ({
      name: loc.city,
      value: loc.count,
      coordinates: [loc.latitude, loc.longitude]
    }))
  }, [stats?.locations])

  const STATUS_COLORS: Record<string, string> = {
    active: '#4CAF50',
    pending: '#FFC107',
    suspended: '#F44336',
    verified: '#2196F3',
    rejected: '#9E9E9E',
    open: '#FF9800',
    closed: '#607D8B',
    resolved: '#4CAF50',
    under_review: '#FF9800',
    approved: '#4CAF50',
  }

  // Render functions
  const renderStatsCards = () => {
    if (statsLoading || !processedStats) {
      return [0, 1, 2, 3].map((index) => (
        <Grid key={index} item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Loading...
                  </Typography>
                  <Typography variant="h4">
                    <CircularProgress size={24} />
                  </Typography>
                </Box>
                <CircularProgress size={40} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))
    }

    const statItems = [
      {
        title: 'Total Users',
        value: processedStats.users.total,
        change: processedStats.growthPercent.users,
        trend: (processedStats.growth.users > 0 ? 'up' : 'down') as 'up' | 'down',
        icon: <PeopleIcon />,
        color: '#2196F3'
      },
      {
        title: 'Active Items',
        value: processedStats.items.active,
        change: `${processedStats.items.activePercentage}%`,
        trend: 'up' as 'up' | 'down',
        icon: <InventoryIcon />,
        color: '#4CAF50'
      },
      {
        title: 'Pending Claims',
        value: processedStats.claims.pending,
        change: processedStats.growthPercent.claims,
        trend: (processedStats.growth.claims > 0 ? 'up' : 'down') as 'up' | 'down',
        icon: <AssignmentIcon />,
        color: '#FF9800'
      },
      {
        title: 'Verifications',
        value: processedStats.verifications.pending,
        change: processedStats.growthPercent.verifications,
        trend: (processedStats.growth.verifications > 0 ? 'up' : 'down') as 'up' | 'down',
        icon: <VerifiedUserIcon />,
        color: '#9C27B0'
      }
    ]

    return statItems.map((stat, index) => (
      <Grid key={index} item xs={12} sm={6} md={3}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      </Grid>
    ))
  }

  const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  const renderCharts = () => (
    <>
      {/* Line Chart - Trends */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Card sx={{ flex: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Activity Trends (Last 30 Days)</Typography>
                <Box>
                  <Button size="small" startIcon={<DownloadIcon />}>
                    Export
                  </Button>
                </Box>
              </Box>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#2196F3" fill="#2196F3" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="items" stackId="1" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="claims" stackId="1" stroke="#FF9800" fill="#FF9800" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* Pie Chart - Distribution */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Distribution
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Bar Chart - Performance */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Performance
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={systemMetrics || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="cpu" fill="#2196F3" name="CPU Usage %" />
                  <Bar dataKey="memory" fill="#4CAF50" name="Memory Usage %" />
                  <Bar dataKey="disk" fill="#FF9800" name="Disk Usage %" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  )

  const renderUsersTable = () => {
    const usersData = users?.data || []
    const allIds = usersData.map((user: any) => user.id)
    
    return (
      <DataTable
        title="User Management"
        data={usersData}
        total={users?.total || 0}
        columns={[
          { id: 'select', label: '', align: 'center', width: '50px' },
          { id: 'avatar', label: '', align: 'center', width: '50px' },
          { id: 'fullName', label: 'Name', sortable: true },
          { id: 'email', label: 'Email', sortable: true },
          { id: 'role', label: 'Role', sortable: true },
          { id: 'status', label: 'Status', sortable: true },
          { id: 'verification', label: 'Verification', sortable: true },
          { id: 'createdAt', label: 'Joined', sortable: true },
          { id: 'actions', label: 'Actions', align: 'right' }
        ]}
        loading={usersLoading}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        onSelectAll={() => handleSelectAll(allIds)}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        renderRow={(row: any) => (
          <tr style={{ backgroundColor: selectedRows.includes(row.id) ? '#f5f5f5' : 'transparent' }}>
            <td style={{ padding: '16px', textAlign: 'center' }}>
              <Checkbox
                checked={selectedRows.includes(row.id)}
                onChange={() => handleRowSelect(row.id)}
              />
            </td>
            <td style={{ padding: '16px', textAlign: 'center' }}>
              <Avatar src={row.avatar}>
                {row.fullName.charAt(0)}
              </Avatar>
            </td>
            <td style={{ padding: '16px' }}>
              <Typography variant="body2" fontWeight="medium">
                {row.fullName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                @{row.username}
              </Typography>
            </td>
            <td style={{ padding: '16px' }}>{row.email}</td>
            <td style={{ padding: '16px' }}>
              <Chip
                label={row.role}
                size="small"
                color={row.role === 'admin' ? 'primary' : 'default'}
                variant="outlined"
              />
            </td>
            <td style={{ padding: '16px' }}>
              <Chip
                label={row.status}
                size="small"
                sx={{
                  backgroundColor: `${STATUS_COLORS[row.status] || '#9E9E9E'}20`,
                  color: STATUS_COLORS[row.status] || '#9E9E9E',
                  fontWeight: 'medium'
                }}
              />
            </td>
            <td style={{ padding: '16px' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={row.verificationLevel}
                  size="small"
                  variant="outlined"
                />
                {row.identityVerified && (
                  <VerifiedUserIcon fontSize="small" color="success" />
                )}
              </Box>
            </td>
            <td style={{ padding: '16px' }}>
              <Typography variant="body2">
                {format(new Date(row.createdAt), 'MMM dd, yyyy')}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {format(new Date(row.createdAt), 'hh:mm a')}
              </Typography>
            </td>
            <td style={{ padding: '16px', textAlign: 'right' }}>
              <IconButton size="small" onClick={(e) => handleMenuOpen(e, { ...row, type: 'user' })}>
                <MoreVertIcon />
              </IconButton>
            </td>
          </tr>
        )}
      />
    )
  }

  const renderItemsTable = () => {
    const itemsData = items?.data || []
    const allIds = itemsData.map((item: any) => item.id)
    
    return (
      <DataTable
        title="Lost & Found Items"
        data={itemsData}
        total={items?.total || 0}
        columns={[
          { id: 'select', label: '', align: 'center', width: '50px' },
          { id: 'image', label: '', align: 'center', width: '70px' },
          { id: 'title', label: 'Title', sortable: true },
          { id: 'category', label: 'Category', sortable: true },
          { id: 'type', label: 'Type', sortable: true },
          { id: 'status', label: 'Status', sortable: true },
          { id: 'reportedBy', label: 'Reported By', sortable: true },
          { id: 'location', label: 'Location', sortable: true },
          { id: 'createdAt', label: 'Reported', sortable: true },
          { id: 'actions', label: 'Actions', align: 'right' }
        ]}
        loading={itemsLoading}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        onSelectAll={() => handleSelectAll(allIds)}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        renderRow={(row: any) => (
          <tr style={{ backgroundColor: selectedRows.includes(row.id) ? '#f5f5f5' : 'transparent' }}>
            <td style={{ padding: '16px', textAlign: 'center' }}>
              <Checkbox
                checked={selectedRows.includes(row.id)}
                onChange={() => handleRowSelect(row.id)}
              />
            </td>
            <td style={{ padding: '16px', textAlign: 'center' }}>
              <Avatar
                variant="rounded"
                src={row.images?.[0]?.thumbnail}
                sx={{ width: 56, height: 56 }}
              >
                <InventoryIcon />
              </Avatar>
            </td>
            <td style={{ padding: '16px' }}>
              <Typography variant="body2" fontWeight="medium">
                {row.title}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                ID: {row.shortId}
              </Typography>
            </td>
            <td style={{ padding: '16px' }}>
              <Chip
                label={row.category}
                size="small"
                variant="outlined"
              />
            </td>
            <td style={{ padding: '16px' }}>
              <Chip
                label={row.itemType}
                size="small"
                color={row.itemType === 'lost' ? 'error' : 'success'}
              />
            </td>
            <td style={{ padding: '16px' }}>
              <Chip
                label={row.status}
                size="small"
                sx={{
                  backgroundColor: `${STATUS_COLORS[row.status] || '#9E9E9E'}20`,
                  color: STATUS_COLORS[row.status] || '#9E9E9E',
                  fontWeight: 'medium'
                }}
              />
            </td>
            <td style={{ padding: '16px' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar src={row.reportedBy?.avatar} sx={{ width: 24, height: 24 }}>
                  {row.reportedBy?.fullName?.charAt(0)}
                </Avatar>
                <Typography variant="body2">
                  {row.reportedBy?.fullName}
                </Typography>
              </Box>
            </td>
            <td style={{ padding: '16px' }}>
              <Typography variant="body2">
                {row.location?.city}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {row.location?.country}
              </Typography>
            </td>
            <td style={{ padding: '16px' }}>
              <Typography variant="body2">
                {format(new Date(row.createdAt), 'MMM dd, yyyy')}
              </Typography>
            </td>
            <td style={{ padding: '16px', textAlign: 'right' }}>
              <IconButton size="small" onClick={(e) => handleMenuOpen(e, { ...row, type: 'item' })}>
                <MoreVertIcon />
              </IconButton>
            </td>
          </tr>
        )}
      />
    )
  }

  const renderClaimsTable = () => {
    const claimsData = claims?.data || []
    const allIds = claimsData.map((claim: any) => claim.id)
    
    return (
      <DataTable
        title="Item Claims"
        data={claimsData}
        total={claims?.total || 0}
        columns={[
          { id: 'select', label: '', align: 'center', width: '50px' },
          { id: 'item', label: 'Item', sortable: true },
          { id: 'claimant', label: 'Claimant', sortable: true },
          { id: 'type', label: 'Claim Type', sortable: true },
          { id: 'status', label: 'Status', sortable: true },
          { id: 'verification', label: 'Verification', sortable: true },
          { id: 'evidence', label: 'Evidence', sortable: true },
          { id: 'createdAt', label: 'Submitted', sortable: true },
          { id: 'actions', label: 'Actions', align: 'right' }
        ]}
        loading={claimsLoading}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        onSelectAll={() => handleSelectAll(allIds)}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        renderRow={(row: any) => (
          <tr style={{ backgroundColor: selectedRows.includes(row.id) ? '#f5f5f5' : 'transparent' }}>
            <td style={{ padding: '16px', textAlign: 'center' }}>
              <Checkbox
                checked={selectedRows.includes(row.id)}
                onChange={() => handleRowSelect(row.id)}
              />
            </td>
            <td style={{ padding: '16px' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar
                  variant="rounded"
                  src={row.item?.images?.[0]?.thumbnail}
                  sx={{ width: 40, height: 40 }}
                >
                  <InventoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {row.item?.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {row.item?.category}
                  </Typography>
                </Box>
              </Box>
            </td>
            <td style={{ padding: '16px' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar src={row.claimant?.avatar} sx={{ width: 24, height: 24 }}>
                  {row.claimant?.fullName?.charAt(0)}
                </Avatar>
                <Typography variant="body2">
                  {row.claimant?.fullName}
                </Typography>
              </Box>
            </td>
            <td style={{ padding: '16px' }}>
              <Chip
                label={row.claimType}
                size="small"
                variant="outlined"
              />
            </td>
            <td style={{ padding: '16px' }}>
              <Chip
                label={row.status}
                size="small"
                sx={{
                  backgroundColor: `${STATUS_COLORS[row.status] || '#9E9E9E'}20`,
                  color: STATUS_COLORS[row.status] || '#9E9E9E',
                  fontWeight: 'medium'
                }}
              />
            </td>
            <td style={{ padding: '16px' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2">
                  Level: {row.verificationLevel}
                </Typography>
                {row.verificationScore >= 80 && (
                  <VerifiedUserIcon fontSize="small" color="success" />
                )}
              </Box>
            </td>
            <td style={{ padding: '16px' }}>
              <Chip
                icon={<AttachmentIcon />}
                label={`${row.evidence?.length || 0} files`}
                size="small"
                variant="outlined"
              />
            </td>
            <td style={{ padding: '16px' }}>
              <Typography variant="body2">
                {format(new Date(row.createdAt), 'MMM dd, yyyy')}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {format(new Date(row.createdAt), 'hh:mm a')}
              </Typography>
            </td>
            <td style={{ padding: '16px', textAlign: 'right' }}>
              <IconButton size="small" onClick={(e) => handleMenuOpen(e, { ...row, type: 'claim' })}>
                <MoreVertIcon />
              </IconButton>
            </td>
          </tr>
        )}
      />
    )
  }

  const renderVerificationsTable = () => {
    const verificationsData = verifications?.data || []
    const allIds = verificationsData.map((verification: any) => verification.id)
    
    return (
      <DataTable
        title="Identity Verifications"
        data={verificationsData}
        total={verifications?.total || 0}
        columns={[
          { id: 'select', label: '', align: 'center', width: '50px' },
          { id: 'user', label: 'User', sortable: true },
          { id: 'type', label: 'Type', sortable: true },
          { id: 'status', label: 'Status', sortable: true },
          { id: 'method', label: 'Method', sortable: true },
          { id: 'documents', label: 'Documents', sortable: true },
          { id: 'score', label: 'Score', sortable: true },
          { id: 'submittedAt', label: 'Submitted', sortable: true },
          { id: 'actions', label: 'Actions', align: 'right' }
        ]}
        loading={verificationsLoading}
        selectedRows={selectedRows}
        onRowSelect={handleRowSelect}
        onSelectAll={() => handleSelectAll(allIds)}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        renderRow={(row: any) => (
          <tr style={{ backgroundColor: selectedRows.includes(row.id) ? '#f5f5f5' : 'transparent' }}>
            <td style={{ padding: '16px', textAlign: 'center' }}>
              <Checkbox
                checked={selectedRows.includes(row.id)}
                onChange={() => handleRowSelect(row.id)}
              />
            </td>
            <td style={{ padding: '16px' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar src={row.user?.avatar} sx={{ width: 24, height: 24 }}>
                  {row.user?.fullName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {row.user?.fullName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {row.user?.email}
                  </Typography>
                </Box>
              </Box>
            </td>
            <td style={{ padding: '16px' }}>
              <Chip
                label={row.verificationType}
                size="small"
                variant="outlined"
              />
            </td>
            <td style={{ padding: '16px' }}>
              <Chip
                label={row.status}
                size="small"
                sx={{
                  backgroundColor: `${STATUS_COLORS[row.status] || '#9E9E9E'}20`,
                  color: STATUS_COLORS[row.status] || '#9E9E9E',
                  fontWeight: 'medium'
                }}
              />
            </td>
            <td style={{ padding: '16px' }}>
              <Typography variant="body2">
                {row.method}
              </Typography>
            </td>
            <td style={{ padding: '16px' }}>
              <Chip
                icon={<DescriptionIcon />}
                label={`${row.documents?.length || 0} docs`}
                size="small"
                variant="outlined"
              />
            </td>
            <td style={{ padding: '16px' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <LinearProgress
                  variant="determinate"
                  value={row.verificationScore || 0}
                  sx={{ width: 60, height: 6, borderRadius: 3 }}
                  color={
                    (row.verificationScore || 0) >= 80 ? 'success' :
                    (row.verificationScore || 0) >= 60 ? 'warning' : 'error'
                  }
                />
                <Typography variant="body2">
                  {row.verificationScore || 0}%
                </Typography>
              </Box>
            </td>
            <td style={{ padding: '16px' }}>
              <Typography variant="body2">
                {format(new Date(row.submittedAt), 'MMM dd, yyyy')}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {format(new Date(row.submittedAt), 'hh:mm a')}
              </Typography>
            </td>
            <td style={{ padding: '16px', textAlign: 'right' }}>
              <IconButton size="small" onClick={(e) => handleMenuOpen(e, { ...row, type: 'verification' })}>
                <MoreVertIcon />
              </IconButton>
            </td>
          </tr>
        )}
      />
    )
  }

  const renderDashboard = () => (
    <Box>
      {/* Stats Overview */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        {renderStatsCards()}
      </Box>

      {/* Charts */}
      {renderCharts()}

      {/* Activity Feed & System Status */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 2 }}>
        <Box sx={{ flex: 2 }}>
          <ActivityFeed
            activities={activityLogs || []}
            loading={activityLoading}
            title="Recent Activity"
            onRefresh={() => queryClient.invalidateQueries({ queryKey: ['adminActivity'] })}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <SystemStatus
            metrics={systemMetrics || []}
            loading={metricsLoading}
            onRefresh={() => queryClient.invalidateQueries({ queryKey: ['systemMetrics'] })}
          />
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mt: 3 }}>
        <QuickActions
          onAction={(action) => {
            switch (action) {
              case 'add_user':
                navigate('/admin/users/new')
                break
              case 'verify_all':
                showSnackbar('Bulk verification started', 'info')
                break
              case 'export_data':
                mockAdminApi.exportData()
                showSnackbar('Export started', 'info')
                break
              case 'system_backup':
                mockAdminApi.createBackup()
                showSnackbar('Backup started', 'info')
                break
            }
          }}
        />
      </Box>

      {/* Map View */}
      <Box sx={{ mt: 3 }}>
        <MapView data={locationData} />
      </Box>
    </Box>
  )

  const renderDialog = () => {
    switch (dialogType) {
      case 'view':
        return (
          <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              View Details
              <IconButton
                aria-label="close"
                onClick={handleDialogClose}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {selectedItem && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedItem.type} Details
                  </Typography>
                  <pre style={{ fontSize: '0.875rem', overflow: 'auto' }}>
                    {JSON.stringify(selectedItem, null, 2)}
                  </pre>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
          </Dialog>
        )

      case 'edit':
        return (
          <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Edit {selectedItem?.type}</DialogTitle>
            <DialogContent dividers>
              <Typography>Edit form for {selectedItem?.type}</Typography>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                defaultValue={selectedItem?.fullName || selectedItem?.title}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button variant="contained" onClick={() => handleAction('update')}>
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        )

      case 'delete':
        return (
          <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            maxWidth="xs"
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this {selectedItem?.type}? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleAction('delete')}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        )

      default:
        return null
    }
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Admin Dashboard
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Welcome back, Administrator. Here's what's happening with your platform.
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                refetchStats()
                queryClient.invalidateQueries()
              }}
              disabled={statsLoading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<SettingsIcon />}
              onClick={() => setShowSettings(true)}
            >
              Settings
            </Button>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Box display="flex" gap={2} mb={3}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => {
              mockAdminApi.exportData()
              showSnackbar('Export started', 'info')
            }}
          >
            Export
          </Button>
        </Box>

        {/* Filter Panel */}
        <Collapse in={showFilters}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 200px' }}>
                <TextField
                  label="Date From"
                  type="date"
                  size="small"
                  fullWidth
                  value={format(filter.dateRange.start, 'yyyy-MM-dd')}
                  onChange={(e) => handleFilterChange({
                    dateRange: { ...filter.dateRange, start: new Date(e.target.value) }
                  })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px' }}>
                <TextField
                  label="Date To"
                  type="date"
                  size="small"
                  fullWidth
                  value={format(filter.dateRange.end, 'yyyy-MM-dd')}
                  onChange={(e) => handleFilterChange({
                    dateRange: { ...filter.dateRange, end: new Date(e.target.value) }
                  })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ flex: '1 1 150px' }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filter.status || ''}
                    label="Status"
                    onChange={(e) => handleFilterChange({ status: e.target.value })}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 100px' }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    setFilter({
                      dateRange: {
                        start: subDays(new Date(), 30),
                        end: new Date()
                      }
                    })
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Box>
          </Paper>
        </Collapse>
      </Box>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab 
            icon={
              <Badge badgeContent={processedStats?.users.pending || 0} color="error">
                <PeopleIcon />
              </Badge>
            } 
            label="Users" 
          />
          <Tab 
            icon={
              <Badge badgeContent={processedStats?.items.pending || 0} color="warning">
                <InventoryIcon />
              </Badge>
            } 
            label="Items" 
          />
          <Tab 
            icon={
              <Badge badgeContent={processedStats?.claims.pending || 0} color="info">
                <AssignmentIcon />
              </Badge>
            } 
            label="Claims" 
          />
          <Tab 
            icon={
              <Badge badgeContent={processedStats?.verifications.pending || 0} color="secondary">
                <VerifiedUserIcon />
              </Badge>
            } 
            label="Verifications" 
          />
        </Tabs>

        {/* Tab Content */}
        <TabPanel value={tabValue} index={0}>
          {renderDashboard()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderUsersTable()}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderItemsTable()}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          {renderClaimsTable()}
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          {renderVerificationsTable()}
        </TabPanel>
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleDialogOpen('view', selectedItem)}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDialogOpen('edit', selectedItem)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        {selectedItem?.type === 'user' && (
          <>
            {selectedItem?.status !== 'active' && (
              <MenuItem onClick={() => handleAction('verify_user')}>
                <ListItemIcon>
                  <VerifyIcon fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText>Verify User</ListItemText>
              </MenuItem>
            )}
            {selectedItem?.status !== 'suspended' && (
              <MenuItem onClick={() => handleAction('suspend_user')}>
                <ListItemIcon>
                  <BlockIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Suspend User</ListItemText>
              </MenuItem>
            )}
          </>
        )}
        {selectedItem?.type === 'verification' && (
          <>
            <MenuItem onClick={() => handleAction('approve_verification')}>
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Approve Verification</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleAction('reject_verification')}>
              <ListItemIcon>
                <CancelIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Reject Verification</ListItemText>
            </MenuItem>
          </>
        )}
        {selectedItem?.type === 'claim' && (
          <MenuItem onClick={() => handleAction('resolve_claim')}>
            <ListItemIcon>
              <GavelIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Resolve Claim</ListItemText>
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={() => handleDialogOpen('delete', selectedItem)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      {renderDialog()}

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={showSettings}
        onClose={() => setShowSettings(false)}
      >
        <Box sx={{ width: 400, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Dashboard Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Auto-refresh data"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Show notifications"
          />
          <FormControlLabel
            control={<Switch />}
            label="Dark mode"
          />
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Refresh Interval
            </Typography>
            <Select size="small" fullWidth defaultValue="30">
              <MenuItem value="10">10 seconds</MenuItem>
              <MenuItem value="30">30 seconds</MenuItem>
              <MenuItem value="60">1 minute</MenuItem>
              <MenuItem value="300">5 minutes</MenuItem>
            </Select>
          </Box>
        </Box>
      </Drawer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Speed Dial for quick actions */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Add New"
          onClick={() => navigate('/admin/users/new')}
        />
        <SpeedDialAction
          icon={<PrintIcon />}
          tooltipTitle="Print Report"
          onClick={() => window.print()}
        />
        <SpeedDialAction
          icon={<ShareIcon />}
          tooltipTitle="Share"
          onClick={() => showSnackbar('Share feature coming soon', 'info')}
        />
      </SpeedDial>
    </Box>
  )
}

export default AdminDashboard