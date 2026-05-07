import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Connect to the WebSocket server
    const socketInstance = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    })

    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      console.log('Socket connected')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return { socket, isConnected }
}