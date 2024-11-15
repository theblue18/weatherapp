import { writable } from 'svelte/store';

export const weatherData = writable<{ temperature: number; time: string , city: string} | null>(null);
export const loading = writable(false);
export const error = writable<string | null>(null);
