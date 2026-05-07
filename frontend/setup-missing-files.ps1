# Create all missing directories
mkdir -p src/pages/profile
mkdir -p src/pages/settings
mkdir -p src/pages/admin
mkdir -p src/utils
mkdir -p src/api
mkdir -p src/types

# Create Profile page
@"
import React from 'react';

const Profile: React.FC = () => {
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Profile content will go here</p>
    </div>
  );
};

export default Profile;
"@ | Set-Content -Path src/pages/profile/Profile.tsx

# Create Settings page
@"
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div>
      <h1>Settings Page</h1>
      <p>Settings content will go here</p>
    </div>
  );
};

export default Settings;
"@ | Set-Content -Path src/pages/settings/Settings.tsx

# Create Admin Dashboard
@"
import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Admin content will go here</p>
    </div>
  );
};

export default AdminDashboard;
"@ | Set-Content -Path src/pages/admin/AdminDashboard.tsx

# Create storage utils
@"
// Local storage utility functions
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const getUser = (): any => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = (): void => {
  localStorage.removeItem('user');
};

// Theme storage
export const getTheme = (): 'light' | 'dark' => {
  return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
};

export const setTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem('theme', theme);
};
"@ | Set-Content -Path src/utils/storage.ts

# Create auth API
@"
// Mock auth API - replace with real API calls
export const authApi = {
  login: async (credentials: any) => {
    // Mock implementation
    return { token: 'mock-token', user: { id: 1, email: credentials.email } };
  },
  register: async (data: any) => {
    // Mock implementation
    return { token: 'mock-token', user: { id: 1, email: data.email } };
  },
  logout: async () => {
    // Mock implementation
    return { success: true };
  },
  verifyToken: async (token: string) => {
    // Mock implementation
    return { valid: true, user: { id: 1, email: 'user@example.com' } };
  }
};
"@ | Set-Content -Path src/api/auth.api.ts

# Create socket API
@"
// Mock socket service
export const socketService = {
  connect: () => console.log('Socket connected'),
  disconnect: () => console.log('Socket disconnected'),
  emit: (event: string, data: any) => console.log(`Emitting \${event}:`, data),
  on: (event: string, callback: Function) => console.log(`Listening to \${event}`)
};
"@ | Set-Content -Path src/api/socket.api.ts

# Create auth types
@"
export interface User {
  id: number;
  email: string;
  name?: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}
"@ | Set-Content -Path src/types/auth.types.ts

Write-Host "All missing files have been created!"
