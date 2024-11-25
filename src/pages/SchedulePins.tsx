import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { parse } from 'papaparse';
import { Calendar as CalendarIcon, Upload, Clock } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, addMinutes, setHours, setMinutes } from 'date-fns';
import * as Popover from '@radix-ui/react-popover';
import * as Select from '@radix-ui/react-select';
import useAuthStore from '../store/authStore';
import usePinStore from '../store/pinStore';

interface PinData {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}

interface Board {
  id: string;
  name: string;
}

export default function SchedulePins() {
  const { currentAccount, accessToken } = useAuthStore();
  const { addScheduledPins } = usePinStore();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedBoard, setSelectedBoard] = useState<string>();
  const [boards, setBoards] = useState<Board[]>([]);
  const [pins, setPins] = useState<PinData[]>([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      parse(file, {
        complete: (results) => {
          const parsedPins = results.data
            .filter((row: any[]) => row.length >= 4)
            .map((row: any[]) => ({
              title: row[0],
              description: row[1],
              link: row[2],
              imageUrl: row[3],
            }))
            .slice(1, 21); // Take up to 20 pins, excluding header
          setPins(parsedPins);
        },
        header: true,
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const fetchBoards = async () => {
    if (!accessToken) return;
    
    try {
      const response = await fetch('https://api.pinterest.com/v5/boards', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch boards');
      
      const data = await response.json();
      setBoards(data.items);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  React.useEffect(() => {
    if (currentAccount) {
      fetchBoards();
    }
  }, [currentAccount, accessToken]);

  const schedulePins = () => {
    if (!selectedDate || !selectedBoard || !currentAccount) return;

    const board = boards.find(b => b.id === selectedBoard);
    if (!board) return;

    // Generate random times between 9 AM and 5 PM
    const scheduledPins = pins.map((pin, index) => {
      const randomMinutes = Math.floor(Math.random() * 480); // 8 hours in minutes
      const baseDate = setHours(setMinutes(selectedDate, 0), 9); // Start at 9 AM
      const scheduledTime = addMinutes(baseDate, randomMinutes);

      return {
        ...pin,
        accountId: currentAccount,
        boardId: selectedBoard,
        boardName: board.name,
        scheduledFor: scheduledTime.toISOString(),
      };
    });

    addScheduledPins(scheduledPins);
    setPins([]);
    setSelectedDate(undefined);
    setSelectedBoard(undefined);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900">Schedule Pins</h1>
      
      <div className="mt-6 space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">1. Upload CSV File</h2>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag & drop a CSV file here, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Format: Title, Description, Link, Image URL
            </p>
          </div>
          
          {pins.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {pins.length} pin{pins.length !== 1 ? 's' : ''} loaded
              </p>
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">2. Select Board</h2>
          <Select.Root value={selectedBoard} onValueChange={setSelectedBoard}>
            <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md">
              <Select.Value placeholder="Select a board" />
            </Select.Trigger>
            
            <Select.Portal>
              <Select.Content className="bg-white rounded-md shadow-lg">
                <Select.Viewport className="p-1">
                  {boards.map((board) => (
                    <Select.Item
                      key={board.id}
                      value={board.id}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <Select.ItemText>{board.name}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">3. Select Date</h2>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="inline-flex items-center px-3 py-2 border rounded-md text-sm">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
              </button>
            </Popover.Trigger>
            
            <Popover.Portal>
              <Popover.Content className="bg-white rounded-md shadow-lg p-2">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={{ before: new Date() }}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>Pins will be scheduled randomly between 9 AM and 5 PM</span>
          </div>
        </div>

        <button
          onClick={schedulePins}
          disabled={!selectedDate || !selectedBoard || pins.length === 0}
          className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Schedule {pins.length} Pin{pins.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}