export type FlowData = {
  vesselImport: number;
  vesselExport: number;
  truckUnloading: number;
  truckLoading: number;
  trainUnloading: number;
  trainLoading: number;
};

export type DailyForecast = FlowData & {
  day: number;
  startingCapacity: number;
  forecastedCapacity: number;
  totalInflow: number;
  totalOutflow: number;
  netChange: number;
  percentOfMax: number;
  status: 'green' | 'yellow' | 'red';
  underflow: boolean;
  constrainedOutflow: number;
};

export type Scenario = {
  id: string;
  name: string;
  maxCapacity: number;
  startingCapacity: number;
  flows: FlowData[];
};
