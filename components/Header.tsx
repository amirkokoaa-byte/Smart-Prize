
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  themeConfig: any;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ themeConfig, onToggleSidebar }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    };
    return date.toLocaleDateString('ar-EG', options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  return (
    <header className={`${themeConfig.header} shadow-sm px-4 md:px-6 py-3 flex justify-between items-center z-30`}>
      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] opacity-60">التاريخ</p>
            <p className="font-bold text-xs md:text-sm whitespace-nowrap">{formatDate(time)}</p>
          </div>
          <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>
          <div className="text-right">
            <p className="text-[10px] opacity-60">الوقت</p>
            <p className="font-bold text-lg md:text-xl tabular-nums tracking-tight" dir="ltr">
              {formatTime(time)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <h1 className={`text-xl md:text-2xl font-black ${themeConfig.accent}`}>Smart Prize</h1>
      </div>
    </header>
  );
};

export default Header;
