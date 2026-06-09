import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentication | Carbon Footprint Platform',
  description: 'Login or register to start tracking your carbon footprint',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-emerald-700">
              🌱 EcoTrack
            </h1>
          </Link>
          <p className="text-emerald-600 mt-2">
            Track. Understand. Reduce.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
