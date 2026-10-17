import { apiFetch } from './client';
import type { User } from '../types';

const endpoint = 'users';

export function fetchUsers(): Promise<User[]> {
  return apiFetch<User[]>(`${endpoint}`);
}