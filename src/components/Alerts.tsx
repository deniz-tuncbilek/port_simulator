import React from 'react';
import { generateInsights } from '../lib/simulation';
import { DailyForecast } from '../types';
import { Lightbulb, AlertCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface AlertsProps {
  forecasts: DailyForecast[];
  maxCapacity: number;
}

export const Alerts: React.FC<AlertsProps> = ({ forecasts, maxCapacity }) => {
  const insights = generateInsights(forecasts, maxCapacity);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-bold text-slate-800">Insights & Alerts</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
        {insights.map((insight, idx) => {
          const isAlarm = insight.includes('exceeded') || insight.includes('constrained');
          const isWarning = insight.includes('Approaching') || insight.includes('trending upward');
          
          return (
            <div 
              key={idx} 
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border text-sm",
                isAlarm ? "bg-rose-50 border-rose-200 text-rose-800" :
                isWarning ? "bg-amber-50 border-amber-200 text-amber-800" :
                "bg-blue-50 border-blue-200 text-blue-800"
              )}
            >
              {isAlarm ? (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
              ) : isWarning ? (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              ) : (
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
              )}
              <span className="leading-tight font-medium">{insight}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
