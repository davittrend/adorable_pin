import React from 'react';
import { Play, Trash2, Calendar } from 'lucide-react';
import useAuthStore from '../store/authStore';
import usePinStore from '../store/pinStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default function ScheduledPins() {
  const { accounts, currentAccount, setCurrentAccount } = useAuthStore();
  const { getScheduledPinsByAccount, removeScheduledPin, publishPin } = usePinStore();

  const currentAccountData = accounts.find(acc => acc.id === currentAccount);
  const scheduledPins = currentAccount ? getScheduledPinsByAccount(currentAccount) : [];

  const handlePublishNow = async (pinId: string) => {
    try {
      await publishPin(pinId);
    } catch (error) {
      console.error('Error publishing pin:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Scheduled Pins</h1>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            {currentAccountData ? (
              <>
                <img
                  src={currentAccountData.profileImage}
                  alt={currentAccountData.username}
                  className="w-5 h-5 rounded-full mr-2"
                />
                {currentAccountData.username}
              </>
            ) : (
              'Select Account'
            )}
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="min-w-[200px] bg-white rounded-md shadow-lg py-1 mt-1">
              {accounts.map(account => (
                <DropdownMenu.Item
                  key={account.id}
                  onClick={() => setCurrentAccount(account.id)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={account.profileImage}
                    alt={account.username}
                    className="w-5 h-5 rounded-full mr-2"
                  />
                  {account.username}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scheduled For
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Board
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scheduledPins.length > 0 ? (
              scheduledPins.map((pin) => (
                <tr key={pin.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={pin.imageUrl}
                        alt={pin.title}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {pin.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(pin.scheduledFor).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pin.boardName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handlePublishNow(pin.id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                      title="Publish Now"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeScheduledPin(pin.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No scheduled pins for this account
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}