
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customType, setCustomType] = useState('');
  const [modalData, setModalData] = useState({
    type: '',
    value: 0,
    installments: 0,
    paid: 0,
    duration: '',
    date: ''
  });

  const totalBefore = data.obligations.reduce((sum, o) => sum + o.value, 0);
  const totalRemaining = data.obligations.reduce((sum, o) => sum + (o.value - o.paidAmount), 0);

  const handleOpenModal = (type: string) => {
    setModalData({
      type,
      value: 0,
      installments: 1,
      paid: 0,
      duration: 'شهرية',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleAddObligation = () => {
    if (modalData.value <= 0) return;
    const newObs: Obligation = {
      id: Date.now().toString(),
      type: modalData.type,
      value: modalData.value,
      installmentsCount: modalData.installments,
      paidAmount: modalData.paid,
      duration: modalData.duration,
      date: modalData.date,
      isCompleted: modalData.paid >= modalData.value
    };
    updateData(prev => ({ ...prev, obligations: [...prev.obligations, newObs] }));
    setIsModalOpen(false);
  };

  const updateObligationStatus = (id: string, action: 'paid' | 'delete') => {
    updateData(prev => {
      if (action === 'delete') {
        return { ...prev, obligations: prev.obligations.filter(o => o.id !== id) };
      }
      return {
        ...prev,
        obligations: prev.obligations.map(o => {
          if (o.id !== id) return o;
          const installmentValue = o.value / o.installmentsCount;
          const newPaid = Math.min(o.paidAmount + installmentValue, o.value);
          return { ...o, paidAmount: newPaid, isCompleted: newPaid >= o.value };
        })
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span>📝</span>
          <span>الالتزامات والأقساط</span>
        </h3>

        <div className="flex flex-col md:flex-row gap-4 items-end mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-2">نوع الالتزام</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {PRESET_OBLIGATIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <button 
            onClick={() => handleOpenModal(selectedType)}
            className={`${themeConfig.primary} text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all`}
          >
            إضافة التزام
          </button>
          <div className="flex-1 border-r pr-4 border-gray-100">
            <label className="block text-sm font-medium text-gray-600 mb-2">التزام آخر</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="نوع الالتزام..."
                className="flex-1 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={() => { if(customType) { handleOpenModal(customType); setCustomType(''); } }}
                className="bg-gray-800 text-white w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b-2 border-gray-50">
                <th className="pb-4 font-bold text-gray-600">النوع</th>
                <th className="pb-4 font-bold text-gray-600 text-center">القيمة الكلية</th>
                <th className="pb-4 font-bold text-gray-600 text-center">الأقساط</th>
                <th className="pb-4 font-bold text-gray-600 text-center">المدفوع</th>
                <th className="pb-4 font-bold text-gray-600 text-center">المتبقي</th>
                <th className="pb-4 font-bold text-gray-600 text-center">التاريخ</th>
                <th className="pb-4 font-bold text-gray-600 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.obligations.map((obs) => (
                <tr key={obs.id} className={`hover:bg-gray-50 transition-colors ${obs.isCompleted ? 'opacity-50 grayscale' : ''}`}>
                  <td className="py-4 font-medium">{obs.type}</td>
                  <td className="py-4 text-center font-bold text-gray-700">{obs.value} جم</td>
                  <td className="py-4 text-center">{obs.installmentsCount}</td>
                  <td className="py-4 text-center text-green-600 font-bold">{obs.paidAmount.toFixed(2)} جم</td>
                  <td className="py-4 text-center text-red-500 font-bold">{(obs.value - obs.paidAmount).toFixed(2)} جم</td>
                  <td className="py-4 text-center text-gray-500">{obs.date}</td>
                  <td className="py-4 text-left">
                    <div className="flex gap-2 justify-end">
                      {!obs.isCompleted && (
                        <button 
                          onClick={() => updateObligationStatus(obs.id, 'paid')}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-200"
                        >
                          تم السداد
                        </button>
                      )}
                      <button 
                        onClick={() => updateObligationStatus(obs.id, 'delete')}
                        className="text-red-400 hover:text-red-600 px-3 py-1"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.obligations.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">لا توجد التزامات مسجلة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">قيمة الالتزامات الكلية</p>
            <p className="text-3xl font-black text-blue-800">{totalBefore.toLocaleString()} جم</p>
          </div>
          <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-2xl">📊</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-red-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">المتبقي الكلي</p>
            <p className="text-3xl font-black text-red-600">{totalRemaining.toLocaleString()} جم</p>
          </div>
          <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center text-2xl">⏳</div>
        </div>
      </div>

      {/* Add Obligation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">تفاصيل {modalData.type}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">قيمة الالتزام</label>
                <input 
                  type="number"
                  value={modalData.value || ''}
                  onChange={(e) => setModalData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">عدد الأقساط</label>
                <input 
                  type="number"
                  value={modalData.installments || ''}
                  onChange={(e) => setModalData(prev => ({ ...prev, installments: parseInt(e.target.value) || 1 }))}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">المدفوع حالياً</label>
                <input 
                  type="number"
                  value={modalData.paid || ''}
                  onChange={(e) => setModalData(prev => ({ ...prev, paid: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">مدة الالتزام</label>
                <input 
                  type="text"
                  value={modalData.duration}
                  onChange={(e) => setModalData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="مثال: سنة"
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">تاريخ الاستحقاق القادم</label>
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
                onClick={handleAddObligation}
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

export default ObligationsView;
