import { Innings, Batter, UnavailableReason, Event, EventType } from '../../domain';
import addEvent from './addEvent';

export default (
    innings: Innings,
    batter: Batter,
    reason: UnavailableReason,
): Innings => {
    const time = (new Date()).getTime();

    return addEvent(
        innings, {
            time,
            reason,
            type: EventType.BatterUnavailable,
            batsmanIndex: innings.batting.batters.indexOf(batter),
        } as Event,
        0,
        batter,
        b => ({ ...b, unavailableReason: reason }),
    );
};
