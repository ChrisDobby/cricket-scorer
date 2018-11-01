export enum Howout {
    Bowled,
    Lbw,
    Caught,
    RunOut,
    Stumped,
    HitWicket,
    TimedOut,
    HandledBall,
    ObstructingField,
}

export enum UnavailableReason {
    Retired,
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
    MatchComplete,
}

export enum TeamType {
    HomeTeam,
    AwayTeam,
}

export enum Result {
    HomeWin,
    AwayWin,
    Tie,
    Draw,
    Abandoned,
}

export enum WinBy {
    Runs,
    Wickets,
}

export enum EventType {
    Delivery,
    NonDeliveryWicket,
    BatterUnavailable,
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

export interface Event {
    time: number;
    type: EventType;
}

export interface Delivery extends Event {
    bowlerIndex: number;
    batsmanIndex: number;
    overNumber: number;
    outcome: Outcome;
}

export interface NonDeliveryWicket extends Event {
    batsmanIndex: number;
    out: Howout;
}

export interface BatterUnavailable extends Event {
    batsmanIndex: number;
    reason: UnavailableReason;
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
    unavailableReason?: UnavailableReason;
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
    battingTeam: TeamType;
    bowlingTeam: TeamType;
    score: number;
    wickets: number;
    completedOvers: number;
    totalOvers: string;
    events: Event[];
    batting: Batting;
    bowlers: Bowler[];
    fallOfWickets: FallOfWicket[];
}

export interface Team {
    name: string;
    players: string[];
}

export interface MatchConfig {
    playersPerSide: number;
    type: MatchType;
    oversPerSide?: number;
    inningsPerSide: number;
    runsForNoBall: number;
    runsForWide: number;
}

export interface Toss {
    tossWonBy: TeamType;
    battingFirst: TeamType;
}

export interface MatchResult {
    result: Result;
    winBy?: WinBy;
    winMargin?: string;
}

export interface Match {
    id?: string;
    user: string;
    config: MatchConfig;
    homeTeam: Team;
    awayTeam: Team;
    date: string;
    complete: boolean;
    status: string;
    toss?: Toss;
    result?: MatchResult;
    innings: Innings[];
}

export interface StoredMatch {
    match: Match;
    currentBatterIndex?: number;
    currentBowlerIndex?: number;
    version: number;
}

export interface InProgressMatch {
    match: Match;
    currentInnings?: Innings;
    currentBatter?: Batter;
    currentBowler?: Bowler;
    previousBowler?: Bowler;
    previousBowlerFromEnd?: Bowler;
    currentOver?: Over;
    currentOverComplete?: boolean;
    provisionalInningsStatus?: InningsStatus;
    provisionalMatchComplete: boolean;
    nextBattingTeam?: Team;
    canSelectBattingTeamForInnings: boolean;
    newBatterRequired: boolean;
    version: number;
    startInnings: (battingTeam: TeamType, batter1Index: number, batter2Index: number) => void;
    newBowler: (playerIndex: number) => void;
    newBatter: (playerIndex: number) => void;
    delivery: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores, wicket: DeliveryWicket | undefined) => void;
    undoPreviousDelivery: () => void;
    completeOver: () => void;
    flipBatters: () => void;
    completeInnings: (status: InningsStatus) => void;
    completeMatch: (result: MatchResult) => void;
    nonDeliveryWicket: (howout: Howout) => void;
    batterUnavailable: (reason: UnavailableReason) => void;
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

export const unavailablDescription = (reason: UnavailableReason): string => {
    switch (reason) {
    case UnavailableReason.Absent:
        return 'absent';
    case UnavailableReason.Retired:
        return 'retired';
    default:
        return '';
    }
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

export const deliveries = (events: Event[]) =>
    events
        .filter(event => event.type === EventType.Delivery)
        .map(event => event as Delivery);
