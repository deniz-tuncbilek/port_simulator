import { FlowData, Scenario } from '../types';

const createSteadyFlows = (flow: FlowData): FlowData[] => {
  return Array.from({ length: 14 }, () => ({ ...flow }));
};

export const scenarios: Scenario[] = [
  {
    id: 'baseline',
    name: 'Baseline (Balanced)',
    maxCapacity: 100000,
    startingCapacity: 60000,
    flows: createSteadyFlows({
      vesselImport: 4000,
      vesselExport: 3500,
      truckUnloading: 2000,
      truckLoading: 2500,
      trainUnloading: 1500,
      trainLoading: 1500,
    }),
  },
  {
    id: 'import-surge',
    name: 'Import Surge (Vessel-Heavy)',
    maxCapacity: 100000,
    startingCapacity: 70000,
    flows: createSteadyFlows({
      vesselImport: 7000,
      vesselExport: 3000,
      truckUnloading: 2000,
      truckLoading: 2500,
      trainUnloading: 1500,
      trainLoading: 1500,
    }),
  },
  {
    id: 'rail-disruption',
    name: 'Rail Disruption (Train Loading Reduced)',
    maxCapacity: 100000,
    startingCapacity: 80000,
    flows: createSteadyFlows({
      vesselImport: 4000,
      vesselExport: 3500,
      truckUnloading: 2000,
      truckLoading: 2500,
      trainUnloading: 1500,
      trainLoading: 500, // Reduced from 1500
    }),
  },
  {
    id: 'transload-peak',
    name: 'Transload Peak',
    maxCapacity: 100000,
    startingCapacity: 65000,
    flows: createSteadyFlows({
      vesselImport: 4000,
      vesselExport: 3500,
      truckUnloading: 4000, // Increased
      truckLoading: 4500, // Increased
      trainUnloading: 1500,
      trainLoading: 1500,
    }),
  },
  {
    id: 'export-push',
    name: 'Export Push (Export-Heavy)',
    maxCapacity: 100000,
    startingCapacity: 95000,
    flows: createSteadyFlows({
      vesselImport: 3000,
      vesselExport: 6000, // Increased
      truckUnloading: 2000,
      truckLoading: 2500,
      trainUnloading: 1500,
      trainLoading: 1500,
    }),
  },
  {
    id: 'demo',
    name: 'Demo: 14-Day Sample',
    maxCapacity: 100000,
    startingCapacity: 80000,
    flows: [
      // Days 1-3: Normal, slight increase
      { vesselImport: 4500, vesselExport: 3000, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 1500 },
      { vesselImport: 4500, vesselExport: 3000, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 1500 },
      { vesselImport: 4500, vesselExport: 3000, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 1500 },
      // Days 4-7: Import surge, pushing into Yellow
      { vesselImport: 8000, vesselExport: 2500, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 1500 },
      { vesselImport: 8000, vesselExport: 2500, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 1500 },
      { vesselImport: 8000, vesselExport: 2500, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 1500 },
      { vesselImport: 8000, vesselExport: 2500, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 1500 },
      // Days 8-10: Rail disruption, pushing into Red
      { vesselImport: 6000, vesselExport: 3000, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 500 },
      { vesselImport: 6000, vesselExport: 3000, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 500 },
      { vesselImport: 6000, vesselExport: 3000, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 500 },
      // Days 11-14: Recovery, massive export push
      { vesselImport: 2000, vesselExport: 8000, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 2500 },
      { vesselImport: 2000, vesselExport: 8000, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 2500 },
      { vesselImport: 2000, vesselExport: 8000, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 2500 },
      { vesselImport: 2000, vesselExport: 8000, truckUnloading: 2000, truckLoading: 2500, trainUnloading: 1500, trainLoading: 2500 },
    ],
  },
];
