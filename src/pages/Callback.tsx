import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Callback() {
const [searchParams] = useSearchParams();
const navigate = useNavigate();
const addAccount = useAuthStore((state) => state.addAccount);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const handleAuth = async () => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = sessionStorage.getItem('pinterest_auth_state');

    sessionStorage.removeItem('pinterest_auth_state');

    if (!code) {
      setError('Authorization code not received');
      navigate('/', { state: { error: 'Authorization code not received' } });
      return;
    }

    if (state !== storedState) {
      setError('Invalid state parameter');
      navigate('/', { state: { error: 'Invalid state parameter' } });
      return;
    }

    try {
      // Exchange code for token
      const tokenResponse = await fetch('/.netlify/functions/exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || tokenData.error) {
        throw new Error(tokenData.error || 'Failed to exchange token');
      }

      // Fetch user profile
      const profileResponse = await fetch('/.netlify/functions/get-user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: tokenData.access_token }),
      });

      const profileData = await profileResponse.json();

      if (!profileResponse.ok || profileData.error) {
        throw new Error(profileData.error || 'Failed to fetch user profile');
      }

      addAccount({
        id: profileData.username,
        username: profileData.username,
        profileImage: profileData.profile_image || 'https://via.placeholder.com/50',
        boardsCount: 0,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
      });

      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      console.error('Auth error:', error);
      setError(errorMessage);
      navigate('/', { state: { error: errorMessage } });
    }
  };

  handleAuth();
}, [searchParams, navigate, addAccount]);

if (error) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
        <h2 className="text-lg font-medium text-gray-900">{error}</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

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
