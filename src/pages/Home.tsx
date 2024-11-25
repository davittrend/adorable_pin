import React from 'react';
import { PinIcon } from 'lucide-react';
import AuthButton from '../components/AuthButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <PinIcon className="mx-auto h-16 w-16 text-red-600" />
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            PinOrganizer
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Connect your Pinterest account to manage and publish pins effortlessly
          </p>
          <div className="mt-8">
            <AuthButton />
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-lg font-medium text-gray-900">Secure Authentication</div>
                <div className="mt-2 text-sm text-gray-500">
                  OAuth 2.0 integration ensures your Pinterest account remains secure
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-lg font-medium text-gray-900">Easy Publishing</div>
                <div className="mt-2 text-sm text-gray-500">
                  Create and publish pins directly from our platform
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-lg font-medium text-gray-900">Token Management</div>
                <div className="mt-2 text-sm text-gray-500">
                  Automatic refresh token handling for uninterrupted access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}