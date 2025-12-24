
import React from 'react';
import { FinancialData, User, AppState } from '../types';
import ExpensesView from './ExpensesView';
import ObligationsView from './ObligationsView';
import HistoryView from './HistoryView';
import SettingsView from './SettingsView';

interface DashboardProps {
  activeTab: string;
  financialData: FinancialData;
  updateUserData: (updater: (data: FinancialData) => FinancialData) => void;
  themeConfig: any;
  users: User[];
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ activeTab, financialData, updateUserData, themeConfig, users, setAppState, currentUser }) => {
  switch (activeTab) {
    case 'expenses':
      return <ExpensesView data={financialData} updateData={updateUserData} themeConfig={themeConfig} />;
    case 'obligations':
      return <ObligationsView data={financialData} updateData={updateUserData} themeConfig={themeConfig} />;
    case 'history':
      return <HistoryView data={financialData} updateData={updateUserData} themeConfig={themeConfig} />;
    case 'settings':
      return (
        <SettingsView 
          users={users} 
          setAppState={setAppState} 
          currentUser={currentUser} 
          themeConfig={themeConfig} 
        />
      );
    default:
      return null;
  }
};

export default Dashboard;
