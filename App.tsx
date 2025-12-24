
import React, { useState, useEffect, useMemo } from 'react';
import { User, AppState, Theme, FinancialData, ChatMessage, Expense, Obligation } from './types';
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

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('smart_prize_state');
    if (saved) return JSON.parse(saved);
    return {
      currentUser: null,
      users: [{ id: 'admin', username: 'admin', password: 'admin' }],
      financialData: {},
      messages: [],
      theme: 'modern-blue'
    };
  });

  const [activeTab, setActiveTab] = useState<'expenses' | 'obligations' | 'history' | 'settings'>('expenses');

  useEffect(() => {
    localStorage.setItem('smart_prize_state', JSON.stringify(state));
  }, [state]);

  const currentUserData = useMemo(() => {
    if (!state.currentUser) return INITIAL_FINANCIAL_DATA;
    return state.financialData[state.currentUser.id] || INITIAL_FINANCIAL_DATA;
  }, [state.currentUser, state.financialData]);

  const updateUserData = (updater: (data: FinancialData) => FinancialData) => {
    if (!state.currentUser) return;
    const userId = state.currentUser.id;
    setState(prev => ({
      ...prev,
      financialData: {
        ...prev.financialData,
        [userId]: updater(prev.financialData[userId] || INITIAL_FINANCIAL_DATA)
      }
    }));
  };

  const handleLogin = (user: User) => {
    setState(prev => ({ ...prev, currentUser: user }));
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  if (!state.currentUser) {
    return <Login onLogin={handleLogin} users={state.users} />;
  }

  const themeConfig = THEMES[state.theme];

  return (
    <div className={`flex h-screen overflow-hidden ${themeConfig.body} ${themeConfig.text}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        themeConfig={themeConfig}
        obligations={currentUserData.obligations}
      />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Header themeConfig={themeConfig} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
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
          messages={state.messages} 
          currentUser={state.currentUser}
          users={state.users}
          onSendMessage={(msg) => setState(prev => ({ ...prev, messages: [...prev.messages, msg] }))}
          themeConfig={themeConfig}
        />
      </div>
    </div>
  );
};

export default App;
