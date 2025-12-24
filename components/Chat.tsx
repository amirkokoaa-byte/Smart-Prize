
import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';

interface ChatProps {
  messages: ChatMessage[];
  currentUser: User;
  users: User[];
  onSendMessage: (msg: ChatMessage) => void;
  themeConfig: any;
}

const Chat: React.FC<ChatProps> = ({ messages, currentUser, users, onSendMessage, themeConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!text.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.username,
      text: text,
      timestamp: Date.now()
    };
    onSendMessage(newMessage);
    setText('');
  };

  const emojis = ['😊', '💰', '👍', '📉', '📈', '🚀', '⭐', '📍'];

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="pointer-events-auto bg-white shadow-2xl rounded-3xl w-[calc(100vw-2rem)] sm:w-80 mb-4 flex flex-col h-[500px] sm:h-[450px] border border-gray-100 animate-in slide-in-from-bottom-5">
          <div className={`${themeConfig.primary} p-5 rounded-t-3xl text-white flex justify-between items-center shadow-lg`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="font-bold">المحادثة الجماعية</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">✕</button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-center py-10 text-gray-300">
                <p className="text-xs font-medium italic">كن أول من يرسل رسالة!</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUser.id ? 'items-start' : 'items-end'}`}>
                <span className="text-[10px] text-gray-400 mb-1 px-1 font-bold">{msg.senderName}</span>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                  msg.senderId === currentUser.id 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t bg-white rounded-b-3xl">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
              {emojis.map(e => (
                <button 
                  key={e} 
                  onClick={() => setText(prev => prev + e)} 
                  className="bg-gray-50 hover:bg-gray-100 w-8 h-8 flex-shrink-0 rounded-lg text-lg flex items-center justify-center transition-all active:scale-125"
                >
                  {e}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب شيئاً..."
                className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              <button 
                onClick={handleSend}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all ${themeConfig.primary}`}
              >
                <svg className="w-5 h-5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto ${themeConfig.primary} w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl shadow-2xl text-white text-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-90`}
      >
        <span className="animate-bounce">💬</span>
      </button>
    </div>
  );
};

export default Chat;
