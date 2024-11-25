import React, { useEffect, useState } from 'react';
import { Grid, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

interface Board {
  id: string;
  name: string;
  description: string;
  image_thumbnail_url: string;
  pin_count: number;
}

export default function BoardsList() {
  const { accessToken, currentAccount } = useAuthStore();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !currentAccount) return;

    const fetchBoards = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.pinterest.com/v5/boards', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch boards');

        const data = await response.json();
        setBoards(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [accessToken, currentAccount]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {boards.map((board) => (
        <div
          key={board.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            {board.image_thumbnail_url ? (
              <img
                src={board.image_thumbnail_url}
                alt={board.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Grid className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1">{board.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{board.description}</p>
            <div className="text-sm text-gray-600">
              {board.pin_count} pins
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}