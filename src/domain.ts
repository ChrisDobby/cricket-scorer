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
    bowler: string;
    batsman: string;
    outcome: Outcome;
}

export interface BattingInnings {
    runs: number;
    timeIn: Date;
    deliveries: Delivery[];
    ballsFaced: number;
    fours: number;
    sixes: number;
    wicket?: Wicket;
}

export interface Batter {
    position: number;
    name: string;
    innings?: BattingInnings;
}

export interface Over {
    overNumber: number;
    deliveries: Delivery[];
}

export interface Bowler {
    position: number;
    name: string;
    overs: Over[];
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
    battingTeam: string;
    bowlingTeam: string;
    score: number;
    wickets: number;
    allOut: boolean;
    balls: number;
    batting: Batting;
    bowlers: Bowler[];
    fallOfWickets: FallOfWicket[];
    complete: boolean;
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

export const oversDescription = (balls: number): string => {
    return (balls % 6) === 0
        ? (balls / 6).toString()
        : `${Math.floor(balls / 6)}.${balls % 6}`;
};
