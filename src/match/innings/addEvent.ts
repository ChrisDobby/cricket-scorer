import { Innings, Batter, Event } from '../../domain';

export default (
    innings: Innings,
    event: Event,
    wickets: number,
    batter: Batter,
    updateBatter: (b: Batter) => Batter,
): Innings => ({
    ...innings,
    events: [...innings.events, event],
    batting: {
        ...innings.batting,
        batters: [...innings.batting.batters.map(b => (b === batter ? updateBatter(b) : b))],
    },
    wickets: innings.wickets + wickets,
});
