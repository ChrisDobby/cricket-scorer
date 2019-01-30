import { Innings, Batter, Event, EventType } from '../../domain';
import addEvent from './addEvent';

export default (innings: Innings, time: number, batter: Batter): Innings =>
    addEvent(
        innings,
        {
            time,
            type: EventType.BatterAvailable,
            batsmanIndex: innings.batting.batters.indexOf(batter),
        } as Event,
        0,
        batter,
        b => ({ ...b, unavailableReason: undefined }),
    );
