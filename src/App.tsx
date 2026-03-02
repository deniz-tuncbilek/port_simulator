import React, { useState, useEffect, useMemo } from 'react';
import { FlowData, Scenario } from './types';
import { scenarios } from './data/scenarios';
import { calculateForecasts } from './lib/simulation';
import { Header } from './components/Header';
import { FlowMap } from './components/FlowMap';
import { Controls } from './components/Controls';
import { Timeline } from './components/Timeline';
import { ForecastChart } from './components/ForecastChart';
import { DailyTable } from './components/DailyTable';
import { Alerts } from './components/Alerts';
import { Settings2 } from 'lucide-react';

export default function App() {
  const [selectedScenario, setSelectedScenario] = useState<string>('baseline');
  const [maxCapacity, setMaxCapacity] = useState<number>(100000);
  const [startingCapacity, setStartingCapacity] = useState<number>(60000);
  const [flows, setFlows] = useState<FlowData[]>(scenarios[0].flows);
  
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'steady' | 'daily'>('steady');

  // Load scenario
  useEffect(() => {
    const scenario = scenarios.find(s => s.id === selectedScenario);
    if (scenario) {
      setMaxCapacity(scenario.maxCapacity);
      setStartingCapacity(scenario.startingCapacity);
      setFlows(JSON.parse(JSON.stringify(scenario.flows))); // Deep copy
      setSelectedDay(0);
      setIsPlaying(false);
    }
  }, [selectedScenario]);

  // Simulation playback
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setSelectedDay(prev => {
          if (prev >= 13) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const forecasts = useMemo(() => {
    return calculateForecasts(flows, startingCapacity, maxCapacity);
  }, [flows, startingCapacity, maxCapacity]);

  const updateFlow = (dayIndex: number, field: keyof FlowData, value: number) => {
    setFlows(prev => {
      const newFlows = [...prev];
      newFlows[dayIndex] = { ...newFlows[dayIndex], [field]: value };
      return newFlows;
    });
  };

  const updateAllFlows = (field: keyof FlowData, value: number) => {
    setFlows(prev => prev.map(f => ({ ...f, [field]: value })));
  };

  const currentForecast = forecasts[selectedDay];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (3/4) */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            <Header 
              forecast={currentForecast} 
              maxCapacity={maxCapacity} 
              selectedScenario={selectedScenario}
              setSelectedScenario={setSelectedScenario}
              scenarios={scenarios}
            />
            <FlowMap forecast={currentForecast} maxCapacity={maxCapacity} />
            <div className="h-[500px]">
              <DailyTable 
                forecasts={forecasts}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
              />
            </div>
          </div>

          {/* Right Column (1/4) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex-1 min-h-[150px]">
              <Alerts forecasts={forecasts} maxCapacity={maxCapacity} />
            </div>
            <div className="shrink-0">
              <Timeline 
                forecasts={forecasts} 
                selectedDay={selectedDay} 
                setSelectedDay={setSelectedDay}
                isPlaying={isPlaying}
                togglePlay={() => setIsPlaying(!isPlaying)}
                reset={() => { setIsPlaying(false); setSelectedDay(0); }}
              />
            </div>
            <div className="h-[350px] shrink-0">
              <Controls 
                flows={flows}
                selectedDay={selectedDay}
                inputMode={inputMode}
                setInputMode={setInputMode}
                updateFlow={updateFlow}
                updateAllFlows={updateAllFlows}
                maxCapacity={maxCapacity}
                setMaxCapacity={setMaxCapacity}
                startingCapacity={startingCapacity}
                setStartingCapacity={setStartingCapacity}
              />
            </div>
            <div className="shrink-0">
              <ForecastChart forecasts={forecasts} maxCapacity={maxCapacity} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
