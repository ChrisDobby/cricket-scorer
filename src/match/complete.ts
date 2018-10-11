import { Match, InningsStatus } from '../domain';

export default (match: Match) =>
    match.complete ||
    match.config.inningsPerSide * 2 === match.innings.filter(i => i.status !== InningsStatus.InProgress).length;
