import * as types from './types';
import { Team } from '../domain';

export interface StartInnings {
    type: types.START_INNINGS;
    battingTeam: Team;
    batter1Index: number;
    batter2Index: number;
}

export type InningsAction = StartInnings;

export const startInnings = (battingTeam: Team, batter1Index: number, batter2Index: number) => ({
    battingTeam,
    batter1Index,
    batter2Index,
    type: types.START_INNINGS,
});
