
import React, { useState } from 'react';
import { FinancialData, Obligation } from '../types';
import { PRESET_OBLIGATIONS } from '../constants';

interface ObligationsViewProps {
  data: FinancialData;
  updateData: (updater: (data: FinancialData) => FinancialData) => void;
  themeConfig: any;
}

const ObligationsView: React.FC<ObligationsViewProps> = ({ data, updateData, themeConfig }) => {
  const [selectedType, setSelectedType] = useState(PRESET_OBLIGATIONS[0]);
  const [customType, setCustomType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [modalData, setModalData] = useState({
    type: '',
    value: 0,
    installments: 1,
    paid: 0,
    duration: 'شهرية',
    date: ''
  });

  const totalBefore = data.obligations.reduce((sum, o) => sum + o.value, 0);
  const totalRemaining = data.obligations.reduce((sum, o) => sum + (o.value - o.paidAmount), 0);

  const openModal = (type: string, existing?: Obligation) => {
    if (existing) {
      setEditId(existing.id);
      setModalData({
        type: existing.type,
        value: existing.value,
        installments: existing.installmentsCount,
        paid: existing.paidAmount,
        duration: existing.duration,
        date: existing.date
      });
    } else {
      setEditId(null);
      setModalData({
        type,
        value: 0,
        installments: 1,
        paid: 0,
        duration: 'شهرية',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (modalData.value <= 0) return;
    
    const obsObj: Obligation = {
      id: editId || Date.now().toString(),
      type: modalData.type,
      value: modalData.value,
      installmentsCount: modalData.installments,
      paidAmount: modalData.paid,
      duration: modalData.duration,
      date: modalData.date,
      isCompleted: modalData.paid >= modalData.value
    };

    updateData(prev => {
      const filtered = editId ? prev.obligations.filter(o => o.id !== editId) : prev.obligations;
      return { ...prev, obligations: [...filtered, obsObj] };
    });
    
    setIsModalOpen(false);
  };

  const markAsPaid = (id: string) => {
    updateData(prev => ({
      ...prev,
      obligations: prev.obligations.map(o => {
        if (o.id !== id) return o;
        const perMonth = o.value / o.installmentsCount;
        const nextPaid = Math.min(o.paidAmount + perMonth, o.value);
        return { ...o, paidAmount: nextPaid, isCompleted: nextPaid >= o.value };
      })
    }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-8 rounded-[2rem] border-2 border-blue-50 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">القيمة الكلية للالتزامات</p>
            <p className="text-3xl font-black text-slate-800">{totalBefore.toLocaleString()} جم</p>
          </div>
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-100">📋</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border-2 border-red-50 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">المتبقي المطلوب سداده</p>
            <p className="text-3xl font-black text-red-600">{totalRemaining.toLocaleString()} جم</p>
          </div>
          <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-red-100">⏳</div>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h3 className="text-2xl font-black text-slate-800">الالتزامات والأقساط</h3>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-50 border-none rounded-xl p-3 font-bold text-sm flex-1 md:flex-none"
            >
              {PRESET_OBLIGATIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <button 
              onClick={() => openModal(selectedType)}
              className={`${themeConfig.primary} text-white px-6 py-3 rounded-xl font-black shadow-lg transition-transform active:scale-95`}
            >
              إضافة جديد
            </button>
          </div>
        </div>

        {/* Custom Type Field */}
        <div className="mb-8 p-4 bg-slate-50 rounded-2xl flex gap-3 items-center">
          <span className="text-xl">⚙️</span>
          <input 
            type="text" 
            value={customType} 
            onChange={(e) => setCustomType(e.target.value)} 
            placeholder="هل لديك التزام آخر؟ اكتب اسمه هنا..."
            className="flex-1 bg-transparent border-none focus:ring-0 font-bold"
          />
          <button 
            onClick={() => { if(customType) { openModal(customType); setCustomType(''); } }}
            className="bg-slate-800 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black"
          >
            +
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-right border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="pb-2 px-4">نوع الالتزام</th>
                <th className="pb-2 text-center">القيمة</th>
                <th className="pb-2 text-center">الأقساط</th>
                <th className="pb-2 text-center">المدفوع</th>
                <th className="pb-2 text-center">المتبقي</th>
                <th className="pb-2 text-center">التاريخ</th>
                <th className="pb-2 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {data.obligations.map((obs) => (
                <tr key={obs.id} className={`bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all ${obs.isCompleted ? 'opacity-40 grayscale' : ''}`}>
                  <td className="py-5 px-4 rounded-r-2xl font-black text-slate-700">{obs.type}</td>
                  <td className="py-5 text-center font-bold">{obs.value.toLocaleString()}</td>
                  <td className="py-5 text-center font-bold text-slate-400">{obs.installmentsCount}</td>
                  <td className="py-5 text-center font-black text-emerald-500">{obs.paidAmount.toLocaleString()}</td>
                  <td className="py-5 text-center font-black text-red-500">{(obs.value - obs.paidAmount).toLocaleString()}</td>
                  <td className="py-5 text-center text-xs text-gray-400">{obs.date}</td>
                  <td className="py-5 px-4 rounded-l-2xl text-left">
                    <div className="flex gap-2 justify-end">
                      {!obs.isCompleted && (
                        <button 
                          onClick={() => markAsPaid(obs.id)}
                          className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-emerald-600 shadow-md"
                        >
                          سداد قسط
                        </button>
                      )}
                      <button onClick={() => openModal(obs.type, obs)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg">✏️</button>
                      <button onClick={() => updateData(prev => ({ ...prev, obligations: prev.obligations.filter(o => o.id !== obs.id) }))} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.obligations.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-gray-300 font-bold">لا توجد التزامات مسجلة حالياً</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white rounded-[3rem] p-8 max-w-lg w-full shadow-2xl my-auto animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-center mb-8 text-slate-800 tracking-tighter">تفاصيل {modalData.type}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="col-span-full sm:col-span-1">
                <label className="block text-xs font-black text-gray-400 mb-2">قيمة الالتزام الكلية</label>
                <input 
                  type="number"
                  value={modalData.value || ''}
                  onChange={(e) => setModalData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div className="col-span-full sm:col-span-1">
                <label className="block text-xs font-black text-gray-400 mb-2">عدد الأقساط</label>
                <input 
                  type="number"
                  value={modalData.installments || ''}
                  onChange={(e) => setModalData(prev => ({ ...prev, installments: parseInt(e.target.value) || 1 }))}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                />
              </div>
              <div className="col-span-full sm:col-span-1">
                <label className="block text-xs font-black text-gray-400 mb-2">المدفوع حالياً</label>
                <input 
                  type="number"
                  value={modalData.paid || ''}
                  onChange={(e) => setModalData(prev => ({ ...prev, paid: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div className="col-span-full sm:col-span-1">
                <label className="block text-xs font-black text-gray-400 mb-2">تاريخ الاستحقاق القادم</label>
                <input 
                  type="date"
                  value={modalData.date}
                  onChange={(e) => setModalData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
                />
              </div>
              <div className="col-span-full">
                <label className="block text-xs font-black text-gray-400 mb-2">مدة الالتزام (اختياري)</label>
                <input 
                  type="text"
                  value={modalData.duration}
                  onChange={(e) => setModalData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
                  placeholder="مثال: سنتين، 12 شهر..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={handleSave} className={`flex-1 ${themeConfig.primary} text-white py-5 rounded-[1.5rem] font-black shadow-xl`}>
                {editId ? 'تحديث البيانات' : 'إضافة الالتزام'}
              </button>
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-[1.5rem] font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObligationsView;
