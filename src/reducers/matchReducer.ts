import { State } from '../domain';
import { InningsAction } from '../actions/index';
import * as types from '../actions/types';
import * as innings from '../match/innings';

export const match = (state: State, action: InningsAction): State => {
    switch (action.type) {
    case types.START_INNINGS:
        return {
            ...state,
            match: innings.startInnings(
                state.match,
                action.battingTeam,
                action.batter1Index,
                action.batter2Index,
            ),
        };
    }
};

