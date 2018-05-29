import * as domain from '../domain';

const total = (scores: (number | undefined)[]) =>
    scores.filter(score => typeof score !== 'undefined')
        .map(score => score as number)
        .reduce((tot, score) => tot + score, 0);

const totalRuns = (outcome: domain.Outcome) =>
    total([
        outcome.scores.byes,
        outcome.scores.legByes,
        outcome.scores.runs,
        outcome.scores.boundaries,
        outcome.scores.wides,
    ]);

const extraRuns = (deliveryOutcome: domain.DeliveryOutcome) => {
    switch (deliveryOutcome) {
    case domain.DeliveryOutcome.Wide:
    case domain.DeliveryOutcome.Noball:
        return 1;

    default:
        return 0;
    }
};

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
    wides: extras.wides +
        (typeof outcome.scores.wides === 'undefined' ? 0 : outcome.scores.wides) +
        (outcome.deliveryOutcome === domain.DeliveryOutcome.Wide ? 1 : 0),
    noBalls: extras.noBalls + (outcome.deliveryOutcome === domain.DeliveryOutcome.Noball ? 1 : 0),
});

export const runsFromBatter = (outcome: domain.Outcome) => totalRuns(outcome);

export const totalScore = (outcome: domain.Outcome) =>
    totalRuns(outcome) + extraRuns(outcome.deliveryOutcome);

export const boundariesScored = (outcome: domain.Outcome): [number, number] => {
    if (typeof outcome.scores.boundaries === 'undefined') { return [0, 0]; }

    return [
        outcome.scores.boundaries === 4 ? 1 : 0,
        outcome.scores.boundaries === 6 ? 1 : 0,
    ];
};

export const bowlerRuns = (outcome: domain.Outcome) =>
    total([outcome.scores.runs, outcome.scores.boundaries, outcome.scores.wides]) + extraRuns(outcome.deliveryOutcome);
