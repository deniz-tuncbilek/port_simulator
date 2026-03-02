import React from 'react';
import { DailyForecast } from '../types';
import { cn } from '../lib/utils';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimelineProps {
  forecasts: DailyForecast[];
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  reset: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  forecasts,
  selectedDay,
  setSelectedDay,
  isPlaying,
  togglePlay,
  reset
}) => {
  return (
    <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200">
        <button 
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-transform active:scale-95"
          title={isPlaying ? "Pause Simulation" : "Play Simulation"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button 
          onClick={reset}
          className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-transform active:scale-95"
          title="Reset to Day 1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex justify-between items-center gap-0.5 overflow-hidden">
        {forecasts.map((forecast, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDay(idx)}
            className={cn(
              "flex flex-col items-center gap-1 p-1 rounded-lg flex-1 min-w-0 transition-all border",
              selectedDay === idx ? "bg-blue-50 border-blue-500 shadow-sm" : "border-transparent hover:bg-slate-50"
            )}
          >
            <span className={cn(
              "text-[10px] font-bold leading-none",
              selectedDay === idx ? "text-blue-700" : "text-slate-500"
            )}>
              {idx + 1}
            </span>
            <div className={cn(
              "w-2 h-2 rounded-full shadow-sm",
              forecast.status === 'green' && "bg-emerald-500",
              forecast.status === 'yellow' && "bg-amber-500",
              forecast.status === 'red' && "bg-rose-500"
            )} />
          </button>
        ))}
      </div>
    </div>
  );
};
