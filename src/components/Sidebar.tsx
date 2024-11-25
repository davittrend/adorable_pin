import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Clock, Plus } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Sidebar() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return null;

  return (
    <div className="w-64 bg-white h-[calc(100vh-4rem)] shadow-sm">
      <div className="p-4">
        <NavLink
          to="/accounts/add"
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </NavLink>
      </div>
      <nav className="space-y-1 px-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-red-50 text-red-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink
          to="/schedule-pins"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-red-50 text-red-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Calendar className="w-5 h-5 mr-3" />
          Schedule Pins
        </NavLink>
        <NavLink
          to="/scheduled-pins"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-red-50 text-red-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <Clock className="w-5 h-5 mr-3" />
          Scheduled Pins
        </NavLink>
      </nav>
    </div>
  );
}