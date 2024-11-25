import React from 'react';
import useAuthStore from '../store/authStore';

export default function Dashboard() {
  const { accessToken } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-6">
        {accessToken ? (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Connected Account</h2>
            <p className="mt-2 text-sm text-gray-500">
              Your Pinterest account is connected and ready to use.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">No Account Connected</h2>
            <p className="mt-2 text-sm text-gray-500">
              Please connect your Pinterest account to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}