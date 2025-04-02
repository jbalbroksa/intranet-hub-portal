
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useActivityData } from '@/hooks/useActivityData';
import { Bell, FileText, Package, Building } from 'lucide-react';

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Bell': return <Bell className="h-5 w-5" />;
    case 'FileText': return <FileText className="h-5 w-5" />;
    case 'Package': return <Package className="h-5 w-5" />;
    case 'Building': return <Building className="h-5 w-5" />;
    default: return <Bell className="h-5 w-5" />;
  }
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'hace unos segundos';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `hace ${diffInYears} ${diffInYears === 1 ? 'año' : 'años'}`;
};

const RecentActivities = () => {
  const { recentActivities } = useActivityData();

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-poppins font-medium">Actividad reciente</h2>
        <Button variant="ghost" size="sm" className="text-sm gap-1">
          Ver historial completo
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          {recentActivities.length > 0 ? (
            <ul className="space-y-4">
              {recentActivities.map((activity) => (
                <li key={`${activity.type}-${activity.id}`} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="p-2 rounded-full bg-muted">
                    {getIconComponent(activity.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{formatRelativeTime(activity.date)}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              No hay actividad reciente
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default RecentActivities;
