import { DailyForecast, FlowData } from '../types';

export function calculateForecasts(
  flows: FlowData[],
  startingCapacity: number,
  maxCapacity: number
): DailyForecast[] {
  const forecasts: DailyForecast[] = [];
  let currentCapacity = startingCapacity;

  for (let i = 0; i < flows.length; i++) {
    const flow = flows[i];
    const totalInflow = flow.vesselImport + flow.truckUnloading + flow.trainUnloading;
    const totalOutflow = flow.vesselExport + flow.truckLoading + flow.trainLoading;
    const netChange = totalInflow - totalOutflow;

    let forecastedCapacity = currentCapacity + netChange;
    let underflow = false;
    let constrainedOutflow = 0;

    if (forecastedCapacity < 0) {
      underflow = true;
      constrainedOutflow = Math.abs(forecastedCapacity);
      forecastedCapacity = 0;
    }

    const percentOfMax = maxCapacity > 0 ? (forecastedCapacity / maxCapacity) * 100 : 0;
    
    let status: 'green' | 'yellow' | 'red' = 'green';
    if (forecastedCapacity > maxCapacity) {
      status = 'red';
    } else if (percentOfMax >= 90) {
      status = 'yellow';
    }

    forecasts.push({
      ...flow,
      day: i + 1,
      startingCapacity: currentCapacity,
      forecastedCapacity,
      totalInflow,
      totalOutflow,
      netChange,
      percentOfMax,
      status,
      underflow,
      constrainedOutflow,
    });

    currentCapacity = forecastedCapacity;
  }

  return forecasts;
}

export function generateInsights(forecasts: DailyForecast[], maxCapacity: number): string[] {
  const insights: string[] = [];
  
  if (maxCapacity <= 0) {
    return ["Max capacity must be greater than 0. Please update the Yard Parameters."];
  }

  const redDays = forecasts.filter(f => f.status === 'red');
  if (redDays.length > 0) {
    const firstRed = redDays[0];
    const excess = firstRed.forecastedCapacity - maxCapacity;
    insights.push(`Capacity exceeded on Day ${firstRed.day} by ${excess.toLocaleString()} TEUs.`);
  }

  let yellowStart = -1;
  let yellowEnd = -1;
  for (let i = 0; i < forecasts.length; i++) {
    if (forecasts[i].status === 'yellow') {
      if (yellowStart === -1) yellowStart = forecasts[i].day;
      yellowEnd = forecasts[i].day;
    } else if (yellowStart !== -1 && forecasts[i].status !== 'red') {
      if (yellowStart !== yellowEnd) {
        insights.push(`Approaching capacity between Day ${yellowStart} and ${yellowEnd}.`);
      } else {
        insights.push(`Approaching capacity on Day ${yellowStart}.`);
      }
      yellowStart = -1;
    }
  }
  // If it ends on yellow
  if (yellowStart !== -1 && yellowStart !== yellowEnd) {
    insights.push(`Approaching capacity between Day ${yellowStart} and ${yellowEnd}.`);
  }

  const underflowDays = forecasts.filter(f => f.underflow);
  if (underflowDays.length > 0) {
    insights.push(`Outflows exceed available inventory on Day ${underflowDays[0].day}; constrained by ${underflowDays[0].constrainedOutflow.toLocaleString()} TEUs.`);
  }

  const netPositiveDays = forecasts.filter(f => f.netChange > 0).length;
  if (netPositiveDays >= 10) {
    insights.push(`Yard trending upward persistently (${netPositiveDays}/14 days); consider increasing export/train loading.`);
  }

  if (insights.length === 0) {
    insights.push("Yard operations are balanced and within safe capacity limits.");
  }

  return insights;
}
