import { InProgressMatch, Match, Team, validDelivery, Innings } from '../domain';
import * as matchInnings from '../match/innings';

const updateMatchInnings = (match: Match, innings: Innings): Match => ({
    ...match,
    innings: [...match.innings.map(inn => !inn.complete
        ? innings
        : inn)],
});

class InProgressMatchStore implements InProgressMatch {
    match: Match | undefined;
    currentBatterIndex: number | undefined;
    currentBowlerIndex: number | undefined;

    get currentInnings() {
        return typeof this.match === 'undefined'
            ? undefined
            : this.match.innings.find(inn => !inn.complete);
    }

    get currentOver() {
        const innings = this.currentInnings;
        return typeof innings === 'undefined'
            ? undefined
            : innings.deliveries.filter(delivery => delivery.overNumber > innings.completedOvers);
    }

    get currentOverComplete() {
        const over = this.currentOver;
        return typeof over === 'undefined'
            ? undefined
            : over.filter(validDelivery).length >= 6;
    }

    get currentBatter() {
        const innings = this.currentInnings;
        return typeof innings === 'undefined' || typeof this.currentBatterIndex === 'undefined'
            ? undefined
            : innings.batting.batters[this.currentBatterIndex];
    }

    get currentBowler() {
        const innings = this.currentInnings;
        return typeof innings === 'undefined' || typeof this.currentBowlerIndex === 'undefined'
            ? undefined
            : innings.bowlers[this.currentBowlerIndex];
    }

    startInnings(battingTeam: Team, batter1Index: number, batter2Index: number) {
        if (typeof this.match === 'undefined') { return; }

        const innings = matchInnings.newInnings(this.match, battingTeam, batter1Index, batter2Index);
        this.match = {
            ...this.match,
            innings: [...this.match.innings, innings],
        };
    }

    newBowler(playerIndex: number) {
        if (typeof this.match === 'undefined' ||
            typeof this.currentInnings === 'undefined') { return; }

        const [innings, bowlerIndex] = matchInnings.newBowler(this.currentInnings, playerIndex);

        this.match = updateMatchInnings(
            this.match,
            innings,
        );

        this.currentBowlerIndex = bowlerIndex;
    }
}

const inProgressMatch = new InProgressMatchStore();
export default inProgressMatch;

export { InProgressMatchStore };
