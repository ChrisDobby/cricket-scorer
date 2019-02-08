import { Innings, InningsStatus } from '../../domain';

export default (innings: Innings, status: InningsStatus, time: number) => {
    return {
        ...innings,
        status,
        completeTime: time,
    };
};
