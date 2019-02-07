import * as domain from '../domain';

const total = (scores: (number | undefined)[]) =>
    scores
        .filter(score => typeof score !== 'undefined')
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

const extraRuns = (deliveryOutcome: domain.DeliveryOutcome, config: domain.MatchConfig) => {
    switch (deliveryOutcome) {
        case domain.DeliveryOutcome.Wide:
            return config.runsForWide;
        case domain.DeliveryOutcome.Noball:
            return config.runsForNoBall;

        default:
            return 0;
    }
};

export const runsScored = (outcome: domain.Outcome) => {
    if (typeof outcome.scores.runs === 'undefined') {
        return typeof outcome.scores.boundaries === 'undefined' ? 0 : outcome.scores.boundaries;
    }

    return outcome.scores.runs;
};

const updatedExtras = (update: (a: number, b: number) => number) => (
    extras: domain.Extras,
    outcome: domain.Outcome,
    config: domain.MatchConfig,
) => ({
    ...extras,
    byes: update(extras.byes, typeof outcome.scores.byes === 'undefined' ? 0 : outcome.scores.byes),
    legByes: update(extras.legByes, typeof outcome.scores.legByes === 'undefined' ? 0 : outcome.scores.legByes),
    wides: update(
        extras.wides,
        (typeof outcome.scores.wides === 'undefined' ? 0 : outcome.scores.wides) +
            (outcome.deliveryOutcome === domain.DeliveryOutcome.Wide ? config.runsForWide : 0),
    ),
    noBalls: update(
        extras.noBalls,
        outcome.deliveryOutcome === domain.DeliveryOutcome.Noball ? config.runsForNoBall : 0,
    ),
});

export const addedExtras = updatedExtras((a: number, b: number) => a + b);

export const removedExtras = updatedExtras((a: number, b: number) => a - b);

export const runsFromBatter = (outcome: domain.Outcome) => totalRuns(outcome);

export const totalScore = (outcome: domain.Outcome, config: domain.MatchConfig) =>
    totalRuns(outcome) + extraRuns(outcome.deliveryOutcome, config);

export const boundariesScored = (outcome: domain.Outcome): [number, number] => {
    if (typeof outcome.scores.boundaries === 'undefined') {
        return [0, 0];
    }

    return [outcome.scores.boundaries === 4 ? 1 : 0, outcome.scores.boundaries === 6 ? 1 : 0];
};

export const bowlerRuns = (outcome: domain.Outcome, config: domain.MatchConfig) =>
    total([outcome.scores.runs, outcome.scores.boundaries, outcome.scores.wides]) +
    extraRuns(outcome.deliveryOutcome, config);

export const notificationDescription = (outcome: domain.Outcome) => {
    const pluralise = (value: number) => (value > 1 ? 's' : '');
    const prefix = outcome.deliveryOutcome === domain.DeliveryOutcome.Noball ? 'No ball - ' : '';

    if (typeof outcome.scores.runs !== 'undefined' && outcome.scores.runs > 0) {
        return `${prefix}${outcome.scores.runs} run${pluralise(outcome.scores.runs)}`;
    }

    if (typeof outcome.scores.boundaries !== 'undefined') {
        return `${prefix}Boundary ${outcome.scores.boundaries}`;
    }

    if (typeof outcome.scores.byes !== 'undefined') {
        return `${prefix}${outcome.scores.byes} bye${pluralise(outcome.scores.byes)}`;
    }

    if (typeof outcome.scores.legByes !== 'undefined') {
        return `${prefix}${outcome.scores.legByes} leg bye${pluralise(outcome.scores.legByes)}`;
    }

    if (typeof outcome.scores.wides !== 'undefined' || outcome.deliveryOutcome === domain.DeliveryOutcome.Wide) {
        return typeof outcome.scores.wides === 'undefined' || outcome.scores.wides === 0
            ? 'Wide'
            : `${outcome.scores.wides} wide${pluralise(outcome.scores.wides)}`;
    }

    return outcome.deliveryOutcome === domain.DeliveryOutcome.Noball ? 'No ball' : 'Dot ball';
};

export const wickets = (outcome: domain.Outcome) => (typeof outcome.wicket === 'undefined' ? 0 : 1);

export const bowlingWickets = (outcome: domain.Outcome) => {
    if (typeof outcome.wicket === 'undefined') {
        return 0;
    }

    return outcome.wicket.howOut === domain.Howout.RunOut || outcome.wicket.howOut === domain.Howout.ObstructingField
        ? 0
        : 1;
};

export const battingWicket = (
    outcome: domain.Outcome,
    time: number,
    bowlerIndex: number | undefined,
    bowlingTeam: string[],
) =>
    typeof outcome.wicket === 'undefined'
        ? undefined
        : {
              time,
              bowlerIndex,
              howOut: outcome.wicket.howOut,
              fielderIndex: outcome.wicket.fielderIndex,
          };
