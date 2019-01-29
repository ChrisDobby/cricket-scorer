import { Innings, InningsStatus, MatchConfig, MatchType, TeamType, Team } from '../../domain';

export default (getTeam: (type: TeamType) => Team) => (matchConfig: MatchConfig, innings: Innings) => {
    if (innings.status !== InningsStatus.InProgress) {
        return innings.status;
    }
    if (
        matchConfig.type === MatchType.LimitedOvers &&
        typeof innings.maximumOvers !== 'undefined' &&
        innings.completedOvers >= innings.maximumOvers
    ) {
        return InningsStatus.OversComplete;
    }
    if (innings.wickets >= getTeam(innings.battingTeam).players.length - 1) {
        return InningsStatus.AllOut;
    }
    return InningsStatus.InProgress;
};
