
import React from 'react';
import { Separator } from '@/components/ui/separator';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import AlertsList from '@/components/dashboard/AlertsList';
import EventsList from '@/components/dashboard/EventsList';
import QuickAccess from '@/components/dashboard/QuickAccess';
import RecentActivities from '@/components/dashboard/RecentActivities';

const Index = () => {
  return (
    <div className="space-y-8 animate-slideInUp">
      {/* Welcome section */}
      <WelcomeSection />

      {/* Alerts section */}
      <AlertsList />

      {/* Events section */}
      <EventsList />

      <Separator />

      {/* Quick access section */}
      <QuickAccess />

      <Separator />

      {/* Recent activity section */}
      <RecentActivities />
    </div>
  );
};

export default Index;
