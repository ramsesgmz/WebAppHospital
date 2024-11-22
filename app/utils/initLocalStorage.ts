import { areasData } from '../mocks/areasData';

export type Area = {
  id: number;
  nombre: string;
  color: string;
  tareas: Tarea[];
};

export type Tarea = {
  id: number;
  descripcion: string;
  prioridad: string;
  estado: string;
};

export const getAreas = (): Area[] => {
  const stored = localStorage.getItem('areas');
  if (stored) return JSON.parse(stored);
  return areasData;
};

export const setAreas = (areas: Area[]) => {
  localStorage.setItem('areas', JSON.stringify(areas));
};