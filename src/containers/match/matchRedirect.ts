import { History } from 'history';
import { InProgressMatch } from '../../domain';

export default (inProgress: InProgressMatch | undefined, history: History, location: Location) => {
    const startMatchPath = '/match/start';
    const createMatchPath = '/match/create';
    const inProgressMatchPath = '/match/inprogress';
    const scorecardPath = '/scorecard';

    if (typeof inProgress === 'undefined') {
        if (!location.pathname.match(new RegExp(createMatchPath, 'i'))) {
            history.replace(createMatchPath);
        }
        return;
    }

    if (typeof inProgress.match.toss === 'undefined') {
        if (!location.pathname.match(new RegExp(startMatchPath, 'i'))) {
            history.replace(startMatchPath);
        }
        return;
    }

    if (!inProgress.match.complete) {
        if (!location.pathname.match(new RegExp(inProgressMatchPath, 'i'))) {
            history.replace(inProgressMatchPath);
        }
        return;
    }

    if (!location.pathname.match(new RegExp(scorecardPath, 'i'))) {
        history.replace(scorecardPath);
    }
};
