
import React, { useState, useEffect, useMemo } from 'react';
import { User, AppState, Theme, FinancialData } from './types';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chat from './components/Chat';
import { THEMES } from './constants';

const INITIAL_FINANCIAL_DATA: FinancialData = {
  salary: 0,
  expenses: [],
  obligations: [],
  history: []
};

const DEFAULT_STATE: AppState = {
  currentUser: null,
  users: [{ id: 'admin', username: 'admin', password: 'admin' }],
  financialData: {},
  messages: [],
  theme: 'modern-blue'
};

// تم توحيد المفتاح لضمان عدم حدوث تعارض
export const APP_STORAGE_KEY = 'smart_prize_v3_stable_final';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(APP_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // تأكد من دمج البيانات الافتراضية مع المحفوظة لتجنب خصائص مفقودة
        return { 
          ...DEFAULT_STATE, 
          ...parsed, 
          currentUser: null // إجبار الدخول عند إعادة التحميل للأمان
        };
      }
    } catch (e) { 
      console.error("Critical Storage Error: Resetting to default state.");
    }
    return DEFAULT_STATE;
  });

  const [activeTab, setActiveTab] = useState<'expenses' | 'obligations' | 'history' | 'settings'>('expenses');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state to localStorage");
    }
  }, [state]);

  const currentUserData = useMemo(() => {
    if (!state.currentUser) return INITIAL_FINANCIAL_DATA;
    return state.financialData[state.currentUser.id] || { ...INITIAL_FINANCIAL_DATA };
  }, [state.currentUser, state.financialData]);

  const updateUserData = (updater: (data: FinancialData) => FinancialData) => {
    if (!state.currentUser) return;
    const userId = state.currentUser.id;
    setState(prev => {
      const currentData = prev.financialData[userId] || { ...INITIAL_FINANCIAL_DATA };
      return {
        ...prev,
        financialData: {
          ...prev.financialData,
          [userId]: updater(currentData)
        }
      };
    });
  };

  const handleLogin = (user: User) => setState(prev => ({ ...prev, currentUser: user }));
  
  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    setActiveTab('expenses');
    setIsSidebarOpen(false);
  };

  if (!state.currentUser) {
    return <Login onLogin={handleLogin} users={state.users} />;
  }

  const themeConfig = THEMES[state.theme] || THEMES['modern-blue'];

  return (
    <div className={`flex h-screen overflow-hidden ${themeConfig.body} ${themeConfig.text} font-sans transition-colors duration-500`}>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }} 
        onLogout={handleLogout}
        themeConfig={themeConfig}
        obligations={currentUserData.obligations || []}
        isOpen={isSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Header themeConfig={themeConfig} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <Dashboard 
            activeTab={activeTab}
            financialData={currentUserData}
            updateUserData={updateUserData}
            themeConfig={themeConfig}
            users={state.users}
            setAppState={setState}
            currentUser={state.currentUser}
          />
        </main>

        <Chat 
          messages={state.messages || []} 
          currentUser={state.currentUser}
          users={state.users}
          onSendMessage={(msg) => setState(prev => ({ ...prev, messages: [...(prev.messages || []), msg] }))}
          themeConfig={themeConfig}
        />
      </div>
    </div>
  );
};

export default App;
