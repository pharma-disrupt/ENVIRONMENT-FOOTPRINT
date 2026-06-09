'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Activities', href: '/activities', icon: '📝' },
  { name: 'Footprint', href: '/footprint', icon: '👣' },
  { name: 'Goals', href: '/goals', icon: '🎯' },
  { name: 'Challenges', href: '/challenges', icon: '🏆' },
  { name: 'Insights', href: '/insights', icon: '💡' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-white dark:border-gray-700 dark:bg-gray-800 md:flex">
      <div className="flex h-16 items-center border-b px-6 dark:border-gray-700">
        <Link href="/dashboard" className="text-xl font-bold text-green-600">
          🌱 CarbonTrack
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4 dark:border-gray-700">
        <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-4 text-white">
          <p className="text-sm font-medium">Weekly Challenge</p>
          <p className="mt-1 text-xs opacity-90">
            Log 5 activities this week!
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-3/5 bg-white" />
          </div>
          <p className="mt-1 text-xs opacity-90">3/5 completed</p>
        </div>
      </div>
    </aside>
  );
}
