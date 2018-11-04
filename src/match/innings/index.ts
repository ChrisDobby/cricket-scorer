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
import rebuild from './rebuild';

export default (config: MatchConfig, getTeam: (type: TeamType) => Team) => {
    const Delivery = delivery(config, getTeam);

    return {
        completeOver,
        flipBatters,
        isComplete,
        nonDeliveryWicket,
        batterUnavailable,
        create: create(getTeam),
        newBowler: newBowler(getTeam),
        newBatter: newBatter(getTeam),
        delivery: Delivery,
        calculateStatus: calculateStatus(getTeam),
        rebuild: rebuild(Delivery, nonDeliveryWicket, batterUnavailable),
    };
};
