import type { Equipment } from "../types";
import { apiFetch } from "./client";

const endpoint = 'equipment';

export function fetchEquipment(): Promise<Equipment[]> {
  return apiFetch<Equipment[]>(`${endpoint}`);
}