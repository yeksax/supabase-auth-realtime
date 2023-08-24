import type { Session } from '@supabase/supabase-js';

import { writable } from 'svelte/store';
import type { MessageType } from './types';

export const session = writable<Session>();
export const theme = writable<'DARK' | 'LIGHT'>();

export const messages = writable<MessageType[]>([]);
export const minifiedSidebar = writable(false);