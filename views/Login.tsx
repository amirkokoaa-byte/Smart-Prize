
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-blue-50 rounded-3xl mb-4 text-4xl">💰</div>
          <h1 className="text-4xl font-black text-slate-800 mb-2">Smart Prize</h1>
          <p className="text-slate-400 font-medium">نظام الإدارة المالية الذكي</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">اسم المستخدم</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
          >
            تسجيل الدخول
          </button>
        </form>

        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>أهلاً بك في نظام الإدارة المالية الأكثر أماناً</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
