import { Match, InningsStatus, MatchResult, Result, WinBy } from '../domain';

const complete = () => {
    const isComplete = (match: Match) =>
        match.complete ||
        match.config.inningsPerSide * 2 === match.innings.filter(i => i.status !== InningsStatus.InProgress).length;

    const status = (match: Match, matchResult: MatchResult): [MatchResult, string] => {
        const winByText = () => {
            if (typeof matchResult.winBy === 'undefined') {
                return '';
            }
            return matchResult.winBy === WinBy.Runs ? 'runs' : 'wickets';
        };

        const winText = (name: string) => `${name} won by ${matchResult.winMargin} ${winByText()}`;

        const statusText = () => {
            switch (matchResult.result) {
                case Result.Abandoned:
                    return 'Match abandoned';
                case Result.Draw:
                    return 'Match drawn';
                case Result.Tie:
                    return 'Match tied';
                case Result.HomeWin:
                    return winText(match.homeTeam.name);
                case Result.AwayWin:
                    return winText(match.awayTeam.name);
                default:
                    return '';
            }
        };

        return [matchResult, statusText()];
    };

    return {
        isComplete,
        status,
    };
};

export default complete();
