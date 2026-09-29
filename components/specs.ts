import { formatGhz } from '@/lib/catalog';
import type { CPU, GPU } from '@/lib/db/types';
import type { Dictionary } from '@/lib/dictionaries';
import type { SpecRow } from './SpecTable';

export function cpuRows(cpu: CPU, t: Dictionary): SpecRow[] {
  const na = t.common.notAvailable;
  return [
    { label: t.cpu.cores, value: cpu.cores },
    { label: t.cpu.threads, value: cpu.threads },
    { label: t.cpu.baseClock, value: cpu.baseClockGhz === null ? null : formatGhz(cpu.baseClockGhz, na) },
    { label: t.cpu.boostClock, value: cpu.boostClockGhz === null ? null : formatGhz(cpu.boostClockGhz, na) },
    { label: t.cpu.tdp, value: cpu.tdpW === null ? null : `${cpu.tdpW} W` },
    { label: t.cpu.socket, value: cpu.socket },
  ];
}

export function gpuRows(gpu: GPU, t: Dictionary): SpecRow[] {
  const na = t.common.notAvailable;
  const rows: SpecRow[] = [
    { label: t.gpu.memory, value: gpu.memoryGb === null ? null : `${gpu.memoryGb} GB` },
    { label: t.gpu.memoryType, value: gpu.memoryType },
    { label: t.gpu.baseClock, value: gpu.baseClockGhz === null ? null : formatGhz(gpu.baseClockGhz, na) },
    { label: t.gpu.boostClock, value: gpu.boostClockGhz === null ? null : formatGhz(gpu.boostClockGhz, na) },
    { label: t.gpu.tdp, value: gpu.tdpW === null ? null : `${gpu.tdpW} W` },
  ];
  if (gpu.cudaCores !== null) rows.push({ label: t.gpu.cudaCores, value: gpu.cudaCores });
  if (gpu.streamProcessors !== null) rows.push({ label: t.gpu.streamProcessors, value: gpu.streamProcessors });
  return rows;
}
