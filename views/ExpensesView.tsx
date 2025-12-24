
import React, { useState } from 'react';
import { FinancialData, Expense } from '../types';
import { PRESET_EXPENSES } from '../constants';

interface ExpensesViewProps {
  data: FinancialData;
  updateData: (updater: (data: FinancialData) => FinancialData) => void;
  themeConfig: any;
}

const ExpensesView: React.FC<ExpensesViewProps> = ({ data, updateData, themeConfig }) => {
  const [selectedType, setSelectedType] = useState(PRESET_EXPENSES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customExpenseName, setCustomExpenseName] = useState('');
  const [modalData, setModalData] = useState({ name: '', amount: 0, date: '' });

  const totalExpensesValue = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = data.salary - totalExpensesValue;

  const handleOpenAddModal = (name: string) => {
    setModalData({ name, amount: 0, date: new Date().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const handleAddExpense = () => {
    if (modalData.amount <= 0) return;
    const newExpense: Expense = {
      id: Date.now().toString(),
      name: modalData.name,
      amount: modalData.amount,
      date: modalData.date,
      monthId: new Date().toISOString().substring(0, 7)
    };
    updateData(prev => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
    setIsModalOpen(false);
  };

  const handleAddCustomExpense = () => {
    if (!customExpenseName.trim()) return;
    handleOpenAddModal(customExpenseName);
    setCustomExpenseName('');
  };

  const handleTransfer = () => {
    if (data.expenses.length === 0) return;
    updateData(prev => ({
      ...prev,
      history: [
        ...prev.history,
        {
          monthName: new Date().toLocaleString('ar-EG', { month: 'long', year: 'numeric' }),
          salary: prev.salary,
          totalExpenses: totalExpensesValue,
          expenses: [...prev.expenses]
        }
      ],
      expenses: []
    }));
  };

  return (
    <div className="space-y-6">
      {/* Salary Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-500 mb-2">المرتب الشهري</label>
          <div className="flex items-center gap-2">
            <input 
              type="number"
              value={data.salary || ''}
              onChange={(e) => updateData(prev => ({ ...prev, salary: parseFloat(e.target.value) || 0 }))}
              className="text-3xl font-bold w-full bg-transparent focus:outline-none border-b-2 border-gray-100 focus:border-blue-500 transition-colors"
              placeholder="0.00"
            />
            <span className="text-xl font-bold text-gray-400">جم</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-2">إجمالي المصروفات</p>
          <p className="text-3xl font-bold text-red-500">{totalExpensesValue.toLocaleString()} جم</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-2">المتبقي</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-600'}`}>
            {balance.toLocaleString()} جم
          </p>
        </div>
      </div>

      {/* Expense Addition Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span>💸</span>
          <span>مصروفات شهرية</span>
        </h3>
        
        <div className="flex flex-col md:flex-row gap-4 items-end mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-2">اختر نوع المصروف</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {PRESET_EXPENSES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <button 
            onClick={() => handleOpenAddModal(selectedType)}
            className={`${themeConfig.primary} text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95`}
          >
            إضافة مصروفات
          </button>
          
          <div className="flex-1 border-r pr-4 border-gray-100">
            <label className="block text-sm font-medium text-gray-600 mb-2">إضافة مصروف آخر</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={customExpenseName}
                onChange={(e) => setCustomExpenseName(e.target.value)}
                placeholder="اسم المصروف..."
                className="flex-1 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleAddCustomExpense}
                className="bg-gray-800 text-white w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b-2 border-gray-50">
                <th className="pb-4 font-bold text-gray-600">المصروف</th>
                <th className="pb-4 font-bold text-gray-600 text-center">القيمة</th>
                <th className="pb-4 font-bold text-gray-600 text-center">ميعاد السداد</th>
                <th className="pb-4 font-bold text-gray-600 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium">{exp.name}</td>
                  <td className="py-4 text-center font-bold text-blue-600">{exp.amount} جم</td>
                  <td className="py-4 text-center text-gray-500">{exp.date}</td>
                  <td className="py-4 text-left">
                    <button 
                      onClick={() => updateData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== exp.id) }))}
                      className="text-red-400 hover:text-red-600"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
              {data.expenses.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">لا توجد مصروفات مسجلة لهذا الشهر</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button 
            onClick={handleTransfer}
            className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-3 rounded-2xl font-bold shadow-lg transition-all"
          >
            ترحيل للأشهر السابقة
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">إضافة {modalData.name}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">القيمة</label>
                <input 
                  type="number"
                  value={modalData.amount || ''}
                  onChange={(e) => setModalData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">معاد السداد</label>
                <input 
                  type="date"
                  value={modalData.date}
                  onChange={(e) => setModalData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={handleAddExpense}
                className={`flex-1 ${themeConfig.primary} text-white py-3 rounded-xl font-bold shadow-md`}
              >
                إضافة
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesView;
