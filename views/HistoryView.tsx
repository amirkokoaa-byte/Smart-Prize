
import React from 'react';
import { FinancialData } from '../types';

interface HistoryViewProps {
  data: FinancialData;
  updateData: (updater: (data: FinancialData) => FinancialData) => void;
  themeConfig: any;
}

const HistoryView: React.FC<HistoryViewProps> = ({ data, themeConfig }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span>📅</span>
          <span>الأشهر السابقة</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.history.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-400">
              <p className="text-4xl mb-4">📭</p>
              <p>لا يوجد تاريخ مسجل حتى الآن. قم بترحيل المصروفات من القائمة الرئيسية.</p>
            </div>
          ) : (
            data.history.map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg text-gray-800">{item.monthName}</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">تم الترحيل</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">المرتب:</span>
                    <span className="font-bold">{item.salary} جم</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">إجمالي المصروفات:</span>
                    <span className="font-bold text-red-500">{item.totalExpenses} جم</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-gray-600 font-bold">صافي المتبقي:</span>
                    <span className="font-bold text-green-600">{item.salary - item.totalExpenses} جم</span>
                  </div>
                </div>
                
                <details className="mt-4">
                  <summary className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">عرض تفاصيل المصروفات</summary>
                  <ul className="mt-2 space-y-1 text-xs text-gray-600 list-disc list-inside">
                    {item.expenses.map((e, i) => (
                      <li key={i}>{e.name}: {e.amount} جم</li>
                    ))}
                  </ul>
                </details>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
