
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

  const totalExpenses = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = data.salary - totalExpenses;

  const openAddModal = (name: string) => {
    setModalData({ name, amount: 0, date: new Date().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    if (modalData.amount <= 0) return;
    const newExp: Expense = {
      id: Date.now().toString(),
      name: modalData.name,
      amount: modalData.amount,
      date: modalData.date,
      monthId: new Date().toISOString().substring(0, 7)
    };
    updateData(prev => ({ ...prev, expenses: [...prev.expenses, newExp] }));
    setIsModalOpen(false);
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
          totalExpenses: totalExpenses,
          expenses: [...prev.expenses]
        }
      ],
      expenses: []
    }));
    alert('تم ترحيل البيانات للأشهر السابقة بنجاح');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Salary Bar */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full">
          <label className="block text-xs font-black text-gray-400 mb-1 uppercase tracking-tighter">الراتب الشهري</label>
          <div className="flex items-center gap-3">
            <input 
              type="number"
              value={data.salary || ''}
              onChange={(e) => updateData(prev => ({ ...prev, salary: parseFloat(e.target.value) || 0 }))}
              className="text-3xl font-black w-full bg-slate-50 rounded-2xl p-3 border-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
            <span className="text-xl font-bold text-slate-300">جم</span>
          </div>
        </div>
        
        <div className="h-10 w-px bg-gray-100 hidden md:block"></div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="text-center px-6">
            <p className="text-[10px] font-bold text-gray-400 mb-1">المصروفات</p>
            <p className="text-xl font-black text-red-500">{totalExpenses.toLocaleString()}</p>
          </div>
          <div className="text-center px-6 bg-blue-50 rounded-2xl py-2">
            <p className="text-[10px] font-bold text-blue-400 mb-1">المتبقي</p>
            <p className={`text-xl font-black ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="font-black mb-4 flex items-center gap-2">
              <span className="text-blue-500">➕</span> إضافة مصروفات
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="flex-1 bg-slate-50 border-none rounded-xl p-3 font-bold text-sm"
                >
                  {PRESET_EXPENSES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <button 
                  onClick={() => openAddModal(selectedType)}
                  className={`${themeConfig.primary} text-white px-5 rounded-xl font-black shadow-lg active:scale-90 transition-transform`}
                >
                  أضف
                </button>
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-50">
                <input 
                  type="text" 
                  value={customExpenseName}
                  onChange={(e) => setCustomExpenseName(e.target.value)}
                  placeholder="مصروف آخر..."
                  className="flex-1 bg-slate-50 border-none rounded-xl p-3 text-sm"
                />
                <button 
                  onClick={() => { if(customExpenseName) { openAddModal(customExpenseName); setCustomExpenseName(''); } }}
                  className="bg-slate-800 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={handleTransfer}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-5 rounded-[2rem] font-black shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-3"
          >
            <span>🚀</span> ترحيل للأشهر السابقة
          </button>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
          <h3 className="font-black mb-6 text-xl">قائمة مصروفات الشهر</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-400 text-[10px] font-black uppercase">
                  <th className="pb-4 px-4">المصروف</th>
                  <th className="pb-4 text-center">القيمة</th>
                  <th className="pb-4 text-center">التاريخ</th>
                  <th className="pb-4 text-left">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {data.expenses.map((exp) => (
                  <tr key={exp.id} className="bg-slate-50 rounded-2xl overflow-hidden group hover:bg-slate-100 transition-colors">
                    <td className="py-4 px-4 rounded-r-2xl font-bold">{exp.name}</td>
                    <td className="py-4 text-center font-black text-blue-600">{exp.amount} جم</td>
                    <td className="py-4 text-center text-[10px] text-gray-400">{exp.date}</td>
                    <td className="py-4 px-4 rounded-l-2xl text-left">
                      <button 
                        onClick={() => updateData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== exp.id) }))}
                        className="text-red-400 hover:text-red-600 font-bold text-xs"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
                {data.expenses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-gray-300 font-bold italic">لا توجد بيانات مسجلة</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-2xl mx-auto mb-4">💰</div>
              <h2 className="text-2xl font-black text-slate-800">{modalData.name}</h2>
              <p className="text-xs text-slate-400 font-bold mt-1">أدخل تفاصيل الدفع</p>
            </div>
            
            <div className="space-y-4">
              <input 
                type="number"
                value={modalData.amount || ''}
                onChange={(e) => setModalData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-xl text-center focus:ring-2 focus:ring-blue-500"
                placeholder="0.00 جم"
                autoFocus
              />
              <input 
                type="date"
                value={modalData.date}
                onChange={(e) => setModalData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-center"
              />
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={handleAdd} className={`flex-1 ${themeConfig.primary} text-white py-4 rounded-2xl font-black shadow-lg`}>تأكيد</button>
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesView;
