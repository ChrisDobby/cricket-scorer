import * as types from './types';
import { Team } from '../domain';

export interface StartInnings {
    type: types.START_INNINGS;
    battingTeam: Team;
    batter1Index: number;
    batter2Index: number;
}

export interface NewBowler {
    type: types.NEW_BOWLER;
    bowlerIndex: number;
}

export type InningsAction = StartInnings | NewBowler;

export const startInnings = (battingTeam: Team, batter1Index: number, batter2Index: number) => ({
    battingTeam,
    batter1Index,
    batter2Index,
    type: types.START_INNINGS,
});

export const newBowler = (bowlerIndex: number) => ({
    bowlerIndex,
    type: types.NEW_BOWLER,
});
