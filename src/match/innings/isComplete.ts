import { Innings, InningsStatus } from '../../domain';

export default (innings: Innings) => innings.status !== InningsStatus.InProgress;
