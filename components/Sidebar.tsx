
import React, { useMemo } from 'react';
import { Obligation } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onLogout: () => void;
  themeConfig: any;
  obligations: Obligation[];
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, themeConfig, obligations, isOpen }) => {
  
  const hasDueToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return obligations.some(o => o.date === today && !o.isCompleted);
  }, [obligations]);

  const navItems = [
    { id: 'expenses', label: 'المصروفات الشهرية', icon: '💰' },
    { id: 'obligations', label: 'الالتزامات', icon: '📝', alert: hasDueToday },
    { id: 'history', label: 'الأشهر السابقة', icon: '📅' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
  ];

  return (
    <aside className={`
      ${themeConfig.sidebar} 
      fixed lg:static inset-y-0 right-0 z-50 w-64 text-white flex flex-col h-full shadow-2xl transition-all duration-300
      ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-8 text-center border-b border-white/10">
        <h2 className="text-2xl font-black tracking-tighter">SMART PRIZE</h2>
        <div className="w-10 h-1 bg-blue-500 mx-auto mt-2 rounded-full"></div>
      </div>

      <nav className="flex-1 mt-8 px-4 space-y-3">
        {navItems.map((item) => {
          const isSelected = activeTab === item.id;
          const isAlert = item.alert && item.id === 'obligations';
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                ${isSelected ? 'bg-white/20 shadow-lg scale-105' : 'hover:bg-white/10'}
                ${isAlert ? 'bg-red-600 animate-pulse' : ''}
              `}
            >
              <span className={`text-2xl transition-transform group-hover:scale-125 ${isSelected ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-white/70'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-2xl font-bold transition-all border border-red-500/20"
        >
          <span>🚪</span>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
