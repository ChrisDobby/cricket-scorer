export interface Profile {
    id: string;
    name: string;
    picture?: string;
}

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

export enum BreakType {
    BadLight,
    CloseOfPlay,
    Innings,
    Lunch,
    Rain,
    Tea,
}

export enum EventType {
    Delivery,
    NonDeliveryWicket,
    BatterUnavailable,
    BatterAvailable,
    OverComplete,
}

export interface Wicket {
    time: number;
    howOut: Howout;
    bowlerIndex?: number;
    fielderIndex?: number;
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

export interface OverComplete extends Event {
    bowlerIndex: number;
    batsmanIndex: number;
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
    innings?: BattingInnings;
    unavailableReason?: UnavailableReason;
}

export interface Bowler {
    playerIndex: number;
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
    batterIndex: number;
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
    maximumOvers?: number;
    completeTime?: number;
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

export interface MatchBreak {
    type: BreakType;
    startTime: number;
    endTime?: number;
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
    breaks: MatchBreak[];
}

export interface StoredMatch {
    match: Match;
    currentBatterIndex?: number;
    currentBowlerIndex?: number;
    version: number;
    lastEvent?: string;
}

interface MatchBeingScored {
    date: string;
    status: string;
    user: string;
    homeTeam: string;
    awayTeam: string;
    lastEvent: string | undefined;
    version: number;
}

export interface PersistedMatch extends MatchBeingScored {
    id: string;
}

export interface CurrentEditingMatch extends MatchBeingScored {
    id: string | undefined;
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
    lastEvent?: string;
    startMatch: (tossWonBy: TeamType, battingFirst: TeamType) => void;
    startInnings: (battingTeam: TeamType, batter1Index: number, batter2Index: number, overs?: number) => void;
    newBowler: (playerIndex: number) => void;
    newBatter: (playerIndex: number) => void;
    delivery: (deliveryOutcome: DeliveryOutcome, scores: DeliveryScores, wicket: DeliveryWicket | undefined) => void;
    undoPreviousDelivery: () => void;
    completeOver: () => void;
    flipBatters: () => void;
    completeInnings: (status: InningsStatus) => void;
    completeMatch: (result: MatchResult) => void;
    nonDeliveryWicket: (howout: Howout) => void;
    batterUnavailable: (playerIndex: number, reason: UnavailableReason) => void;
    setFromStoredMatch: (storedMatch: StoredMatch | undefined) => void;
    changeOrders: (battingOrder: number[], bowlingOrder: number[]) => void;
    rolledBackInnings: (eventIndex: number) => Innings | undefined;
    rollback: (eventIndex: number) => void;
    updateOvers: (overs: number) => void;
    startBreak: (breakType: BreakType) => void;
    undoToss: () => void;
    updateTeams: (homeTeam: string, awayTeam: string, homePlayers: string[], awayPlayers: string[]) => void;
    changeBowler: (fromDelivery: number, playerIndex: number) => void;
}

export interface RebuiltInnings {
    innings: Innings;
    batterIndex: number;
}

export interface UserTeams {
    user: string;
    teams: Team[];
}

export const howOutDescription = (
    getBowlerAtIndex: (index: number) => string,
    getFielderAtIndex: (index: number) => string,
    sameBowlerAndFielder: (bowlerIndex: number, fielderIndex: number) => boolean,
) => (wicket?: Wicket): string => {
    const description = (wkt: Wicket): string => {
        switch (wkt.howOut) {
            case Howout.Bowled:
                return `bowled ${getBowlerAtIndex(<number>wkt.bowlerIndex)}`;
            case Howout.Lbw:
                return `lbw ${getBowlerAtIndex(<number>wkt.bowlerIndex)}`;
            case Howout.Caught:
                return sameBowlerAndFielder(<number>wkt.bowlerIndex, <number>wkt.fielderIndex)
                    ? `ct & bowled ${getBowlerAtIndex(<number>wkt.bowlerIndex)}`
                    : `ct ${getFielderAtIndex(<number>wkt.fielderIndex)} b ${getBowlerAtIndex(<number>(
                          wkt.bowlerIndex
                      ))}`;
            case Howout.RunOut:
                return wkt.fielderIndex ? `run out (${getFielderAtIndex(<number>wkt.fielderIndex)})` : 'run out';
            case Howout.Stumped:
                return `st ${getFielderAtIndex(<number>wkt.fielderIndex)} b ${getBowlerAtIndex(<number>(
                    wkt.bowlerIndex
                ))}`;
            case Howout.TimedOut:
                return 'timed out';
            case Howout.ObstructingField:
                return 'obstructing the field';
            case Howout.HandledBall:
                return 'handled the ball';
            case Howout.HitWicket:
                return `hit wkt ${getBowlerAtIndex(<number>wkt.bowlerIndex)}`;
        }
    };

    return wicket ? description(wicket) : 'not out';
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

const nonStrikerHowouts = [Howout.RunOut, Howout.TimedOut, Howout.HandledBall, Howout.ObstructingField];

export const howouts = (currentBatter: Batter) => (batter: Batter) =>
    Object.keys(Howout)
        .filter(key => !isNaN(Number(Howout[key])))
        .map(key => Howout[key])
        .filter(
            howout =>
                batter.playerIndex === currentBatter.playerIndex ||
                nonStrikerHowouts.find(how => how === howout) !== undefined,
        );

export const howoutRequiresFielder = (howout: Howout) =>
    howout === Howout.Caught || howout === Howout.Stumped || howout === Howout.RunOut;

export const howoutBattersCouldCross = (howout: Howout) => howout === Howout.Caught || howout === Howout.RunOut;

export const howoutCouldScoreRuns = (howout: Howout) =>
    howout === Howout.Caught || howout === Howout.RunOut || howout === Howout.ObstructingField;

export const howoutCouldBeNoBall = (howout: Howout) => howout === Howout.RunOut || howout === Howout.ObstructingField;

export const howoutCouldBeWide = (howout: Howout) =>
    howout === Howout.RunOut || howout === Howout.Stumped || howout === Howout.ObstructingField;

export const deliveries = (events: Event[]) =>
    events.filter(event => event.type === EventType.Delivery).map(event => event as Delivery);
