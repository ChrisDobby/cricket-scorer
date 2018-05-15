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

export interface DotBall {
    type: types.DOT_BALL;
}

export interface CompleteOver {
    type: types.COMPLETE_OVER;
}

export type InningsAction = StartInnings | NewBowler | DotBall | CompleteOver;

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

export const dotBall = () => ({ type: types.DOT_BALL });

export const completeOver = () => ({ type: types.COMPLETE_OVER });
