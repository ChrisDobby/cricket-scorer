import { Innings, InningsStatus, MatchConfig, MatchType, TeamType, Team } from '../../domain';

export default (getTeam: (type: TeamType) => Team) => (matchConfig: MatchConfig, innings: Innings) => {
    if (innings.status !== InningsStatus.InProgress) { return innings.status; }
    if (matchConfig.type === MatchType.LimitedOvers &&
        typeof matchConfig.oversPerSide !== 'undefined' &&
        innings.completedOvers >= matchConfig.oversPerSide) {
        return InningsStatus.OversComplete;
    }
    if (innings.wickets >= getTeam(innings.battingTeam).players.length - 1) {
        return InningsStatus.AllOut;
    }
    return InningsStatus.InProgress;
};
