import React from 'react';
import { DashboardView } from '../features/dashboard';

interface DashboardPageProps {
  onOpenFamilyTree?: () => void;
  onOpenProfile?: () => void;
  onOpenContactAdmin?: () => void;
  onOpenAdminConsole?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  return (
    <div className="dashboard-page-wrapper">
      <DashboardView {...props} />
    </div>
  );
};

export default DashboardPage;
