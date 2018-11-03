import { Innings, Batter, Howout, Event, EventType } from '../../domain';
import addEvent from './addEvent';
import getFallOfWicket from './getFallOfWicket';

export default (
    innings: Innings,
    batter: Batter,
    howout: Howout,
): [Innings, Event] => {
    const time = (new Date()).getTime();
    const event = {
        time,
        out: howout,
        type: EventType.NonDeliveryWicket,
        batsmanIndex: innings.batting.batters.indexOf(batter),
    } as Event;

    const updatedInnings = addEvent(
        innings,
        event,
        1,
        batter,
        b => ({
            ...b,
            innings: typeof b.innings === 'undefined'
                ? b.innings
                : {
                    ...b.innings,
                    wicket: { time, howOut: howout },
                },
        }),
    );

    return [
        {
            ...updatedInnings,
            fallOfWickets: [
                ...updatedInnings.fallOfWickets,
                getFallOfWicket(updatedInnings, batter.name),
            ],
        },
        event,
    ];
};
