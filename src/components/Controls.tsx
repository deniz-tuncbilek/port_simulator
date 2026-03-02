import React from 'react';
import { FlowData } from '../types';

interface ControlsProps {
  flows: FlowData[];
  selectedDay: number;
  inputMode: 'steady' | 'daily';
  setInputMode: (mode: 'steady' | 'daily') => void;
  updateFlow: (dayIndex: number, field: keyof FlowData, value: number) => void;
  updateAllFlows: (field: keyof FlowData, value: number) => void;
  maxCapacity: number;
  setMaxCapacity: (val: number) => void;
  startingCapacity: number;
  setStartingCapacity: (val: number) => void;
}

const SliderInput = ({ 
  label, 
  value, 
  onChange, 
  max = 10000 
}: { 
  label: string, 
  value: number, 
  onChange: (val: number) => void,
  max?: number
}) => (
  <div className="flex flex-col gap-1 mb-4">
    <div className="flex justify-between items-center">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 text-right text-sm font-mono border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div className="flex items-center gap-2 mt-1">
      <button onClick={() => onChange(Math.max(0, value - 100))} className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold">-</button>
      <input 
        type="range" 
        min="0" 
        max={max} 
        step="100" 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <button onClick={() => onChange(value + 100)} className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold">+</button>
    </div>
  </div>
);

export const Controls: React.FC<ControlsProps> = ({
  flows,
  selectedDay,
  inputMode,
  setInputMode,
  updateFlow,
  updateAllFlows,
  maxCapacity,
  setMaxCapacity,
  startingCapacity,
  setStartingCapacity
}) => {
  const currentFlow = flows[selectedDay];

  const handleFlowChange = (field: keyof FlowData, value: number) => {
    if (inputMode === 'steady') {
      updateAllFlows(field, value);
    } else {
      updateFlow(selectedDay, field, value);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">Controls</h2>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${inputMode === 'steady' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setInputMode('steady')}
          >
            Steady State
          </button>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${inputMode === 'daily' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setInputMode('daily')}
          >
            Daily Schedule
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin">
        {/* Yard Parameters */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Yard Parameters</h3>
          <SliderInput label="Max Capacity" value={maxCapacity} onChange={setMaxCapacity} max={200000} />
          <SliderInput label="Starting Capacity (Day 1)" value={startingCapacity} onChange={setStartingCapacity} max={maxCapacity} />
        </div>

        {/* Vessel Flows */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Ocean Flows</h3>
          <SliderInput label="Vessel Import" value={currentFlow.vesselImport} onChange={(v) => handleFlowChange('vesselImport', v)} />
          <SliderInput label="Vessel Export" value={currentFlow.vesselExport} onChange={(v) => handleFlowChange('vesselExport', v)} />
        </div>

        {/* Truck Flows */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Truck / Transload Flows</h3>
          <SliderInput label="Truck Unloading (In)" value={currentFlow.truckUnloading} onChange={(v) => handleFlowChange('truckUnloading', v)} />
          <SliderInput label="Truck Loading (Out)" value={currentFlow.truckLoading} onChange={(v) => handleFlowChange('truckLoading', v)} />
        </div>

        {/* Train Flows */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Rail Flows</h3>
          <SliderInput label="Train Unloading (In)" value={currentFlow.trainUnloading} onChange={(v) => handleFlowChange('trainUnloading', v)} />
          <SliderInput label="Train Loading (Out)" value={currentFlow.trainLoading} onChange={(v) => handleFlowChange('trainLoading', v)} />
        </div>
      </div>
      
      {inputMode === 'daily' && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100 flex flex-col gap-2">
          <p>
            <strong>Daily Mode Active:</strong> You are editing values for <strong>Day {selectedDay + 1}</strong> only.
          </p>
          {selectedDay < 13 && (
            <button 
              onClick={() => {
                const currentFlowValues = flows[selectedDay];
                for (let i = selectedDay + 1; i < 14; i++) {
                  Object.keys(currentFlowValues).forEach(key => {
                    updateFlow(i, key as keyof FlowData, currentFlowValues[key as keyof FlowData]);
                  });
                }
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-sm transition-colors"
            >
              Fill Right (Apply to Days {selectedDay + 2}-14)
            </button>
          )}
        </div>
      )}
    </div>
  );
};
