import React from 'react';
import AuthButton from '../components/AuthButton';

export default function AddAccount() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900">Add Pinterest Account</h1>
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Connect New Account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Click the button below to connect another Pinterest account
          </p>
          <div className="mt-4">
            <AuthButton />
          </div>
        </div>
      </div>
    </div>
  );
}