
import React, { useMemo } from 'react';
import { Obligation } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onLogout: () => void;
  themeConfig: any;
  obligations: Obligation[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, themeConfig, obligations }) => {
  
  const hasDueObligation = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return obligations.some(obs => !obs.isCompleted && obs.date === today);
  }, [obligations]);

  const navItems = [
    { id: 'expenses', label: 'المصروفات الشهرية', icon: '💰' },
    { id: 'obligations', label: 'الالتزامات', icon: '📝', alert: hasDueObligation },
    { id: 'history', label: 'الأشهر السابقة', icon: '📅' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
  ];

  return (
    <aside className={`${themeConfig.sidebar} w-64 text-white flex flex-col h-full shadow-xl transition-all`}>
      <div className="p-6 text-center border-b border-white/10">
        <h2 className="text-xl font-bold tracking-widest">SMART PRIZE</h2>
        <p className="text-xs text-white/50 mt-1 uppercase">Financial Manager</p>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-white/20 shadow-lg' 
                : 'hover:bg-white/10'
            } ${item.alert && item.id === 'obligations' ? 'bg-red-600 animate-pulse' : ''}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            {item.alert && item.id === 'obligations' && (
              <span className="mr-auto w-2 h-2 bg-white rounded-full"></span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg transition-colors"
        >
          <span>🚪</span>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
