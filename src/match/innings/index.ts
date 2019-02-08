import { MatchConfig, TeamType, Team } from '../../domain';
import create from './create';
import newBowler from './newBowler';
import newBatter from './newBatter';
import delivery from './delivery';
import completeOver from './completeOver';
import flipBatters from './flipBatters';
import isComplete from './isComplete';
import calculateStatus from './calculateStatus';
import nonDeliveryWicket from './nonDeliveryWicket';
import batterUnavailable from './batterUnavailable';
import batterAvailable from './batterAvailable';
import rebuild from './rebuild';
import rollback from './rollback';
import editOvers from './editOvers';
import changeBowler from './changeBowler';
import complete from './complete';

export default (config: MatchConfig, getTeam: (type: TeamType) => Team) => {
    const Delivery = delivery(config, getTeam);
    const rebuildInnings = rebuild(Delivery, nonDeliveryWicket, batterUnavailable, batterAvailable, completeOver);

    return {
        completeOver,
        flipBatters,
        isComplete,
        nonDeliveryWicket,
        batterUnavailable,
        batterAvailable,
        editOvers,
        complete,
        create: create(getTeam),
        newBowler: newBowler(getTeam),
        newBatter: newBatter(getTeam),
        delivery: Delivery,
        calculateStatus: calculateStatus(getTeam),
        rebuild: rebuildInnings,
        rollback: rollback(rebuildInnings),
        changeBowler: changeBowler(rebuildInnings),
    };
};
