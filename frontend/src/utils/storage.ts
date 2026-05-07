interface StorageItem<T = any> {
  value: T
  expires?: number
  timestamp: number
}

type StorageType = 'local' | 'session'

class StorageService {
  private prefix = 'secure_finder_'
  private defaultExpiry = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

  // Generic get method
  public get<T>(key: string, type: StorageType = 'local'): T | null {
    try {
      const storage = type === 'local' ? localStorage : sessionStorage
      const item = storage.getItem(this.getKey(key))
      
      if (!item) return null

      const parsedItem: StorageItem<T> = JSON.parse(item)
      
      // Check if item has expired
      if (parsedItem.expires && Date.now() > parsedItem.expires) {
        this.remove(key, type)
        return null
      }

      return parsedItem.value
    } catch (error) {
      console.error(`Error reading from ${type}Storage:`, error)
      return null
    }
  }

  // Generic set method
  public set<T>(
    key: string, 
    value: T, 
    type: StorageType = 'local',
    expiresIn?: number // milliseconds
  ): void {
    try {
      const storage = type === 'local' ? localStorage : sessionStorage
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        expires: expiresIn ? Date.now() + expiresIn : undefined
      }
      
      storage.setItem(this.getKey(key), JSON.stringify(item))
    } catch (error) {
      console.error(`Error writing to ${type}Storage:`, error)
    }
  }

  // Remove item
  public remove(key: string, type: StorageType = 'local'): void {
    try {
      const storage = type === 'local' ? localStorage : sessionStorage
      storage.removeItem(this.getKey(key))
    } catch (error) {
      console.error(`Error removing from ${type}Storage:`, error)
    }
  }

  // Clear all items (with optional prefix filter)
  public clear(prefix?: string, type: StorageType = 'local'): void {
    try {
      const storage = type === 'local' ? localStorage : sessionStorage
      const keysToRemove: string[] = []
      
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key) {
          if (prefix) {
            if (key.startsWith(this.getKey(prefix))) {
              keysToRemove.push(key)
            }
          } else {
            keysToRemove.push(key)
          }
        }
      }
      
      keysToRemove.forEach(key => storage.removeItem(key))
    } catch (error) {
      console.error(`Error clearing ${type}Storage:`, error)
    }
  }

  // Get all keys (with optional prefix filter)
  public keys(prefix?: string, type: StorageType = 'local'): string[] {
    try {
      const storage = type === 'local' ? localStorage : sessionStorage
      const keys: string[] = []
      
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key) {
          const cleanKey = this.removeKeyPrefix(key)
          if (prefix) {
            if (cleanKey.startsWith(prefix)) {
              keys.push(cleanKey)
            }
          } else {
            keys.push(cleanKey)
          }
        }
      }
      
      return keys
    } catch (error) {
      console.error(`Error getting keys from ${type}Storage:`, error)
      return []
    }
  }

  // Check if key exists and is not expired
  public has(key: string, type: StorageType = 'local'): boolean {
    return this.get(key, type) !== null
  }

  // Get item with expiry info
  public getWithExpiry<T>(key: string, type: StorageType = 'local'): {
    value: T | null
    expiresAt: number | null
    isExpired: boolean
    timeLeft: number | null
  } {
    try {
      const storage = type === 'local' ? localStorage : sessionStorage
      const item = storage.getItem(this.getKey(key))
      
      if (!item) {
        return {
          value: null,
          expiresAt: null,
          isExpired: true,
          timeLeft: null
        }
      }

      const parsedItem: StorageItem<T> = JSON.parse(item)
      const isExpired = parsedItem.expires ? Date.now() > parsedItem.expires : false
      const timeLeft = parsedItem.expires ? parsedItem.expires - Date.now() : null

      return {
        value: isExpired ? null : parsedItem.value,
        expiresAt: parsedItem.expires || null,
        isExpired,
        timeLeft: timeLeft && timeLeft > 0 ? timeLeft : null
      }
    } catch (error) {
      console.error(`Error getting expiry info from ${type}Storage:`, error)
      return {
        value: null,
        expiresAt: null,
        isExpired: true,
        timeLeft: null
      }
    }
  }

  // Update expiry time
  public updateExpiry(
    key: string, 
    expiresIn: number, 
    type: StorageType = 'local'
  ): boolean {
    try {
      const item = this.getWithExpiry(key, type)
      
      if (item.value === null) {
        return false
      }

      this.set(key, item.value, type, expiresIn)
      return true
    } catch (error) {
      console.error(`Error updating expiry in ${type}Storage:`, error)
      return false
    }
  }

  // Get multiple items by prefix
  public getByPrefix<T>(prefix: string, type: StorageType = 'local'): Record<string, T> {
    try {
      const keys = this.keys(prefix, type)
      const result: Record<string, T> = {}
      
      keys.forEach(key => {
        const value = this.get<T>(key, type)
        if (value !== null) {
          result[key] = value
        }
      })
      
      return result
    } catch (error) {
      console.error(`Error getting items by prefix from ${type}Storage:`, error)
      return {}
    }
  }

  // Size information
  public getSize(type: StorageType = 'local'): {
    total: number
    items: number
    average: number
  } {
    try {
      const storage = type === 'local' ? localStorage : sessionStorage
      let totalSize = 0
      let itemCount = 0
      
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key) {
          const value = storage.getItem(key)
          totalSize += key.length + (value ? value.length : 0)
          itemCount++
        }
      }
      
      return {
        total: totalSize,
        items: itemCount,
        average: itemCount > 0 ? totalSize / itemCount : 0
      }
    } catch (error) {
      console.error(`Error calculating ${type}Storage size:`, error)
      return {
        total: 0,
        items: 0,
        average: 0
      }
    }
  }

  // Encrypted storage methods
  public setEncrypted<T>(
    key: string, 
    value: T, 
    password: string,
    type: StorageType = 'local',
    expiresIn?: number
  ): boolean {
    try {
      const encrypted = this.encrypt(JSON.stringify(value), password)
      this.set(key, encrypted, type, expiresIn)
      return true
    } catch (error) {
      console.error(`Error setting encrypted value in ${type}Storage:`, error)
      return false
    }
  }

  public getEncrypted<T>(
    key: string, 
    password: string,
    type: StorageType = 'local'
  ): T | null {
    try {
      const encrypted = this.get<string>(key, type)
      if (!encrypted) return null
      
      const decrypted = this.decrypt(encrypted, password)
      return JSON.parse(decrypted)
    } catch (error) {
      console.error(`Error getting encrypted value from ${type}Storage:`, error)
      return null
    }
  }

  // Session management
  public setSession<T>(key: string, value: T, expiresIn?: number): void {
    this.set(key, value, 'session', expiresIn)
  }

  public getSession<T>(key: string): T | null {
    return this.get(key, 'session')
  }

  public removeSession(key: string): void {
    this.remove(key, 'session')
  }

  public clearSession(): void {
    this.clear(undefined, 'session')
  }

  // Token management
  public setToken(token: string, type: StorageType = 'local'): void {
    this.set('auth_token', token, type, this.defaultExpiry)
  }

  public getToken(type: StorageType = 'local'): string | null {
    return this.get('auth_token', type)
  }

  public removeToken(type: StorageType = 'local'): void {
    this.remove('auth_token', type)
  }

  public hasToken(type: StorageType = 'local'): boolean {
    return this.has('auth_token', type)
  }

  // User data management
  public setUser<T extends Record<string, any>>(user: T): void {
    this.set('user_data', user, 'local', this.defaultExpiry)
  }

  public getUser<T extends Record<string, any>>(): T | null {
    return this.get('user_data', 'local')
  }

  public removeUser(): void {
    this.remove('user_data', 'local')
  }

  // Settings management
  public setSettings<T extends Record<string, any>>(settings: T): void {
    this.set('user_settings', settings)
  }

  public getSettings<T extends Record<string, any>>(): T | null {
    return this.get('user_settings', 'local')
  }

  public updateSettings<T extends Record<string, any>>(updates: Partial<T>): T | null {
    const current = this.getSettings<T>()
    if (!current) {
      this.setSettings(updates as T)
      return updates as T
    }
    
    const updated = { ...current, ...updates }
    this.setSettings(updated)
    return updated
  }

  // Theme management - ADD THIS SECTION
  public getTheme(): 'light' | 'dark' | 'system' {
    // Try to get from user settings first
    const settings = this.getSettings<{ theme?: 'light' | 'dark' | 'system' }>();
    if (settings?.theme) {
      return settings.theme;
    }
    
    // Fallback to direct theme storage
    const storedTheme = this.get<'light' | 'dark' | 'system'>('theme');
    return storedTheme || 'system'; // Default to 'system' if nothing stored
  }

  public setTheme(theme: 'light' | 'dark' | 'system'): void {
    // Update in user settings
    const currentSettings = this.getSettings() || {};
    this.updateSettings({ ...currentSettings, theme });
    
    // Also store separately for quick access
    this.set('theme', theme);
  }

  // Cache management
  public setCache<T>(
    key: string, 
    value: T, 
    expiresIn: number = 5 * 60 * 1000 // 5 minutes default
  ): void {
    this.set(`cache_${key}`, value, 'local', expiresIn)
  }

  public getCache<T>(key: string): T | null {
    return this.get(`cache_${key}`, 'local')
  }

  public clearCache(prefix?: string): void {
    if (prefix) {
      this.clear(`cache_${prefix}`, 'local')
    } else {
      const keys = this.keys('cache_', 'local')
      keys.forEach(key => this.remove(key, 'local'))
    }
  }

  // Form data persistence
  public saveFormData<T extends Record<string, any>>(
    formId: string, 
    data: T,
    expiresIn: number = 30 * 60 * 1000 // 30 minutes
  ): void {
    this.set(`form_${formId}`, data, 'session', expiresIn)
  }

  public getFormData<T extends Record<string, any>>(formId: string): T | null {
    return this.get(`form_${formId}`, 'session')
  }

  public clearFormData(formId: string): void {
    this.remove(`form_${formId}`, 'session')
  }

  // Private helper methods
  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  private removeKeyPrefix(fullKey: string): string {
    if (fullKey.startsWith(this.prefix)) {
      return fullKey.substring(this.prefix.length)
    }
    return fullKey
  }

  private encrypt(text: string, password: string): string {
    // Simple XOR encryption for demonstration
    // In production, use a proper encryption library like crypto-js
    let result = ''
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ password.charCodeAt(i % password.length)
      result += String.fromCharCode(charCode)
    }
    return btoa(result) // Base64 encode
  }

  private decrypt(encryptedText: string, password: string): string {
    try {
      const text = atob(encryptedText) // Base64 decode
      let result = ''
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ password.charCodeAt(i % password.length)
        result += String.fromCharCode(charCode)
      }
      return result
    } catch (error) {
      throw new Error('Decryption failed')
    }
  }

  // Migration helper
  public migrate(
    oldKey: string, 
    newKey: string, 
    deleteOld: boolean = true,
    type: StorageType = 'local'
  ): boolean {
    try {
      const value = this.get(oldKey, type)
      if (value === null) return false
      
      this.set(newKey, value, type)
      
      if (deleteOld) {
        this.remove(oldKey, type)
      }
      
      return true
    } catch (error) {
      console.error('Migration failed:', error)
      return false
    }
  }

  // Export/Import data
  public exportData(prefix?: string, type: StorageType = 'local'): string {
    try {
      const data: Record<string, any> = {}
      const keys = this.keys(prefix, type)
      
      keys.forEach(key => {
        const value = this.get(key, type)
        if (value !== null) {
          data[key] = value
        }
      })
      
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Export failed:', error)
      return '{}'
    }
  }

  public importData(json: string, type: StorageType = 'local'): boolean {
    try {
      const data = JSON.parse(json)
      
      Object.keys(data).forEach(key => {
        this.set(key, data[key], type)
      })
      
      return true
    } catch (error) {
      console.error('Import failed:', error)
      return false
    }
  }

  // Cleanup expired items
  public cleanupExpired(type: StorageType = 'local'): number {
    let cleaned = 0
    const keys = this.keys(undefined, type)
    
    keys.forEach(key => {
      const item = this.getWithExpiry(key, type)
      if (item.isExpired) {
        this.remove(key, type)
        cleaned++
      }
    })
    
    return cleaned
  }

  // Quota management
  public isQuotaExceeded(type: StorageType = 'local'): boolean {
    try {
      const testKey = '__test_quota__'
      const storage = type === 'local' ? localStorage : sessionStorage
      
      // Try to set a large value
      const largeValue = 'x'.repeat(1024 * 1024) // 1MB
      storage.setItem(testKey, largeValue)
      storage.removeItem(testKey)
      
      return false
    } catch (error) {
      return (error as DOMException).name === 'QuotaExceededError'
    }
  }

  // Get available space (approximate)
  public getAvailableSpace(type: StorageType = 'local'): number {
    const totalQuota = 5 * 1024 * 1024 // 5MB typical quota
    const used = this.getSize(type).total
    return Math.max(0, totalQuota - used)
  }
}

// Singleton instance
export const storage = new StorageService()

// Named exports for convenience - ADD THESE
export const getTheme = () => storage.getTheme();
export const setTheme = (theme: 'light' | 'dark' | 'system') => storage.setTheme(theme);

// React hooks for storage
export const useStorage = () => {
  return storage
}

export default storage