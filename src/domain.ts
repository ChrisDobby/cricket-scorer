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
}

export enum DeliveryOutcome {
    Dot,
    Runs,
    Byes,
    LegByes,
    PenaltyRuns,
    Noball,
    Wide,
    Wicket,
}

export interface Wicket {
    time: Date;
    howOut: Howout;
    bowler?: string;
    fielder?: string;
}

export interface Outcome {
    deliveryOutcome: DeliveryOutcome;
    score: number;
}

export interface Delivery {
    time: Date;
    bowlerIndex: number;
    batsmanIndex: number;
    overNumber: number;
    outcome: Outcome;
}

export interface BattingInnings {
    runs: number;
    timeIn: Date;
    ballsFaced: number;
    fours: number;
    sixes: number;
    wicket?: Wicket;
}

export interface Batter {
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
    battingTeam: Team;
    bowlingTeam: Team;
    score: number;
    wickets: number;
    allOut: boolean;
    completedOvers: number;
    totalOvers: string;
    deliveries: Delivery[];
    batting: Batting;
    bowlers: Bowler[];
    fallOfWickets: FallOfWicket[];
    complete: boolean;
}

export interface Team {
    name: string;
    players: string[];
}

export interface Match {
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
    currentOver?: Delivery[];
    currentOverComplete?: boolean;
    startInnings: (battingTeam: Team, batter1Index: number, batter2Index: number) => void;
    newBowler: (playerIndex: number) => void;
    dotBall: () => void;
    completeOver: () => void;
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
