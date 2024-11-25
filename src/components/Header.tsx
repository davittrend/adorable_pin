import React from 'react';
import { Link } from 'react-router-dom';
import { PinIcon, ChevronDown, LogOut, Plus } from 'lucide-react';
import useAuthStore from '../store/authStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default function Header() {
  const { isAuthenticated, accounts, currentAccount, setCurrentAccount, clearAuth, removeAccount } = useAuthStore();

  const currentAccountData = accounts.find(acc => acc.id === currentAccount);

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <nav className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <PinIcon className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold text-gray-900">PinOrganizer</span>
            </Link>
          </div>
          {isAuthenticated && accounts.length > 0 && (
            <div className="flex items-center space-x-4">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                  <img
                    src={currentAccountData?.profileImage}
                    alt={currentAccountData?.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{currentAccountData?.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="min-w-[220px] bg-white rounded-md shadow-lg py-1 mt-1">
                    {accounts.map(account => (
                      <DropdownMenu.Item
                        key={account.id}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setCurrentAccount(account.id)}
                      >
                        <img
                          src={account.profileImage}
                          alt={account.username}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="flex-1">{account.username}</span>
                        {account.id === currentAccount && (
                          <span className="text-xs text-green-600">Active</span>
                        )}
                      </DropdownMenu.Item>
                    ))}
                    <DropdownMenu.Separator className="my-1 border-t border-gray-200" />
                    <Link to="/accounts/add">
                      <DropdownMenu.Item className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Account
                      </DropdownMenu.Item>
                    </Link>
                    <DropdownMenu.Item
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        if (currentAccount) {
                          removeAccount(currentAccount);
                        }
                        if (accounts.length <= 1) {
                          clearAuth();
                        }
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out {currentAccountData?.username}
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}