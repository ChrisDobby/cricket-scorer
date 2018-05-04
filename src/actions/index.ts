import * as types from './types';
import { Team } from '../domain';

export interface StartInnings {
    type: types.START_INNINGS;
    battingTeam: Team;
    batter1Index: number;
    batter2Index: number;
}

export type InningsAction = StartInnings;
