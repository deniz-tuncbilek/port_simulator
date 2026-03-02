import React from 'react';
import { DailyForecast } from '../types';
import { cn } from '../lib/utils';

interface DailyTableProps {
  forecasts: DailyForecast[];
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}

export const DailyTable: React.FC<DailyTableProps> = ({ forecasts, selectedDay, setSelectedDay }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-sm font-bold text-slate-800">Daily Breakdown</h3>
      </div>
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-xs text-left">
          <thead className="text-[11px] text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-2 py-3 font-semibold">Day</th>
              <th className="px-2 py-3 font-semibold text-right">Start</th>
              <th className="px-2 py-3 font-semibold text-right">V. Imp</th>
              <th className="px-2 py-3 font-semibold text-right">V. Exp</th>
              <th className="px-2 py-3 font-semibold text-right">Trk Unl</th>
              <th className="px-2 py-3 font-semibold text-right">Trk Ld</th>
              <th className="px-2 py-3 font-semibold text-right">Trn Unl</th>
              <th className="px-2 py-3 font-semibold text-right">Trn Ld</th>
              <th className="px-2 py-3 font-semibold text-right">Tot In</th>
              <th className="px-2 py-3 font-semibold text-right">Tot Out</th>
              <th className="px-2 py-3 font-semibold text-right">Net</th>
              <th className="px-2 py-3 font-semibold text-right">Forecast</th>
              <th className="px-2 py-3 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f, i) => (
              <tr 
                key={i} 
                onClick={() => setSelectedDay(i)}
                className={cn(
                  "border-b border-slate-100 cursor-pointer transition-colors",
                  selectedDay === i ? "bg-blue-50" : "hover:bg-slate-50",
                  f.status === 'red' && selectedDay !== i && "bg-rose-50/30 hover:bg-rose-50/50",
                  f.status === 'yellow' && selectedDay !== i && "bg-amber-50/30 hover:bg-amber-50/50"
                )}
              >
                <td className="px-2 py-2.5 font-bold text-slate-700 whitespace-nowrap">D{f.day}</td>
                <td className="px-2 py-2.5 text-right font-mono text-slate-600">{Math.round(f.startingCapacity).toLocaleString()}</td>
                <td className="px-2 py-2.5 text-right font-mono text-slate-500">+{Math.round(f.vesselImport).toLocaleString()}</td>
                <td className="px-2 py-2.5 text-right font-mono text-slate-500">-{Math.round(f.vesselExport).toLocaleString()}</td>
                <td className="px-2 py-2.5 text-right font-mono text-slate-500">+{Math.round(f.truckUnloading).toLocaleString()}</td>
                <td className="px-2 py-2.5 text-right font-mono text-slate-500">-{Math.round(f.truckLoading).toLocaleString()}</td>
                <td className="px-2 py-2.5 text-right font-mono text-slate-500">+{Math.round(f.trainUnloading).toLocaleString()}</td>
                <td className="px-2 py-2.5 text-right font-mono text-slate-500">-{Math.round(f.trainLoading).toLocaleString()}</td>
                <td className="px-2 py-2.5 text-right font-mono text-slate-700 font-bold">+{Math.round(f.totalInflow).toLocaleString()}</td>
                <td className="px-2 py-2.5 text-right font-mono text-slate-700 font-bold">-{Math.round(f.totalOutflow).toLocaleString()}</td>
                <td className="px-2 py-2.5 text-right font-mono font-bold text-slate-900">
                  {f.netChange > 0 ? '+' : ''}{Math.round(f.netChange).toLocaleString()}
                </td>
                <td className="px-2 py-2.5 text-right font-mono font-bold text-slate-900">{Math.round(f.forecastedCapacity).toLocaleString()}</td>
                <td className="px-2 py-2.5 text-center">
                  <span className={cn(
                    "inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    f.status === 'green' && "bg-emerald-100 text-emerald-700",
                    f.status === 'yellow' && "bg-amber-100 text-amber-700",
                    f.status === 'red' && "bg-rose-100 text-rose-700"
                  )}>
                    {f.status === 'green' ? 'Clear' : f.status === 'yellow' ? 'Warn' : 'Alarm'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
