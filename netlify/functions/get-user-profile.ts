import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
// Handle preflight requests
if (event.httpMethod === 'OPTIONS') {
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  };
}

if (event.httpMethod !== 'POST') {
  return {
    statusCode: 405,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
}

try {
  const { access_token } = JSON.parse(event.body || '{}');

  if (!access_token) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Access token is required' }),
    };
  }

  const response = await fetch('https://api.pinterest.com/v5/user_account', {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Pinterest API error:', data);
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: data.message || 'Failed to fetch user profile' }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
} catch (error) {
  console.error('Profile fetch error:', error);
  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ error: 'Internal server error' }),
  };
}
};
