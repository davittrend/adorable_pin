import React from 'react';
import { LogIn, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

const PINTEREST_CLIENT_ID = '1507772';
const REDIRECT_URI = 'https://adorable-shortbread-ea235b.netlify.app/callback';
const SCOPE = 'boards:read,pins:read,pins:write';

export default function AuthButton() {
  const { isAuthenticated, clearAuth } = useAuthStore();

  const handleLogin = () => {
    const authUrl = `https://www.pinterest.com/oauth/?client_id=${PINTEREST_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPE}`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    clearAuth();
  };

  return isAuthenticated ? (
    <button
      onClick={handleLogout}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Disconnect Pinterest
    </button>
  ) : (
    <button
      onClick={handleLogin}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      <LogIn className="h-4 w-4 mr-2" />
      Connect Pinterest
    </button>
  );
}