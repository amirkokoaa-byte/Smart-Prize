
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  themeConfig: any;
}

const Header: React.FC<HeaderProps> = ({ themeConfig }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('ar-EG', options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true 
    });
  };

  return (
    <header className={`${themeConfig.header} shadow-sm px-6 py-4 flex justify-between items-center z-10`}>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs opacity-60">اليوم والتاريخ</p>
          <p className="font-bold text-sm md:text-base">{formatDate(time)}</p>
        </div>
        <div className="h-8 w-[1px] bg-gray-300"></div>
        <div className="text-right">
          <p className="text-xs opacity-60">الوقت الآن</p>
          <p className="font-bold text-xl md:text-2xl tabular-nums tracking-tighter" dir="ltr">
            {formatTime(time)}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <h1 className={`text-2xl font-bold ${themeConfig.accent}`}>Smart Prize</h1>
      </div>
    </header>
  );
};

export default Header;
