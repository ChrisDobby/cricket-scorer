import { Innings, Batter } from '../../domain';

export default (innings: Innings, batter: Batter) => {
    const [nextBatterIndex] = innings.batting.batters
        .map((batter, index) => ({ batter, index }))
        .filter(
            indexedBatter =>
                indexedBatter.batter.innings && !indexedBatter.batter.innings.wicket && indexedBatter.batter !== batter,
        )
        .map(indexedBatter => indexedBatter.index);

    return nextBatterIndex;
};
