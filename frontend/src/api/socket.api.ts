import { io, Socket } from 'socket.io-client'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  metadata?: Record<string, any>
}

interface SocketEvents {
  // Client to Server events
  'join:user': (userId: string) => void
  'join:item': (itemId: string) => void
  'send:message': (data: {
    to: string
    message: string
    type: 'text' | 'image' | 'file'
  }) => void
  'typing:start': (to: string) => void
  'typing:stop': (to: string) => void
  
  // Server to Client events
  'notification:new': (notification: Notification) => void
  'notification:read': (notificationId: string) => void
  'message:received': (data: {
    from: string
    message: string
    timestamp: Date
    type: 'text' | 'image' | 'file'
  }) => void
  'item:matched': (data: {
    itemId: string
    matchedItemId: string
    confidence: number
  }) => void
  'verification:status': (data: {
    verificationId: string
    status: 'pending' | 'processing' | 'verified' | 'rejected'
    message?: string
  }) => void
  'claim:updated': (data: {
    claimId: string
    status: 'pending' | 'under_review' | 'approved' | 'rejected'
    message?: string
  }) => void
  'user:typing': (userId: string) => void
  'user:stopped-typing': (userId: string) => void
  'call:incoming': (data: {
    callId: string
    from: string
    type: 'audio' | 'video'
  }) => void
  'call:accepted': (data: {
    callId: string
    sdp: RTCSessionDescriptionInit
  }) => void
  'call:rejected': (callId: string) => void
  'call:ended': (callId: string) => void
  'ice:candidate': (data: {
    callId: string
    candidate: RTCIceCandidateInit
  }) => void
}

class SocketService {
  private socket: Socket | null = null
  private isConnected: boolean = false
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 5
  private eventCallbacks: Map<string, Function[]> = new Map()

  constructor() {
    this.initializeSocket()
  }

  private initializeSocket(): void {
    const token = localStorage.getItem('token')
    if (!token) return

    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token: `Bearer ${token}`
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true
    })

    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id)
      this.isConnected = true
      this.reconnectAttempts = 0
      this.emitEvent('socket:connected', this.socket?.id)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      this.isConnected = false
      this.emitEvent('socket:disconnected', reason)
      
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        setTimeout(() => {
          this.socket?.connect()
        }, 1000)
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message)
      this.reconnectAttempts++
      this.emitEvent('socket:error', error)
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached')
        this.emitEvent('socket:reconnect-failed')
      }
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts')
      this.emitEvent('socket:reconnected', attemptNumber)
    })

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Reconnection attempt:', attemptNumber)
    })

    this.socket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error)
    })

    this.socket.on('reconnect_failed', () => {
      console.error('Reconnection failed')
      this.emitEvent('socket:reconnect-failed')
    })

    // Custom event handlers
    this.socket.on('notification:new', (notification: Notification) => {
      console.log('New notification:', notification)
      this.emitEvent('notification:new', notification)
    })

    this.socket.on('message:received', (data) => {
      console.log('Message received:', data)
      this.emitEvent('message:received', data)
    })

    this.socket.on('item:matched', (data) => {
      console.log('Item matched:', data)
      this.emitEvent('item:matched', data)
    })

    this.socket.on('verification:status', (data) => {
      console.log('Verification status update:', data)
      this.emitEvent('verification:status', data)
    })

    this.socket.on('claim:updated', (data) => {
      console.log('Claim updated:', data)
      this.emitEvent('claim:updated', data)
    })

    this.socket.on('call:incoming', (data) => {
      console.log('Incoming call:', data)
      this.emitEvent('call:incoming', data)
    })

    this.socket.on('call:accepted', (data) => {
      console.log('Call accepted:', data)
      this.emitEvent('call:accepted', data)
    })

    this.socket.on('call:rejected', (callId) => {
      console.log('Call rejected:', callId)
      this.emitEvent('call:rejected', callId)
    })

    this.socket.on('call:ended', (callId) => {
      console.log('Call ended:', callId)
      this.emitEvent('call:ended', callId)
    })

    this.socket.on('ice:candidate', (data) => {
      console.log('ICE candidate received:', data)
      this.emitEvent('ice:candidate', data)
    })
  }

  // Public methods
  public connect(): void {
    if (!this.socket) {
      this.initializeSocket()
    }
    
    if (this.socket && !this.socket.connected) {
      this.socket.connect()
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  public getSocketId(): string | null {
    return this.socket?.id || null
  }

  public isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true
  }

  // User related methods
  public joinUserRoom(userId: string): void {
    if (this.socket) {
      this.socket.emit('join:user', userId)
    }
  }

  public joinItemRoom(itemId: string): void {
    if (this.socket) {
      this.socket.emit('join:item', itemId)
    }
  }

  // Messaging methods
  public sendMessage(data: {
    to: string
    message: string
    type: 'text' | 'image' | 'file'
    metadata?: Record<string, any>
  }): void {
    if (this.socket) {
      this.socket.emit('send:message', {
        ...data,
        timestamp: new Date()
      })
    }
  }

  public startTyping(to: string): void {
    if (this.socket) {
      this.socket.emit('typing:start', to)
    }
  }

  public stopTyping(to: string): void {
    if (this.socket) {
      this.socket.emit('typing:stop', to)
    }
  }

  // Call methods
  public initiateCall(data: {
    to: string
    type: 'audio' | 'video'
    callId: string
  }): void {
    if (this.socket) {
      this.socket.emit('call:initiate', data)
    }
  }

  public acceptCall(data: {
    callId: string
    sdp: RTCSessionDescriptionInit
  }): void {
    if (this.socket) {
      this.socket.emit('call:accept', data)
    }
  }

  public rejectCall(callId: string): void {
    if (this.socket) {
      this.socket.emit('call:reject', callId)
    }
  }

  public endCall(callId: string): void {
    if (this.socket) {
      this.socket.emit('call:end', callId)
    }
  }

  public sendIceCandidate(data: {
    callId: string
    candidate: RTCIceCandidateInit
  }): void {
    if (this.socket) {
      this.socket.emit('ice:candidate', data)
    }
  }

  // Event subscription methods
  public on(event: string, callback: Function): () => void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, [])
    }
    
    const callbacks = this.eventCallbacks.get(event)!
    callbacks.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  public off(event: string, callback: Function): void {
    if (this.eventCallbacks.has(event)) {
      const callbacks = this.eventCallbacks.get(event)!
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private emitEvent(event: string, data?: any): void {
    if (this.eventCallbacks.has(event)) {
      const callbacks = this.eventCallbacks.get(event)!
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in ${event} callback:`, error)
        }
      })
    }
  }

  // Utility methods
  public sendNotification(userId: string, notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    if (this.socket) {
      this.socket.emit('notification:send', {
        userId,
        notification: {
          ...notification,
          id: this.generateId(),
          timestamp: new Date(),
          read: false
        }
      })
    }
  }

  public markNotificationAsRead(notificationId: string): void {
    if (this.socket) {
      this.socket.emit('notification:read', notificationId)
    }
  }

  public clearNotifications(): void {
    if (this.socket) {
      this.socket.emit('notifications:clear')
    }
  }

  public getConnectionStats(): {
    connected: boolean
    socketId: string | null
    reconnectionAttempts: number
    lastPing?: number
  } {
    return {
      connected: this.isSocketConnected(),
      socketId: this.getSocketId(),
      reconnectionAttempts: this.reconnectAttempts,
      lastPing: (this.socket as any)?.lastPing
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  // Reconnection control
  public setReconnectionConfig(config: {
    enabled: boolean
    attempts?: number
    delay?: number
    delayMax?: number
  }): void {
    if (this.socket) {
      this.socket.io.opts.reconnection = config.enabled
      this.socket.io.opts.reconnectionAttempts = config.attempts || this.maxReconnectAttempts
      this.socket.io.opts.reconnectionDelay = config.delay || 1000
      this.socket.io.opts.reconnectionDelayMax = config.delayMax || 5000
    }
  }

  // Ping/Pong for connection health check
  public ping(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'))
        return
      }

      const start = Date.now()
      this.socket.emit('ping', () => {
        const latency = Date.now() - start
        resolve(latency)
      })

      setTimeout(() => {
        reject(new Error('Ping timeout'))
      }, 5000)
    })
  }
}

// Singleton instance
export const socketService = new SocketService()

// Hook for React components
export const useSocket = () => {
  return socketService
}

export default socketService