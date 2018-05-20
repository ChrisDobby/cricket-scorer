import { observable, computed, action } from 'mobx';
import { InProgressMatch, Match, Team, validDelivery, Innings } from '../domain';
import * as matchInnings from '../match/innings';

const updateMatchInnings = (match: Match, innings: Innings): Match => ({
    ...match,
    innings: [...match.innings.map(inn => !inn.complete
        ? innings
        : inn)],
});

class InProgressMatchStore implements InProgressMatch {
    @observable match: Match | undefined;
    @observable currentBatterIndex: number | undefined;
    @observable currentBowlerIndex: number | undefined;

    @computed get currentInnings() {
        return typeof this.match === 'undefined'
            ? undefined
            : this.match.innings.find(inn => !inn.complete);
    }

    @computed get currentOver() {
        const innings = this.currentInnings;
        return typeof innings === 'undefined'
            ? undefined
            : innings.deliveries.filter(delivery => delivery.overNumber > innings.completedOvers);
    }

    @computed get currentOverComplete() {
        const over = this.currentOver;
        return typeof over === 'undefined'
            ? undefined
            : over.filter(validDelivery).length >= 6;
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

    @action startInnings = (battingTeam: Team, batter1Index: number, batter2Index: number) => {
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

        const [innings, bowlerIndex] = matchInnings.newBowler(this.currentInnings, playerIndex);

        this.match = updateMatchInnings(
            this.match,
            innings,
        );

        this.currentBowlerIndex = bowlerIndex;
    }

    @action dotBall = () => {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined' ||
            typeof this.currentBowler === 'undefined') { return; }

        this.match = updateMatchInnings(
            this.match,
            matchInnings.dotBall(this.currentInnings, this.currentBatter, this.currentBowler),
        );
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
}

const inProgressMatch = new InProgressMatchStore();
export default inProgressMatch;

export { InProgressMatchStore };