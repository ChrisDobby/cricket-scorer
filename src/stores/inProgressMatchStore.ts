import { observable, computed, action } from 'mobx';
import * as domain from '../domain';
import { default as matchInnings } from '../match/innings';
import * as over from '../match/over';

const updateMatchInnings = (match: domain.Match, innings: domain.Innings): domain.Match => ({
    ...match,
    innings: [...match.innings.map(inn => !inn.complete
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

class InProgressMatchStore implements domain.InProgressMatch {
    @observable match: domain.Match | undefined;
    @observable currentBatterIndex: number | undefined;
    @observable currentBowlerIndex: number | undefined;

    @computed get currentInnings() {
        return typeof this.match === 'undefined'
            ? undefined
            : this.match.innings.find(inn => !inn.complete);
    }

    @computed get currentOver() {
        const innings = this.currentInnings;
        if (typeof innings === 'undefined') { return undefined; }
        const deliveries = innings.deliveries.filter(delivery => delivery.overNumber > innings.completedOvers);

        return {
            deliveries,
            bowlingRuns: over.bowlingRuns(deliveries),
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

    @action startInnings = (battingTeam: domain.Team, batter1Index: number, batter2Index: number) => {
        if (typeof this.match === 'undefined') { return; }

        const innings = matchInnings.newInnings(this.match, battingTeam, batter1Index, batter2Index);
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

        const [innings, bowlerIndex] = matchInnings.newBowler(this.currentInnings, playerIndex);

        this.match = updateMatchInnings(
            this.match,
            innings,
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

        const [innings, batterIndex] = matchInnings.newBatter(this.currentInnings, playerIndex);
        this.match = updateMatchInnings(
            this.match,
            innings,
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
            matchInnings.delivery(
                this.currentInnings,
                this.currentBatter,
                this.currentBowler,
                deliveryOutcome,
                scores,
                wicket);

        this.match = updateMatchInnings(
            this.match,
            innings,
        );

        this.currentBatterIndex = batterIndex;
    }

    @action undoPreviousDelivery = () => {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined' ||
            typeof this.currentBowler === 'undefined') { return; }

        const [innings, batterIndex] = matchInnings.undoPrevious(this.currentInnings);

        this.match = updateMatchInnings(
            this.match,
            innings,
        );

        this.currentBatterIndex = batterIndex;
    }

    @action completeOver = () => {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined' ||
            typeof this.currentBowler === 'undefined') { return; }

        const [innings, batterIndex] =
            matchInnings.completeOver(this.currentInnings, this.currentBatter, this.currentBowler);

        this.match = updateMatchInnings(
            this.match,
            innings,
        );

        this.currentBatterIndex = batterIndex;
        this.currentBowlerIndex = undefined;
    }

    @action flipBatters = () => {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined') { return; }

        this.currentBatterIndex = matchInnings.flipBatters(this.currentInnings, this.currentBatter);
    }
}

const inProgressMatch = new InProgressMatchStore();
export default inProgressMatch;

export { InProgressMatchStore };
