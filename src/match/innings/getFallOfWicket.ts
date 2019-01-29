import { Innings } from '../../domain';

export default (innings: Innings, batter: string) => ({
    batter,
    score: innings.score,
    partnership:
        innings.fallOfWickets.length === 0
            ? innings.score
            : innings.score - innings.fallOfWickets[innings.fallOfWickets.length - 1].score,
    wicket: innings.wickets,
});
