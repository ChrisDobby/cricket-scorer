export enum Howout {
    Bowled,
    Lbw,
    Caught,
    RunOut,
    Stumped,
    Retired,
    HitWicket,
    TimedOut,
    HandledBall,
    ObstructingField,
    Absent,
}

export enum DeliveryOutcome {
    Valid,
    Noball,
    Wide,
}

export enum MatchType {
    LimitedOvers,
    Time,
}

export enum InningsStatus {
    InProgress,
    AllOut,
    OversComplete,
    Declared,
}

export interface Wicket {
    time: number;
    howOut: Howout;
    bowler?: string;
    fielder?: string;
}

export interface DeliveryScores {
    runs?: number;
    boundaries?: number;
    byes?: number;
    legByes?: number;
    wides?: number;
}

export interface DeliveryWicket {
    howOut: Howout;
    fielderIndex?: number;
    changedEnds: boolean;
}

export interface Outcome {
    deliveryOutcome: DeliveryOutcome;
    scores: DeliveryScores;
    wicket?: DeliveryWicket;
}

export interface Delivery {
    time: number;
    bowlerIndex: number;
    batsmanIndex: number;
    overNumber: number;
    outcome: Outcome;
}

export interface Over {
    deliveries: Delivery[];
    bowlingRuns: number;
    wickets: number;
}

export interface BattingInnings {
    runs: number;
    timeIn: number;
    ballsFaced: number;
    fours: number;
    sixes: number;
    wicket?: Wicket;
}

export interface Batter {
    playerIndex: number;
    name: string;
    innings?: BattingInnings;
}

export interface Bowler {
    playerIndex: number;
    name: string;
    completedOvers: number;
    totalOvers: string;
    maidenOvers: number;
    runs: number;
    wickets: number;
}

export interface Extras {
    byes: number;
    legByes: number;
    wides: number;
    noBalls: number;
    penaltyRuns: number;
}

export interface Batting {
    batters: Batter[];
    extras: Extras;
}

export interface FallOfWicket {
    wicket: number;
    batter: string;
    score: number;
    partnership: number;
}

export interface Innings {
    status: InningsStatus;
    battingTeam: Team;
    bowlingTeam: Team;
    score: number;
    wickets: number;
    completedOvers: number;
    totalOvers: string;
    deliveries: Delivery[];
    batting: Batting;
    bowlers: Bowler[];
    fallOfWickets: FallOfWicket[];
}

export interface Team {
    name: string;
    players: string[];
}

export interface MatchConfig {
    type: MatchType;
    oversPerSide?: number;
    inningsPerSide: number;
}

export interface Match {
    config: MatchConfig;
    homeTeam: Team;
    awayTeam: Team;
    date: string;
    complete: boolean;
    status: string;
    innings: Innings[];
}

export interface InProgressMatch {
    match?: Match;
    currentInnings?: Innings;
    currentBatter?: Batter;
    currentBowler?: Bowler;
    previousBowler?: Bowler;
    previousBowlerFromEnd?: Bowler;
    currentOver?: Over;
    currentOverComplete?: boolean;
    startInnings: (battingTeam: Team, batter1Index: number, batter2Index: number) => void;
    newBowler: (playerIndex: number) => void;
    newBatter: (playerIndex: number) => void;
    delivery: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores, wicket: DeliveryWicket | undefined) => void;
    undoPreviousDelivery: () => void;
    completeOver: () => void;
    flipBatters: () => void;
}

export const howOutDescription = (wicket?: Wicket): string => {
    const description = (wkt: Wicket): string => {
        switch (wkt.howOut) {
        case Howout.Bowled:
            return `bowled ${wkt.bowler}`;
        case Howout.Lbw:
            return `lbw ${wkt.bowler}`;
        case Howout.Caught:
            return wkt.bowler === wkt.fielder
                ? `ct & bowled ${wkt.bowler}`
                : `ct ${wkt.fielder} b ${wkt.bowler}`;
        case Howout.RunOut:
            return wkt.fielder
                ? `run out (${wkt.fielder})`
                : 'run out';
        case Howout.Stumped:
            return `st ${wkt.fielder} b ${wkt.bowler}`;
        case Howout.Retired:
            return 'retired';
        case Howout.TimedOut:
            return 'timed out';
        case Howout.ObstructingField:
            return 'obstructing the field';
        case Howout.HandledBall:
            return 'handled the ball';
        case Howout.HitWicket:
            return `hit wkt ${wkt.bowler}`;
        case Howout.Absent:
            return 'absent';
        }
    };

    return wicket
        ? description(wicket)
        : 'not out';
};

export const validDelivery = (delivery: Delivery) =>
    delivery.outcome.deliveryOutcome !== DeliveryOutcome.Noball &&
    delivery.outcome.deliveryOutcome !== DeliveryOutcome.Wide;

export const oversDescription = (completedOvers: number, currentOver: Delivery[]): string => {
    const validCurrentOver = currentOver.filter(validDelivery);
    const remainder = validCurrentOver.length > 0 ? `.${validCurrentOver.length}` : '';
    return `${completedOvers}${remainder}`;
};

const nonStrikerHowouts = [
    Howout.RunOut,
    Howout.Retired,
    Howout.TimedOut,
    Howout.HandledBall,
    Howout.ObstructingField,
];

export const howouts = (currentBatter: Batter) => (batter: Batter) =>
    Object.keys(Howout)
        .filter(key => !isNaN(Number(Howout[key])))
        .map(key => Howout[key])
        .filter(howout => batter === currentBatter ||
            nonStrikerHowouts.find(how => how === howout) !== undefined);

export const howoutRequiresFielder = (howout: Howout) =>
    howout === Howout.Caught || howout === Howout.Stumped || howout === Howout.RunOut;

export const howoutBattersCouldCross = (howout: Howout) =>
    howout === Howout.Caught || howout === Howout.RunOut;

export const howoutCouldScoreRuns = (howout: Howout) =>
    howout === Howout.Caught || howout === Howout.RunOut || howout === Howout.ObstructingField;

export const howoutCouldBeNoBall = (howout: Howout) =>
    howout === Howout.RunOut || howout === Howout.ObstructingField;

export const howoutCouldBeWide = (howout: Howout) =>
    howout === Howout.RunOut || howout === Howout.Stumped || howout === Howout.ObstructingField;
