
import React from 'react';
import { Bell, Clock, AlertCircle, InfoIcon } from 'lucide-react';

type NotificationType = 'info' | 'update' | 'alert' | 'reminder' | 'high' | 'medium' | 'low' | string;

type NotificationIconProps = {
  type: NotificationType;
};

const NotificationIcon: React.FC<NotificationIconProps> = ({ type }) => {
  switch(type) {
    case 'info':
      return <InfoIcon className="h-5 w-5 text-blue-500" />;
    case 'update':
      return <Clock className="h-5 w-5 text-green-500" />;
    case 'alert':
    case 'high':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'medium':
      return <AlertCircle className="h-5 w-5 text-orange-500" />;
    case 'reminder':
    case 'low':
      return <Bell className="h-5 w-5 text-amber-500" />;
    default:
      return <InfoIcon className="h-5 w-5 text-blue-500" />;
  }
};

export default NotificationIcon;
