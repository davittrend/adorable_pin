import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Callback() {
const [searchParams] = useSearchParams();
const navigate = useNavigate();
const addAccount = useAuthStore((state) => state.addAccount);

useEffect(() => {
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const storedState = sessionStorage.getItem('pinterest_auth_state');

  // Clear stored state
  sessionStorage.removeItem('pinterest_auth_state');

  if (!code) {
    console.error('No authorization code received');
    navigate('/', { state: { error: 'Authorization code not received' } });
    return;
  }

  if (state !== storedState) {
    console.error('State mismatch', { received: state, stored: storedState });
    navigate('/', { state: { error: 'Invalid state parameter' } });
    return;
  }

  const exchangeToken = async () => {
    try {
      // Exchange code for token
      const tokenResponse = await fetch('/.netlify/functions/exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error || 'Failed to exchange token');
      }

      const tokenData = await tokenResponse.json();
      console.log('Token exchange successful');

      // Fetch user profile
      const profileResponse = await fetch('/.netlify/functions/get-user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: tokenData.access_token }),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        throw new Error(errorData.error || 'Failed to fetch user profile');
      }

      const profile = await profileResponse.json();
      console.log('Profile fetch successful');

      // Add account to store
      addAccount({
        id: profile.username,
        username: profile.username,
        profileImage: profile.profile_image || 'https://via.placeholder.com/50',
        boardsCount: 0,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
      navigate('/', { 
        state: { 
          error: error instanceof Error ? error.message : 'Failed to authenticate with Pinterest'
        } 
      });
    }
  };

  exchangeToken();
}, [searchParams, navigate, addAccount]);

return (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="mx-auto h-12 w-12 text-red-600 animate-spin" />
      <h2 className="mt-4 text-lg font-medium text-gray-900">
        Connecting to Pinterest...
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Please wait while we complete the authentication process
      </p>
    </div>
  </div>
);
}
