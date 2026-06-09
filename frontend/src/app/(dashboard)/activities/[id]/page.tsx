'use client';

import { useParams, useRouter } from 'next/navigation';
import { useActivities } from '@/hooks/useActivities';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ActivityCard } from '@/components/activities/ActivityCard';

const categoryIcons: Record<string, string> = {
  transport: '🚗',
  energy: '⚡',
  food: '🍽️',
  shopping: '🛍️',
};

const categoryColors: Record<string, string> = {
  transport: 'bg-blue-100 text-blue-800',
  energy: 'bg-amber-100 text-amber-800',
  food: 'bg-green-100 text-green-800',
  shopping: 'bg-purple-100 text-purple-800',
};

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { activities, deleteActivity } = useActivities();
  
  const activity = activities?.find(a => a.id === params.id);

  if (!activity) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Activity Not Found</h1>
          <p className="text-gray-600 mb-4">The activity you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => router.push('/activities')}>Back to Activities</Button>
        </Card>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this activity?')) {
      await deleteActivity(activity.id);
      router.push('/activities');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderDetails = () => {
    switch (activity.type) {
      case 'transport':
        const data = activity.data as any;
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Vehicle Type</p>
                <p className="font-medium">{data.vehicleType?.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Distance</p>
                <p className="font-medium">{data.distance} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passengers</p>
                <p className="font-medium">{data.passengers}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Per Person</p>
                <p className="font-medium">{(activity.co2e / (data.passengers || 1)).toFixed(2)} kg CO₂e</p>
              </div>
            </div>
          </div>
        );
      
      case 'energy':
        const eData = activity.data as any;
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Source</p>
                <p className="font-medium">{eData.source?.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Consumption</p>
                <p className="font-medium">{eData.consumption} {eData.unit || 'units'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Period</p>
                <p className="font-medium capitalize">{eData.period || 'monthly'}</p>
              </div>
            </div>
          </div>
        );
      
      case 'food':
        const fData = activity.data as any;
        return (
          <div className="space-y-3">
            {fData.calculationMode === 'diet' ? (
              <div>
                <p className="text-sm text-gray-500">Diet Type</p>
                <p className="font-medium capitalize">{fData.dietType?.replace('_', ' ')}</p>
                {fData.localOrganic && (
                  <Badge className="mt-2" variant="secondary">🌱 Local & Organic</Badge>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-2">Items Logged</p>
                <div className="space-y-2">
                  {fData.meals?.map((meal: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{meal.category?.replace('_', ' ')}</span>
                      <span className="font-medium">{meal.quantity} kg</span>
                    </div>
                  ))}
                </div>
                {fData.localOrganic && (
                  <Badge className="mt-2" variant="secondary">🌱 Local & Organic</Badge>
                )}
              </div>
            )}
          </div>
        );
      
      case 'shopping':
        const sData = activity.data as any;
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">Items Purchased</p>
            <div className="space-y-2">
              {sData.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span>{item.category?.replace('_', ' ')}</span>
                    {item.secondhand && <Badge variant="secondary">♻️ Secondhand</Badge>}
                  </div>
                  <span className="font-medium">${item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return <p className="text-gray-500">No additional details available</p>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-3xl">{categoryIcons[activity.type] || '📊'}</span>
            <Badge className={categoryColors[activity.type]} variant="secondary">
              {activity.type.toUpperCase()}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Details</h1>
          <p className="text-sm text-gray-600">{formatDate(activity.date)}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{activity.co2e.toFixed(2)}</p>
          <p className="text-sm text-gray-500">kg CO₂e</p>
        </div>
      </div>

      {/* Details Card */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
        {renderDetails()}
      </Card>

      {/* Impact Context */}
      <Card className="p-6 bg-indigo-50 border-indigo-200">
        <h2 className="text-lg font-semibold text-indigo-900 mb-3">🌍 Impact Context</h2>
        <div className="space-y-2 text-sm text-indigo-800">
          <p>• This is equivalent to driving {(activity.co2e * 4.5).toFixed(1)} miles in an average car</p>
          <p>• You would need to plant {(activity.co2e * 0.05).toFixed(2)} trees to offset this</p>
          <p>• This represents {((activity.co2e / 40) * 100).toFixed(1)}% of daily budget (40 kg CO₂e)</p>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={() => router.push('/activities')}>
          Back to List
        </Button>
        <Button variant="outline" onClick={() => router.push(`/activities/log`)}>
          Log Similar
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
