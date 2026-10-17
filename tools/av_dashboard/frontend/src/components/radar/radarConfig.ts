import React from 'react';
import { User, Car, Truck, AlertTriangle } from 'lucide-react';

export const CLASS_CONFIG: Record<
  string,
  { color: string; label: string; icon: React.FC<{ className?: string }> }
> = {
  PEDESTRIAN: { color: '#f59e0b', label: 'PEDESTRIAN', icon: User },
  CAR: { color: '#38bdf8', label: 'VEHICLE', icon: Car },
  TRUCK: { color: '#60a5fa', label: 'TRUCK', icon: Truck },
  BUS: { color: '#818cf8', label: 'BUS', icon: Truck },
  MOTORCYCLE: { color: '#34d399', label: 'MOTO', icon: AlertTriangle },
  BICYCLE: { color: '#34d399', label: 'BIKE', icon: AlertTriangle },
  CONE: { color: '#f97316', label: 'CONE', icon: AlertTriangle },
  BOX: { color: '#fb923c', label: 'OBSTACLE', icon: AlertTriangle },
  CLUSTER: { color: '#06b6d4', label: 'LIDAR CLUSTER', icon: AlertTriangle },
  UNKNOWN: { color: '#06b6d4', label: 'OBJECT', icon: AlertTriangle },
};

export interface ProcessedRadarObject {
  id?: string | number;
  x: number;
  y: number;
  z: number;
  dx?: number;
  dy?: number;
  dz?: number;
  yaw?: number;
  speed_kmh?: number;
  label?: string;
  source?: string;
  confidence?: number;
  lat: number;
  lon: number;
  dist: number;
  bearingDeg: number;
  resolvedLabel: string;
}
