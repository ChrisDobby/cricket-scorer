import * as types from './types';

export interface StartInnings { type: types.START_INNINGS; }

export type InningsAction = StartInnings;

export const startInnings = () => ({
    type: types.START_INNINGS,
});
