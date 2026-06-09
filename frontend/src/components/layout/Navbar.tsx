'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="border-b bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-bold text-green-600">
            🌱 CarbonTrack
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            🔔
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <div className="h-8 w-8 overflow-hidden rounded-full bg-green-500">
                <span className="flex h-full w-full items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name || 'User'}
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <Link
                  href="/settings/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Settings
                </Link>
                <hr className="my-2 dark:border-gray-700" />
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
