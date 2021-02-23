import { createAction } from '@ngrx/store';

export const isLoading = createAction('[UI Component] Loading');
export const stopLoading = createAction('[UI Component] Stop Loading');