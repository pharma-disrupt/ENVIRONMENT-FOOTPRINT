'use client';

interface Tip {
  id: string;
  text: string;
  category?: string;
}

interface TipsListProps {
  tips: Tip[];
}

export function TipsList({ tips }: TipsListProps) {
  if (!tips || tips.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-3">
      {tips.map((tip, index) => (
        <li
          key={tip.id}
          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
            {index + 1}
          </span>
          <div className="flex-1">
            <p className="text-sm text-gray-700">{tip.text}</p>
            {tip.category && (
              <span className="text-xs text-gray-500 capitalize mt-1 block">
                {tip.category}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
