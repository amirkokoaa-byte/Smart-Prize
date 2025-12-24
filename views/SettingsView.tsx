
import React, { useState } from 'react';
import { User, AppState, Theme } from '../types';
import { APP_STORAGE_KEY } from '../App';

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
  const [importJson, setImportJson] = useState('');

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
    alert('تم إضافة المستخدم بنجاح');
  };

  const handleDeleteUser = (id: string) => {
    if (id === 'admin') return alert('لا يمكن حذف حساب الأدمن');
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setAppState(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
    }
  };

  const changeTheme = (t: Theme) => {
    setAppState(prev => ({ ...prev, theme: t }));
  };

  const exportData = () => {
    const saved = localStorage.getItem(APP_STORAGE_KEY);
    if (saved) {
      navigator.clipboard.writeText(saved);
      alert('تم نسخ كود البيانات بنجاح. يمكنك لصقه في أي متصفح آخر.');
    }
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJson);
      // فحص أمان للبيانات المستوردة
      if (parsed.users && parsed.financialData) {
        setAppState(parsed);
        localStorage.