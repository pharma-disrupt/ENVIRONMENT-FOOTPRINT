'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import HouseholdForm from '@/components/onboarding/HouseholdForm';
import TransportForm from '@/components/onboarding/TransportForm';
import DietForm from '@/components/onboarding/DietForm';
import EnergyForm from '@/components/onboarding/EnergyForm';

type OnboardingData = {
  householdSize: number;
  housingType: string;
  location: string;
  commuteDistance: number;
  transportMode: string;
  flightsPerYear: number;
  dietType: string;
  meatConsumption: string;
  dairyConsumption: string;
  electricityUsage: number;
  heatingType: string;
  renewableEnergy: boolean;
};

const steps = [
  { title: 'Household', description: 'Tell us about your living situation' },
  { title: 'Transport', description: 'How do you get around?' },
  { title: 'Diet', description: 'What are your eating habits?' },
  { title: 'Energy', description: 'Home energy usage' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    householdSize: 1,
    housingType: 'apartment',
    location: '',
    commuteDistance: 0,
    transportMode: 'car',
    flightsPerYear: 0,
    dietType: 'mixed',
    meatConsumption: 'moderate',
    dairyConsumption: 'moderate',
    electricityUsage: 0,
    heatingType: 'electric',
    renewableEnergy: false,
  });

  const handleNext = (stepData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...stepData }));
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (finalData: Partial<OnboardingData>) => {
    setIsLoading(true);
    try {
      const completeData = { ...data, ...finalData };
      
      // Submit onboarding data to calculate baseline footprint
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeData),
      });

      if (!response.ok) throw new Error('Failed to submit onboarding');

      router.push('/onboarding/results');
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    const commonProps = {
      onNext: handleNext,
      onBack: currentStep > 0 ? handleBack : undefined,
      initialData: data,
    };

    switch (currentStep) {
      case 0:
        return <HouseholdForm {...commonProps} />;
      case 1:
        return <TransportForm {...commonProps} />;
      case 2:
        return <DietForm {...commonProps} />;
      case 3:
        return <EnergyForm {...commonProps} onSubmit={handleSubmit} isLoading={isLoading} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Get Started</CardTitle>
            <CardDescription>
              Help us understand your lifestyle to calculate your carbon footprint
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
              </div>
              <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
              
              {/* Step Indicators */}
              <div className="flex justify-between mt-4">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className={`flex flex-col items-center ${
                      index <= currentStep ? 'text-emerald-600' : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= currentStep
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs mt-1 text-center hidden sm:block">
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Step Form */}
            <div className="mt-8">
              {renderStep()}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-4">
          This information helps us calculate your baseline carbon footprint and provide personalized recommendations.
        </p>
      </div>
    </div>
  );
}
