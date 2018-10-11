import { observable, computed, action } from 'mobx';
import * as domain from '../domain';
import { default as matchInnings } from '../match/innings';
import undo from '../match/undo';
import * as over from '../match/over';
import status from '../match/status';
import { getTeam } from '../match/utilities';

const teamFromType = (match: domain.Match) => (type: domain.TeamType) => getTeam(match, type);

const updateMatchInnings =
    (match: domain.Match, innings: domain.Innings, config: domain.MatchConfig): domain.Match => ({
        ...match,
        status: status(match),
        innings: [...match.innings.map(inn => !matchInnings(config, teamFromType(match)).isComplete(inn)
            ? innings
            : inn)],
    });

const bowlerOfOver = (innings: domain.Innings, overNumber: number) => {
    const deliveryInOver = innings.deliveries
        .find(delivery => delivery.overNumber === overNumber);

    return typeof deliveryInOver === 'undefined'
        ? undefined
        : innings.bowlers[deliveryInOver.bowlerIndex];
};

const defaultConfig = {
    playersPerSide: 11,
    type: domain.MatchType.Time,
    inningsPerSide: 1,
    runsForNoBall: 1,
    runsForWide: 1,
};

class InProgressMatchStore implements domain.InProgressMatch {
    @observable match: domain.Match | undefined;
    @observable currentBatterIndex: number | undefined;
    @observable currentBowlerIndex: number | undefined;

    get config() {
        return typeof this.match !== 'undefined'
            ? this.match.config
            : defaultConfig;
    }

    get matchInnings() {
        return matchInnings(this.config, teamFromType(this.match as domain.Match));
    }

    get undo() {
        return undo(this.config);
    }

    @computed get currentInnings() {
        return typeof this.match === 'undefined'
            ? undefined
            : this.match.innings.find(inn => !this.matchInnings.isComplete(inn));
    }

    @computed get currentOver() {
        const innings = this.currentInnings;
        if (typeof innings === 'undefined') { return undefined; }
        const deliveries = innings.deliveries.filter(delivery => delivery.overNumber > innings.completedOvers);

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
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined' ||
            this.currentInnings.completedOvers === 0) {
            return undefined;
        }

        return bowlerOfOver(this.currentInnings, this.currentInnings.completedOvers);
    }

    @computed get previousBowlerFromEnd() {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined' ||
            this.currentInnings.completedOvers <= 1) {
            return undefined;
        }

        return bowlerOfOver(this.currentInnings, this.currentInnings.completedOvers - 1);
    }

    @computed get provisionalInningsStatus() {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined') {
            return undefined;
        }

        return this.matchInnings.calculateStatus(this.match.config, this.currentInnings);
    }

    @computed get canSelectBattingTeamForInnings() {
        return typeof this.match !== 'undefined' &&
            this.match.config.type === domain.MatchType.Time &&
            this.match.config.inningsPerSide > 1;
    }

    @computed get nextBattingTeam() {
        if (typeof this.match === 'undefined' || typeof this.match.toss === 'undefined') {
            return undefined;
        }

        if (this.match.innings.length === 0) {
            return this.match.toss.battingFirst === domain.TeamType.HomeTeam
                ? this.match.homeTeam
                : this.match.awayTeam;
        }

        return getTeam(this.match, this.match.innings[this.match.innings.length - 1].bowlingTeam);
    }

    @action startMatch = (tossWonBy: domain.TeamType, battingFirst: domain.TeamType) => {
        if (typeof this.match === 'undefined') { return; }

        this.match = {
            ...this.match,
            toss: { tossWonBy, battingFirst },
        };
    }

    @action startInnings = (battingTeam: domain.TeamType, batter1Index: number, batter2Index: number) => {
        if (typeof this.match === 'undefined') { return; }

        const innings = this.matchInnings.newInnings(battingTeam, batter1Index, batter2Index);
        this.match = {
            ...this.match,
            innings: [...this.match.innings, innings],
        };

        this.currentBatterIndex = 0;
    }

    @action newBowler = (playerIndex: number) => {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined') { return; }

        if (typeof this.previousBowler !== 'undefined' &&
            this.previousBowler.playerIndex === playerIndex) {
            return;
        }

        const [innings, bowlerIndex] = this.matchInnings.newBowler(this.currentInnings, playerIndex);

        this.match = updateMatchInnings(
            this.match,
            innings,
            this.config,
        );

        this.currentBowlerIndex = bowlerIndex;
    }

    @action newBatter = (playerIndex: number) => {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined') { return; }

        if (this.currentInnings.batting.batters.filter(batter =>
            typeof batter.innings !== 'undefined' &&
            typeof batter.innings.wicket === 'undefined').length === 2) {
            return;
        }

        const [innings, batterIndex] = this.matchInnings.newBatter(this.currentInnings, playerIndex);
        this.match = updateMatchInnings(
            this.match,
            innings,
            this.config,
        );

        this.currentBatterIndex = batterIndex;
    }

    @action delivery = (
        deliveryOutcome: domain.DeliveryOutcome,
        scores: domain.DeliveryScores,
        wicket: domain.DeliveryWicket | undefined = undefined,
    ) => {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined' ||
            typeof this.currentBowler === 'undefined') { return; }

        const [innings, batterIndex] =
            this.matchInnings.delivery(
                this.currentInnings,
                this.currentBatter,
                this.currentBowler,
                deliveryOutcome,
                scores,
                wicket);

        this.match = updateMatchInnings(
            this.match,
            innings,
            this.config,
        );

        this.currentBatterIndex = batterIndex;
    }

    @action undoPreviousDelivery = () => {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined' ||
            typeof this.currentBowler === 'undefined') { return; }

        const [innings, batterIndex, bowlerIndex] = this.undo(this.currentInnings);

        this.match = updateMatchInnings(
            this.match,
            innings,
            this.config,
        );

        this.currentBatterIndex = batterIndex;
        this.currentBowlerIndex = bowlerIndex;
    }

    @action completeOver = () => {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined' ||
            typeof this.currentBowler === 'undefined') { return; }

        const [innings, batterIndex] =
        this.matchInnings.completeOver(this.currentInnings, this.currentBatter, this.currentBowler);

        this.match = updateMatchInnings(
            this.match,
            innings,
            this.config,
        );

        this.currentBatterIndex = batterIndex;
        this.currentBowlerIndex = undefined;
    }

    @action flipBatters = () => {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined') { return; }

        this.currentBatterIndex = this.matchInnings.flipBatters(this.currentInnings, this.currentBatter);
    }

    @action completeInnings = (status: domain.InningsStatus) => {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined') {
            return;
        }

        if (status === domain.InningsStatus.InProgress) {
            throw new Error('cannot complete with in progress status');
        }
        this.currentInnings.status = status;
    }
}

const inProgressMatch = new InProgressMatchStore();
export default inProgressMatch;

export { InProgressMatchStore };
