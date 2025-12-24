
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
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white shadow-2xl rounded-2xl w-80 mb-4 flex flex-col h-[450px] border border-gray-100 animate-in slide-in-from-bottom-5">
          <div className={`${themeConfig.primary} p-4 rounded-t-2xl text-white flex justify-between items-center`}>
            <span className="font-bold">المحادثة العامة</span>
            <button onClick={() => setIsOpen(false)} className="text-xl">&times;</button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUser.id ? 'items-start' : 'items-end'}`}>
                <span className="text-[10px] text-gray-500 mb-1">{msg.senderName}</span>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  msg.senderId === currentUser.id 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t bg-white rounded-b-2xl">
            <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
              {emojis.map(e => (
                <button key={e} onClick={() => setText(prev => prev + e)} className="hover:scale-125 transition-transform">{e}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب رسالة..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleSend}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${themeConfig.primary}`}
              >
                ✈️
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${themeConfig.primary} w-16 h-16 rounded-full shadow-2xl text-white text-2xl flex items-center justify-center hover:scale-105 transition-all`}
      >
        💬
      </button>
    </div>
  );
};

export default Chat;
