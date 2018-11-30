import { Innings } from '../../domain';

export default (innings: Innings, overs: number) => ({ ...innings, maximumOvers: overs });
