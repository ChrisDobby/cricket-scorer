import { Match, TeamType } from '../domain';
import { getTeam } from './utilities';

export default (match: Match) => {
    const battingTeamRunsToWin = () => {
        const innings = match.innings[match.innings.length - 1];
        const { battingTeamRuns, bowlingTeamRuns } = match.innings
        .reduce(
            (scoreObj, i) =>
                ({
                    battingTeamRuns: scoreObj.battingTeamRuns + (i.battingTeam === innings.battingTeam ? i.score : 0),
                    bowlingTeamRuns: scoreObj.bowlingTeamRuns + (i.battingTeam === innings.bowlingTeam ? i.score : 0),
                }),
            { battingTeamRuns: 0, bowlingTeamRuns: 0 });

        return `${getTeam(match, innings.battingTeam).name} need ${bowlingTeamRuns - battingTeamRuns + 1} to win`;
    };

    const leadingTeam = () => {
        const { homeTeamRuns, awayTeamRuns } = match.innings
            .reduce(
                (scoreObj, i) =>
                    ({
                        homeTeamRuns: scoreObj.homeTeamRuns + (i.battingTeam === TeamType.HomeTeam ? i.score : 0),
                        awayTeamRuns: scoreObj.awayTeamRuns + (i.battingTeam === TeamType.AwayTeam ? i.score : 0),
                    }),
                { homeTeamRuns: 0, awayTeamRuns: 0 });

        if (homeTeamRuns === awayTeamRuns) { return 'the scores are level'; }

        const leaders = homeTeamRuns > awayTeamRuns
            ? { name: getTeam(match, TeamType.HomeTeam).name, by: homeTeamRuns - awayTeamRuns }
            : { name: getTeam(match, TeamType.AwayTeam).name, by: awayTeamRuns - homeTeamRuns };

        return `${leaders.name} lead by ${leaders.by}`;
    };

    const startDescription = () => (
        typeof match.toss === 'undefined'
            ? 'Not started'
            : `Toss won by ${getTeam(match, match.toss.tossWonBy).name}, ` +
            `${getTeam(match, match.toss.battingFirst).name} to bat first`);

    const currentInningsScore = () => {
        const innings = match.innings[match.innings.length - 1];
        return `${getTeam(match, innings.battingTeam).name} ${innings.score}-${innings.wickets}`;
    };

    if (match.complete) { return match.status; }
    if (match.innings.length === 0) { return startDescription(); }
    const score = currentInningsScore();
    if (match.innings.length === 1) { return score; }
    if (match.config.inningsPerSide === 1) {
        return  `${score}, ${battingTeamRunsToWin()}`;
    }

    return `${score}, ${leadingTeam()}`;
};
