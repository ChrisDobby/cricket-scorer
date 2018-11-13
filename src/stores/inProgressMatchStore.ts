import { observable, computed, action } from 'mobx';
import * as domain from '../domain';
import { default as matchInnings } from '../match/innings';
import undo from '../match/undo';
import * as over from '../match/over';
import status from '../match/status';
import eventDescription from '../match/eventDescription';
import complete from '../match/complete';
import { getTeam } from '../match/utilities';

const teamFromType = (match: domain.Match) => (type: domain.TeamType) => getTeam(match, type);

const updateMatchInnings =
    (match: domain.Match, innings: domain.Innings, config: domain.MatchConfig, version: number):
        [domain.Match, number] => {
        const updatedMatch = {
            ...match,
            innings: [...match.innings.map(inn => !matchInnings(config, teamFromType(match)).isComplete(inn)
                ? innings
                : inn)],
        };

        return [
            { ...updatedMatch, status: status(updatedMatch) },
            version + 1,
        ];
    };

const bowlerOfOver = (innings: domain.Innings, overNumber: number) => {
    const deliveryInOver = innings.events
        .map(event => event as domain.Delivery)
        .filter(delivery => typeof delivery !== 'undefined')
        .find(delivery => delivery.overNumber === overNumber);

    return typeof deliveryInOver === 'undefined'
        ? undefined
        : innings.bowlers[deliveryInOver.bowlerIndex];
};

class InProgressMatchStore implements domain.InProgressMatch {
    @observable match: domain.Match;
    @observable currentBatterIndex: number | undefined;
    @observable currentBowlerIndex: number | undefined;
    version = 0;
    lastEvent: string | undefined = undefined;

    get config() {
        return this.match.config;
    }

    get matchInnings() {
        return matchInnings(this.config, teamFromType(this.match as domain.Match));
    }

    get undo() {
        return undo(this.matchInnings.rebuild);
    }

    @computed get currentInnings() {
        return this.match.innings.find(inn => !this.matchInnings.isComplete(inn));
    }

    @computed get currentOver() {
        const innings = this.currentInnings;
        if (typeof innings === 'undefined') { return undefined; }
        const deliveries = domain.deliveries(innings.events)
            .filter(delivery => delivery.overNumber > innings.completedOvers);

        return {
            deliveries,
            bowlingRuns: over.bowlingRuns(deliveries, this.config),
            wickets: over.wickets(deliveries),
        };
    }

    @computed get currentOverComplete() {
        const over = this.currentOver;
        return typeof over === 'undefined'
            ? undefined
            : over.deliveries.filter(domain.validDelivery).length >= 6;
    }

    @computed get currentBatter() {
        const innings = this.currentInnings;
        return typeof innings === 'undefined' || typeof this.currentBatterIndex === 'undefined'
            ? undefined
            : innings.batting.batters[this.currentBatterIndex];
    }

    @computed get currentBowler() {
        const innings = this.currentInnings;
        return typeof innings === 'undefined' || typeof this.currentBowlerIndex === 'undefined'
            ? undefined
            : innings.bowlers[this.currentBowlerIndex];
    }

    @computed get previousBowler() {
        if (typeof this.currentInnings === 'undefined' ||
            this.currentInnings.completedOvers === 0) {
            return undefined;
        }

        return bowlerOfOver(this.currentInnings, this.currentInnings.completedOvers);
    }

    @computed get previousBowlerFromEnd() {
        if (typeof this.currentInnings === 'undefined' ||
            this.currentInnings.completedOvers <= 1) {
            return undefined;
        }

        return bowlerOfOver(this.currentInnings, this.currentInnings.completedOvers - 1);
    }

    @computed get provisionalInningsStatus() {
        if (typeof this.currentInnings === 'undefined') {
            return undefined;
        }

        return this.matchInnings.calculateStatus(this.match.config, this.currentInnings);
    }

    @computed get provisionalMatchComplete() {
        return complete.isComplete(this.match);
    }

    @computed get canSelectBattingTeamForInnings() {
        return this.match.config.type === domain.MatchType.Time &&
            this.match.config.inningsPerSide > 1;
    }

    @computed get nextBattingTeam() {
        if (typeof this.match.toss === 'undefined') {
            return undefined;
        }

        if (this.match.innings.length === 0) {
            return this.match.toss.battingFirst === domain.TeamType.HomeTeam
                ? this.match.homeTeam
                : this.match.awayTeam;
        }

        return getTeam(this.match, this.match.innings[this.match.innings.length - 1].bowlingTeam);
    }

    @computed get newBatterRequired() {
        if (typeof this.currentInnings === 'undefined') { return false; }

        return this.currentInnings.batting.batters
            .filter(batter => batter.innings &&
                !batter.innings.wicket &&
                typeof batter.unavailableReason === 'undefined').length < 2;
    }

    @action startMatch = (tossWonBy: domain.TeamType, battingFirst: domain.TeamType) => {
        this.match = {
            ...this.match,
            toss: { tossWonBy, battingFirst },
        };

        this.match.status = status(this.match);
    }

    @action startInnings = (battingTeam: domain.TeamType, batter1Index: number, batter2Index: number) => {
        const innings = this.matchInnings.create(battingTeam, batter1Index, batter2Index);
        this.match = {
            ...this.match,
            innings: [...this.match.innings, innings],
        };

        this.currentBatterIndex = 0;
    }

    @action newBowler = (playerIndex: number) => {
        if (typeof this.currentInnings === 'undefined') { return; }

        if (typeof this.previousBowler !== 'undefined' &&
            this.previousBowler.playerIndex === playerIndex) {
            return;
        }

        const [innings, bowlerIndex] = this.matchInnings.newBowler(this.currentInnings, playerIndex);

        const [match, version] = updateMatchInnings(
            this.match,
            innings,
            this.config,
            this.version,
        );
        this.match = match;
        this.version = version;

        this.currentBowlerIndex = bowlerIndex;
    }

    @action newBatter = (playerIndex: number) => {
        if (typeof this.currentInnings === 'undefined') { return; }

        if (this.currentInnings.batting.batters.filter(batter =>
            typeof batter.innings !== 'undefined' &&
            typeof batter.innings.wicket === 'undefined' &&
            typeof batter.unavailableReason === 'undefined').length === 2) {
            return;
        }

        const [innings, batterIndex] = this.matchInnings.newBatter(this.currentInnings, playerIndex);
        const [match, version] = updateMatchInnings(
            this.match,
            innings,
            this.config,
            this.version,
        );
        this.match = match;
        this.version = version;

        this.currentBatterIndex = batterIndex;
    }

    @action delivery = (
        deliveryOutcome: domain.DeliveryOutcome,
        scores: domain.DeliveryScores,
        wicket: domain.DeliveryWicket | undefined = undefined,
    ) => {
        if (typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined' ||
            typeof this.currentBowler === 'undefined') { return; }

        const [innings, batterIndex, event] =
            this.matchInnings.delivery(
                this.currentInnings,
                (new Date()).getTime(),
                this.currentBatter,
                this.currentBowler,
                deliveryOutcome,
                scores,
                wicket);

        const [match, version] = updateMatchInnings(
            this.match,
            innings,
            this.config,
            this.version,
        );
        this.match = match;
        this.version = version;

        this.currentBatterIndex = batterIndex;
        this.updateLastEvent(event, this.currentInnings);
    }

    @action nonDeliveryWicket = (
        howout: domain.Howout,
    ) => {
        if (typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined') { return; }

        const [updatedInnings, event] = this.matchInnings.nonDeliveryWicket(
            this.currentInnings,
            (new Date()).getTime(),
            this.currentBatter,
            howout,
        );

        const [match, version] = updateMatchInnings(
            this.match,
            updatedInnings,
            this.config,
            this.version);
        this.match = match;
        this.version = version;
        this.updateLastEvent(event, this.currentInnings);
    }

    @action batterUnavailable = (
        reason: domain.UnavailableReason,
    ) => {
        if (typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined') { return; }

        const updatedInnings = this.matchInnings.batterUnavailable(
            this.currentInnings,
            (new Date()).getTime(),
            this.currentBatter,
            reason,
        );

        const [match, version] = updateMatchInnings(
            this.match,
            updatedInnings,
            this.config,
            this.version);
        this.match = match;
        this.version = version;
    }

    @action undoPreviousDelivery = () => {
        if (typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined' ||
            typeof this.currentBowler === 'undefined') { return; }

        const [innings, batterIndex, bowlerIndex] =
            this.undo(this.currentInnings, Number(this.currentBatterIndex), Number(this.currentBowlerIndex));

        const [match, version] = updateMatchInnings(
            this.match,
            innings,
            this.config,
            this.version,
        );
        this.match = match;
        this.version = version;

        this.currentBatterIndex = batterIndex;
        this.currentBowlerIndex = bowlerIndex;
    }

    @action completeOver = () => {
        if (typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined' ||
            typeof this.currentBowler === 'undefined') { return; }

        const [innings, batterIndex] =
        this.matchInnings.completeOver(this.currentInnings, this.currentBatter, this.currentBowler);

        const [match, version] = updateMatchInnings(
            this.match,
            innings,
            this.config,
            this.version,
        );
        this.match = match;
        this.version = version;

        this.currentBatterIndex = batterIndex;
        this.currentBowlerIndex = undefined;
    }

    @action flipBatters = () => {
        if (typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined') { return; }

        this.currentBatterIndex = this.matchInnings.flipBatters(this.currentInnings, this.currentBatter);
    }

    @action completeInnings = (status: domain.InningsStatus) => {
        if (typeof this.currentInnings === 'undefined') {
            return;
        }

        if (status === domain.InningsStatus.InProgress) {
            throw new Error('cannot complete with in progress status');
        }
        this.currentInnings.status = status;
    }

    @action completeMatch = (result: domain.MatchResult) => {
        const [res, status] = complete.status(this.match, result);

        this.match = {
            ...this.match,
            status,
            innings: [
                ...this.match.innings.map(innings =>
                    innings.status !== domain.InningsStatus.InProgress
                        ? innings
                        : { ...innings, status: domain.InningsStatus.MatchComplete },
                ),
            ],
            complete: true,
            result: res,
        };
    }

    @action setId = (id: string) => {
        this.match.id = id;
    }

    @action setFromStoredMatch = (storedMatch: domain.StoredMatch) => {
        this.match = storedMatch.match;
        this.version = storedMatch.version;
        this.currentBatterIndex = storedMatch.currentBatterIndex;
        this.currentBowlerIndex = storedMatch.currentBowlerIndex;
    }

    updateLastEvent = (event: domain.Event, innings: domain.Innings, wicket?: domain.Wicket) => {
        const description = eventDescription(this.match, innings, event, wicket);
        if (typeof description !== 'undefined') {
            this.lastEvent = description;
        }
    }
}

const inProgressMatch = new InProgressMatchStore();
export default inProgressMatch;

export { InProgressMatchStore };
