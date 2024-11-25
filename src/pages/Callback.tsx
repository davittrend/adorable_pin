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
      navigate('/', { state: { error: 'Authorization code not received' } });
      return;
    }

    if (state !== storedState) {
      navigate('/', { state: { error: 'Invalid state parameter' } });
      return;
    }

    fetch('/.netlify/functions/exchange-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(async (data) => {
        if (data.error) {
          throw new Error(data.error);
        }

        try {
          const profileResponse = await fetch('/.netlify/functions/get-user-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ access_token: data.access_token }),
          });

          if (!profileResponse.ok) {
            throw new Error('Failed to fetch user profile');
          }

          const profile = await profileResponse.json();

          addAccount({
            id: profile.username,
            username: profile.username,
            profileImage: profile.profile_image || 'https://via.placeholder.com/50',
            boardsCount: 0,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
          });

          navigate('/dashboard');
        } catch (error) {
          console.error('Profile fetch error:', error);
          throw new Error('Failed to fetch user profile');
        }
      })
      .catch((error) => {
        console.error('Authentication error:', error);
        navigate('/', { 
          state: { 
            error: error.message || 'Failed to authenticate with Pinterest'
          } 
        });
      });
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
