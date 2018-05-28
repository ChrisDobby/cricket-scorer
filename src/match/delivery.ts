import * as domain from '../domain';

const totalRuns = (outcome: domain.Outcome) =>
    [outcome.scores.byes, outcome.scores.legByes, outcome.scores.runs]
        .filter(score => typeof score !== 'undefined')
        .map(score => score as number)
        .reduce((total, score) => total + score, 0);

export const runsScored = (outcome: domain.Outcome) =>
    typeof outcome.scores.runs === 'undefined'
        ? 0
        : outcome.scores.runs;

export const updatedExtras = (extras: domain.Extras, outcome: domain.Outcome) => ({
    ...extras,
    byes: extras.byes + (typeof outcome.scores.byes === 'undefined' ? 0 : outcome.scores.byes),
    legByes: extras.legByes + (typeof outcome.scores.legByes === 'undefined' ? 0 : outcome.scores.legByes),
});

export const runsFromBatter = (outcome: domain.Outcome) => totalRuns(outcome);

export const totalScore = (outcome: domain.Outcome) => totalRuns(outcome);
