
import React from 'react';
import { Separator } from '@/components/ui/separator';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import AlertsSection from '@/components/dashboard/AlertsSection';
import EventsSection from '@/components/dashboard/EventsSection';
import QuickAccess from '@/components/dashboard/QuickAccess';
import RecentActivities from '@/components/dashboard/RecentActivities';

const Index = () => {
  return (
    <div className="space-y-8 animate-slideInUp">
      {/* Welcome section */}
      <WelcomeSection />

      {/* Alerts section */}
      <AlertsSection />

      {/* Events section */}
      <EventsSection />

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
