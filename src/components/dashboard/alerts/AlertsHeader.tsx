
import React from 'react';
import AlertCreateDialog from './AlertCreateDialog';

interface AlertsHeaderProps {
  title?: string;
}

const AlertsHeader = ({ title = "Alertas" }: AlertsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-poppins font-medium">{title}</h2>
      <AlertCreateDialog />
    </div>
  );
};

export default AlertsHeader;
