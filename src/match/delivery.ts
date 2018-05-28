import * as domain from '../domain';

const totalRuns = (outcome: domain.Outcome) =>
    [outcome.scores.byes, outcome.scores.legByes, outcome.scores.runs, outcome.scores.boundaries]
        .filter(score => typeof score !== 'undefined')
        .map(score => score as number)
        .reduce((total, score) => total + score, 0);

export const runsScored = (outcome: domain.Outcome) => {
    if (typeof outcome.scores.runs === 'undefined') {
        return typeof outcome.scores.boundaries === 'undefined'
            ? 0
            : outcome.scores.boundaries;
    }

    return outcome.scores.runs;
};

export const updatedExtras = (extras: domain.Extras, outcome: domain.Outcome) => ({
    ...extras,
    byes: extras.byes + (typeof outcome.scores.byes === 'undefined' ? 0 : outcome.scores.byes),
    legByes: extras.legByes + (typeof outcome.scores.legByes === 'undefined' ? 0 : outcome.scores.legByes),
});

export const runsFromBatter = (outcome: domain.Outcome) => totalRuns(outcome);

export const totalScore = (outcome: domain.Outcome) => totalRuns(outcome);

export const boundariesScored = (outcome: domain.Outcome): [number, number] => {
    if (typeof outcome.scores.boundaries === 'undefined') { return [0, 0]; }

    return [
        outcome.scores.boundaries === 4 ? 1 : 0,
        outcome.scores.boundaries === 6 ? 1 : 0,
    ];
};
