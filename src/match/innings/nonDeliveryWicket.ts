import { Innings, Batter, Howout, Event, EventType, BattingInnings } from '../../domain';
import addEvent from './addEvent';
import getFallOfWicket from './getFallOfWicket';

export default (innings: Innings, time: number, batter: Batter, howout: Howout): [Innings, Event] => {
    const event = {
        time,
        out: howout,
        type: EventType.NonDeliveryWicket,
        batsmanIndex: innings.batting.batters.indexOf(batter),
    } as Event;

    const updatedInnings = addEvent(innings, event, 1, batter, b => ({
        ...b,
        innings: {
            ...(b.innings as BattingInnings),
            wicket: { time, howOut: howout },
        },
    }));

    return [
        {
            ...updatedInnings,
            fallOfWickets: [
                ...updatedInnings.fallOfWickets,
                getFallOfWicket(updatedInnings, innings.batting.batters.indexOf(batter)),
            ],
        },
        event,
    ];
};
