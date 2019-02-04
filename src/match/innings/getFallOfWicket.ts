import { Innings } from '../../domain';

export default (innings: Innings, batterIndex: number) => ({
    batterIndex,
    score: innings.score,
    partnership:
        innings.fallOfWickets.length === 0
            ? innings.score
            : innings.score - innings.fallOfWickets[innings.fallOfWickets.length - 1].score,
    wicket: innings.wickets,
});
