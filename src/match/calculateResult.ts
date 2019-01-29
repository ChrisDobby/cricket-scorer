import { Match, MatchResult, Result, TeamType, WinBy, MatchType, InningsStatus } from '../domain';

export default (match: Match): MatchResult | undefined => {
    if (match.innings.length <= 1) {
        return { result: Result.Abandoned };
    }
    if (match.config.inningsPerSide > 1) {
        return undefined;
    }

    const battingFirst = match.innings[0].battingTeam;
    const { battingFirstRuns, battingSecondRuns } = match.innings.reduce(
        (scoreObj, i) => ({
            battingFirstRuns: scoreObj.battingFirstRuns + (i.battingTeam === battingFirst ? i.score : 0),
            battingSecondRuns: scoreObj.battingSecondRuns + (i.battingTeam !== battingFirst ? i.score : 0),
        }),
        { battingFirstRuns: 0, battingSecondRuns: 0 },
    );

    if (battingFirstRuns === battingSecondRuns) {
        return { result: Result.Tie };
    }
    if (battingSecondRuns > battingFirstRuns) {
        return {
            result: battingFirst === TeamType.HomeTeam ? Result.AwayWin : Result.HomeWin,
            winBy: WinBy.Wickets,
            winMargin: `${10 - match.innings[match.innings.length - 1].wickets}`,
        };
    }

    if (
        match.config.type === MatchType.Time &&
        match.innings[match.innings.length - 1].status !== InningsStatus.AllOut
    ) {
        return { result: Result.Draw };
    }

    return {
        result: battingFirst === TeamType.HomeTeam ? Result.HomeWin : Result.AwayWin,
        winBy: WinBy.Runs,
        winMargin: `${battingFirstRuns - battingSecondRuns}`,
    };
};
