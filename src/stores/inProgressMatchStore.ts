import { observable, computed, action } from 'mobx';
import * as domain from '../domain';
import { default as matchInnings } from '../match/innings';
import undo from '../match/undo';
import * as over from '../match/over';
import status from '../match/status';
import eventDescription from '../match/eventDescription';
import complete from '../match/complete';
import { getTeam } from '../match/utilities';
import editPlayers from '../match/innings/editPlayers';
import { end as endBreak, start as startBreak, current as currentBreak } from '../match/break';

const teamFromType = (match: domain.Match) => (type: domain.TeamType) => getTeam(match, type);

const updateMatchInnings = (
    match: domain.Match,
    innings: domain.Innings,
    config: domain.MatchConfig,
    version: number,
): [domain.Match, number] => {
    const updatedMatch = {
        ...match,
        innings: [
            ...match.innings.map(inn => (!matchInnings(config, teamFromType(match)).isComplete(inn) ? innings : inn)),
        ],
    };

    return [{ ...updatedMatch, status: status(updatedMatch) }, version + 1];
};

const bowlerOfOver = (innings: domain.Innings, overNumber: number) => {
    const deliveryInOver = innings.events
        .map(event => event as domain.Delivery)
        .filter(delivery => typeof delivery !== 'undefined')
        .find(delivery => delivery.overNumber === overNumber);

    return typeof deliveryInOver === 'undefined' ? undefined : innings.bowlers[deliveryInOver.bowlerIndex];
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

    get describeEvent() {
        return eventDescription(this.match);
    }

    @computed get currentInnings() {
        return this.match.innings.find(inn => !this.matchInnings.isComplete(inn));
    }

    @computed get currentOver() {
        const innings = this.currentInnings;
        if (typeof innings === 'undefined') {
            return undefined;
        }
        const deliveries = domain
            .deliveries(innings.events)
            .filter(delivery => delivery.overNumber > innings.completedOvers);

        return {
            deliveries,
            bowlingRuns: over.bowlingRuns(deliveries, this.config),
            wickets: over.wickets(deliveries),
        };
    }

    @computed get currentOverComplete() {
        const over = this.currentOver;
        return typeof over === 'undefined' ? undefined : over.deliveries.filter(domain.validDelivery).length >= 6;
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
        if (typeof this.currentInnings === 'undefined' || this.currentInnings.completedOvers === 0) {
            return undefined;
        }

        return bowlerOfOver(this.currentInnings, this.currentInnings.completedOvers);
    }

    @computed get previousBowlerFromEnd() {
        if (typeof this.currentInnings === 'undefined' || this.currentInnings.completedOvers <= 1) {
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
        return this.match.config.type === domain.MatchType.Time && this.match.config.inningsPerSide > 1;
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
        if (typeof this.currentInnings === 'undefined') {
            return false;
        }

        return (
            this.currentInnings.batting.batters.filter(
                batter => batter.innings && !batter.innings.wicket && typeof batter.unavailableReason === 'undefined',
            ).length < 2
        );
    }

    @action startMatch = (tossWonBy: domain.TeamType, battingFirst: domain.TeamType) => {
        this.match = {
            ...this.match,
            toss: { tossWonBy, battingFirst },
        };

        this.match.status = status(this.match);
        this.version = this.version + 1;
    };

    @action undoToss = () => {
        if (this.match.innings.find(inn => inn.events.length > 0)) {
            return;
        }

        this.match = { ...this.match, toss: undefined, innings: [] };
        this.match.status = status(this.match);
        this.version = this.version + 1;
    };

    @action startInnings = (
        battingTeam: domain.TeamType,
        batter1Index: number,
        batter2Index: number,
        overs?: number,
    ) => {
        const innings = this.matchInnings.create(battingTeam, batter1Index, batter2Index, overs);
        this.match = {
            ...this.match,
            innings: [...this.match.innings, innings],
        };

        this.currentBatterIndex = 0;
    };

    @action newBowler = (playerIndex: number) => {
        if (typeof this.currentInnings === 'undefined') {
            return;
        }

        if (typeof this.previousBowler !== 'undefined' && this.previousBowler.playerIndex === playerIndex) {
            return;
        }

        const [innings, bowlerIndex] = this.matchInnings.newBowler(this.currentInnings, playerIndex);

        this.updateMatch(this.match, innings);
        this.currentBowlerIndex = bowlerIndex;
    };

    @action newBatter = (playerIndex: number) => {
        if (typeof this.currentInnings === 'undefined') {
            return;
        }

        if (
            this.currentInnings.batting.batters.filter(
                batter =>
                    typeof batter.innings !== 'undefined' &&
                    typeof batter.innings.wicket === 'undefined' &&
                    typeof batter.unavailableReason === 'undefined',
            ).length === 2
        ) {
            return;
        }

        const batterIfUnavailable = this.currentInnings.batting.batters
            .map((batter, index) => ({
                batter,
                index,
            }))
            .find(b => b.batter.playerIndex === playerIndex && typeof b.batter.unavailableReason !== 'undefined');

        const [innings, batterIndex] = batterIfUnavailable
            ? [
                  this.matchInnings.batterAvailable(
                      this.currentInnings,
                      new Date().getTime(),
                      batterIfUnavailable.batter,
                  ),
                  batterIfUnavailable.index,
              ]
            : this.matchInnings.newBatter(this.currentInnings, playerIndex, this.currentBatterIndex);

        this.updateMatch(this.match, innings);
        this.currentBatterIndex = batterIndex;
    };

    @action delivery = (
        deliveryOutcome: domain.DeliveryOutcome,
        scores: domain.DeliveryScores,
        wicket: domain.DeliveryWicket | undefined = undefined,
    ) => {
        if (
            typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined' ||
            typeof this.currentBowler === 'undefined'
        ) {
            return;
        }

        const [innings, batterIndex, event] = this.matchInnings.delivery(
            this.currentInnings,
            new Date().getTime(),
            this.currentBatter,
            this.currentBowler,
            deliveryOutcome,
            scores,
            wicket,
        );

        this.updateMatch(endBreak(this.match, new Date().getTime()), innings);
        this.currentBatterIndex = batterIndex;

        this.updateLastEvent(
            event,
            this.currentInnings,
            wicket
                ? {
                      time: event.time,
                      howOut: wicket.howOut,
                      bowlerIndex: this.currentBowlerIndex,
                      fielderIndex: wicket.fielderIndex,
                  }
                : undefined,
        );
    };

    @action nonDeliveryWicket = (howout: domain.Howout) => {
        if (typeof this.currentInnings === 'undefined' || typeof this.currentBatter === 'undefined') {
            return;
        }

        const [updatedInnings, event] = this.matchInnings.nonDeliveryWicket(
            this.currentInnings,
            new Date().getTime(),
            this.currentBatter,
            howout,
        );

        this.updateMatch(endBreak(this.match, new Date().getTime()), updatedInnings);
        this.updateLastEvent(event, this.currentInnings, { howOut: howout, time: event.time });
    };

    @action batterUnavailable = (playerIndex: number, reason: domain.UnavailableReason) => {
        if (typeof this.currentInnings === 'undefined' || typeof this.currentBatter === 'undefined') {
            return;
        }

        const batter = this.currentInnings.batting.batters.find(batter => batter.playerIndex === playerIndex);

        if (typeof batter === 'undefined') {
            return;
        }

        const updatedInnings = this.matchInnings.batterUnavailable(
            this.currentInnings,
            new Date().getTime(),
            batter,
            reason,
        );

        this.updateMatch(this.match, updatedInnings);
    };

    @action undoPreviousDelivery = () => {
        if (
            typeof this.currentInnings === 'undefined' ||
            this.currentInnings.events.filter(ev => (<domain.Delivery>ev).overNumber > 0).length === 0
        ) {
            return;
        }

        const [innings, batterIndex, bowlerIndex] = this.undo(
            this.currentInnings,
            Number(this.currentBatterIndex),
            Number(this.currentBowlerIndex),
        );

        this.updateMatch(this.match, innings);
        this.currentBatterIndex = batterIndex;
        this.currentBowlerIndex = bowlerIndex;
    };

    @action completeOver = () => {
        if (
            typeof this.currentInnings === 'undefined' ||
            typeof this.currentBatter === 'undefined' ||
            typeof this.currentBowler === 'undefined'
        ) {
            return;
        }

        const [innings, batterIndex] = this.matchInnings.completeOver(
            this.currentInnings,
            new Date().getTime(),
            this.currentBatter,
            this.currentBowler,
        );

        this.updateMatch(endBreak(this.match, new Date().getTime()), innings);
        this.currentBatterIndex = batterIndex;
        this.currentBowlerIndex = undefined;
    };

    @action flipBatters = () => {
        if (typeof this.currentInnings === 'undefined' || typeof this.currentBatter === 'undefined') {
            return;
        }

        this.currentBatterIndex = this.matchInnings.flipBatters(this.currentInnings, this.currentBatter);
    };

    @action completeInnings = (status: domain.InningsStatus) => {
        if (typeof this.currentInnings === 'undefined') {
            return;
        }

        if (status === domain.InningsStatus.InProgress) {
            throw new Error('cannot complete with in progress status');
        }

        this.updateMatch(this.match, this.matchInnings.complete(this.currentInnings, status, new Date().getTime()));
        this.startBreak(domain.BreakType.Innings);
    };

    @action completeMatch = (result: domain.MatchResult) => {
        const [res, status] = complete.status(this.match, result);

        this.match = {
            ...endBreak(this.match, new Date().getTime()),
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

        this.lastEvent = undefined;
    };

    @action setId = (id: string) => {
        this.match.id = id;
    };

    @action setFromStoredMatch = (storedMatch: domain.StoredMatch) => {
        this.match = storedMatch.match;
        this.version = storedMatch.version;
        this.currentBatterIndex = storedMatch.currentBatterIndex;
        this.currentBowlerIndex = storedMatch.currentBowlerIndex;
        this.lastEvent = storedMatch.lastEvent;
    };

    @action changeOrders = (battingOrder: number[], bowlingOrder: number[]) => {
        if (typeof this.currentInnings === 'undefined') {
            return;
        }
        const inningsWithBatting = editPlayers.changeBatting(this.match, this.currentInnings, battingOrder);
        const innings = editPlayers.changeBowling(this.match, inningsWithBatting, bowlingOrder);
        this.updateMatch(this.match, innings);
    };

    @action rollback = (eventIndex: number) => {
        const rolledback = this.getRollback(eventIndex);
        if (typeof rolledback === 'undefined') {
            return;
        }

        this.updateMatch(this.match, rolledback[0]);
        this.currentBatterIndex = rolledback[1];
        this.currentBowlerIndex = rolledback[2];
    };

    @action updateOvers = (overs: number) => {
        if (typeof this.currentInnings === 'undefined') {
            return;
        }
        this.updateMatch(this.match, this.matchInnings.editOvers(this.currentInnings, overs));
    };

    @action startBreak = (breakType: domain.BreakType) => {
        this.match = startBreak(this.match, breakType, new Date().getTime());
        this.version = this.version + 1;
        this.lastEvent = currentBreak(this.match);
    };

    @action updateTeams = (homeTeam: string, awayTeam: string, homePlayers: string[], awayPlayers: string[]) => {
        this.match.homeTeam = {
            name: homeTeam,
            players: homePlayers,
        };
        this.match.awayTeam = {
            name: awayTeam,
            players: awayPlayers,
        };
    };

    @action changeBowler = (fromDelivery: number, playerIndex: number) => {
        if (typeof this.currentInnings === 'undefined') {
            return;
        }

        this.updateMatch(
            this.match,
            this.matchInnings.changeBowler(
                this.currentInnings,
                this.currentInnings.completedOvers + 1,
                fromDelivery,
                playerIndex,
            ),
        );

        this.currentBowlerIndex = this.currentInnings.bowlers.findIndex(bowler => bowler.playerIndex === playerIndex);
    };

    private getRollback = (eventIndex: number): [domain.Innings, number, number] | undefined => {
        if (typeof this.currentInnings === 'undefined' || this.currentInnings.events.length === 0) {
            return undefined;
        }
        return this.matchInnings.rollback(this.currentInnings, eventIndex);
    };

    updateLastEvent = (event: domain.Event, innings: domain.Innings, wicket?: domain.Wicket) => {
        const description = this.describeEvent(innings, event, wicket);
        if (typeof description !== 'undefined') {
            this.lastEvent = description;
        }
    };

    rolledBackInnings = (eventIndex: number): domain.Innings | undefined => {
        const rolledback = this.getRollback(eventIndex);
        return typeof rolledback === 'undefined' ? undefined : rolledback[0];
    };

    private updateMatch = (matchToUpdate: domain.Match, innings: domain.Innings) => {
        const [match, version] = updateMatchInnings(matchToUpdate, innings, this.config, this.version);

        this.match = match;
        this.version = version;
    };
}

const inProgressMatch = new InProgressMatchStore();
export default inProgressMatch;

export { InProgressMatchStore };
