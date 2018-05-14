import { State } from '../domain';
import { InningsAction } from '../actions/index';
import * as types from '../actions/types';
import * as innings from '../match/innings';

export const match = (state: State, action: InningsAction): State => {
    switch (action.type) {
    case types.START_INNINGS: {
        const updatedMatch = innings.startInnings(
            state.match,
            action.battingTeam,
            action.batter1Index,
            action.batter2Index,
        );

        return {
            ...state,
            match: updatedMatch,
            currentInnings: innings.currentInnings(updatedMatch),
            currentBatter: innings.currentBatter(updatedMatch),
        };
    }

    case types.NEW_BOWLER: {
        const updatedMatch = innings.newBowler(state.match, action.bowlerIndex);
        return {
            ...state,
            match: updatedMatch,
            currentBowler: innings.currentBowler(updatedMatch),
        };
    }

    case types.DOT_BALL: {
        const updatedMatch = innings.dotBall(state.match);
        return {
            ...state,
            match: updatedMatch,
            currentInnings: innings.currentInnings(updatedMatch),
            currentBatter: innings.currentBatter(updatedMatch),
        };
    }

    default:
        return state;
    }
};

