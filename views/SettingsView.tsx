
import React, { useState } from 'react';
import { User, AppState, Theme } from '../types';

interface SettingsViewProps {
  users: User[];
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  currentUser: User;
  themeConfig: any;
}

const SettingsView: React.FC<SettingsViewProps> = ({ users, setAppState, currentUser, themeConfig }) => {
  const [newUsername, setNewUsername] = useState(currentUser.username);
  const [newPassword, setNewPassword] = useState(currentUser.password);
  const [addUserForm, setAddUserForm] = useState({ username: '', password: '' });

  const handleUpdateProfile = () => {
    setAppState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === currentUser.id ? { ...u, username: newUsername, password: newPassword } : u),
      currentUser: { ...currentUser, username: newUsername, password: newPassword }
    }));
    alert('تم تحديث البيانات بنجاح');
  };

  const handleAddUser = () => {
    if (!addUserForm.username || !addUserForm.password) return;
    const newUser: User = {
      id: Date.now().toString(),
      username: addUserForm.username,
      password: addUserForm.password
    };
    setAppState(prev => ({ ...prev, users: [...prev.users, newUser] }));
    setAddUserForm({ username: '', password: '' });
  };

  const handleDeleteUser = (id: string) => {
    if (id === 'admin') return alert('لا يمكن حذف حساب الأدمن');
    setAppState(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
  };

  const changeTheme = (t: Theme) => {
    setAppState(prev => ({ ...prev, theme: t }));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      {/* Profile Settings */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">⚙️ إعدادات الحساب الشخصي</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">اسم المستخدم</label>
            <input 
              type="text" 
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">كلمة المرور</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <button 
          onClick={handleUpdateProfile}
          className={`mt-6 ${themeConfig.primary} text-white px-8 py-3 rounded-xl font-bold shadow-md`}
        >
          حفظ التعديلات
        </button>
      </div>

      {/* Theme Settings */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">🎨 شكل البرنامج (الثيمات)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => changeTheme('modern-blue')} className="p-4 border-2 border-blue-500 rounded-xl bg-slate-50 text-blue-600 font-bold hover:bg-blue-50">أزرق عصري</button>
          <button onClick={() => changeTheme('deep-dark')} className="p-4 border-2 border-zinc-900 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800">أسود داكن</button>
          <button onClick={() => changeTheme('nature-green')} className="p-4 border-2 border-emerald-500 rounded-xl bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-50">أخضر طبيعي</button>
          <button onClick={() => changeTheme('royal-purple')} className="p-4 border-2 border-indigo-500 rounded-xl bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-50">بنفسجي ملكي</button>
        </div>
      </div>

      {/* User Management (Admin Only Simulation) */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">👥 إدارة المستخدمين</h3>
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-end border-b pb-8">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">اسم مستخدم جديد</label>
            <input 
              type="text" 
              value={addUserForm.username}
              onChange={(e) => setAddUserForm(prev => ({ ...prev, username: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">كلمة المرور</label>
            <input 
              type="password" 
              value={addUserForm.password}
              onChange={(e) => setAddUserForm(prev => ({ ...prev, password: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button 
            onClick={handleAddUser}
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-green-700"
          >
            إضافة مستخدم
          </button>
        </div>

        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">👤</span>
                <div>
                  <p className="font-bold">{u.username}</p>
                  <p className="text-xs text-gray-500">ID: {u.id}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  disabled={u.id === 'admin' || u.id === currentUser.id}
                  onClick={() => handleDeleteUser(u.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg disabled:opacity-30"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
