import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as domain from '../../../domain';
import WithNavBar from '../../WithNavBar';
import DeliveryHeader from '../DeliveryHeader';
import Entry from './Entry';
import * as globalStyles from '../../styles';
import { SaveButton } from '../SaveButton';
import { bindMatchStorage } from '../../../stores/withMatchStorage';

type WicketProps = RouteComponentProps<{}> & {
    inProgress: domain.InProgressMatch;
    storage: any;
    history: any;
};

interface WicketState {
    batterIndex: number;
    fielderIndex?: number;
    howout?: domain.Howout;
    crossed: boolean;
    scores: domain.DeliveryScores;
    deliveryOutcome: domain.DeliveryOutcome;
}

class Wicket extends React.Component<WicketProps, {}> {
    bindStorage = bindMatchStorage(this.props.storage.storeMatch, () => this.props.inProgress);
    delivery = this.bindStorage(this.props.inProgress.delivery);

    getHowouts =
        typeof this.props.inProgress.currentBatter === 'undefined'
            ? () => []
            : domain.howouts(this.props.inProgress.currentBatter);

    state: WicketState = {
        batterIndex: 0,
        crossed: false,
        scores: {},
        deliveryOutcome: domain.DeliveryOutcome.Valid,
    };

    batterChange = (batterIndex: number) =>
        this.setState({
            batterIndex,
            howout: undefined,
            fielderIndex: undefined,
            crossed: false,
            runs: undefined,
        })

    howoutChange = (howout: domain.Howout | undefined) =>
        this.setState({
            howout,
            fielderIndex: undefined,
            crossed: false,
            deliveryOutcome: domain.DeliveryOutcome.Valid,
        })

    fielderChange = (fielderIndex: number) =>
        this.setState({
            fielderIndex: Number.isNaN(fielderIndex) ? undefined : fielderIndex,
        })

    crossedChange = (crossed: boolean) =>
        this.setState({
            crossed,
        })

    scoresChange = (scores: domain.DeliveryScores) =>
        this.setState({ scores })

    deliveryOutcomeChange = (deliveryOutcome: domain.DeliveryOutcome) =>
        this.setState({ deliveryOutcome })

    save = () => {
        this.delivery(
            domain.DeliveryOutcome.Valid,
            this.state.scores,
            this.deliveryWicket,
        );

        this.props.history.push('/inprogress');
    }

    get canSave() {
        return typeof this.state.howout !== 'undefined' &&
            ((domain.howoutRequiresFielder(this.state.howout) && typeof this.state.fielderIndex !== 'undefined') ||
                (!domain.howoutRequiresFielder(this.state.howout) && typeof this.state.fielderIndex === 'undefined'));
    }

    get batters(): domain.Batter[] {
        if (typeof this.props.inProgress.currentInnings === 'undefined' ||
            typeof this.props.inProgress.currentBatter === 'undefined') {
            return [];
        }

        return [
            this.props.inProgress.currentBatter,
            ...this.props.inProgress.currentInnings.batting.batters.filter(batter =>
                batter !== this.props.inProgress.currentBatter &&
                typeof batter.innings !== 'undefined'
                && typeof batter.innings.wicket === 'undefined'),
        ];
    }

    get fielders() {
        return typeof this.props.inProgress.currentInnings === 'undefined'
            ? []
            : this.props.inProgress.currentInnings.bowlingTeam.players;
    }

    get availableHowouts() {
        return this.getHowouts(this.batters[this.state.batterIndex]);
    }

    get fielderRequired() {
        return typeof this.state.howout !== 'undefined' &&
            domain.howoutRequiresFielder(this.state.howout);
    }

    get couldCross() {
        return typeof this.state.howout !== 'undefined' &&
            domain.howoutBattersCouldCross(this.state.howout);
    }

    get couldScoreRuns() {
        return typeof this.state.howout !== 'undefined' &&
            domain.howoutCouldScoreRuns(this.state.howout);
    }

    get couldBeNoBall() {
        return typeof this.state.howout !== 'undefined' &&
            domain.howoutCouldBeNoBall(this.state.howout);
    }

    get couldBeWide() {
        return typeof this.state.howout !== 'undefined' &&
            domain.howoutCouldBeWide(this.state.howout);
    }

    get deliveryWicket(): domain.DeliveryWicket | undefined {
        if (typeof this.state.howout === 'undefined') {
            return undefined;
        }

        return {
            howOut: this.state.howout,
            fielderIndex: this.state.fielderIndex,
            changedEnds: this.state.crossed,
        };
    }

    render() {
        if (typeof this.props.inProgress.currentBatter === 'undefined' ||
            typeof this.props.inProgress.currentBowler === 'undefined') {
            return (
                <div className="alert alert-danger" role="alert">
                    No current delivery
                </div>);
        }

        return (
            <React.Fragment>
                <div style={globalStyles.sectionContainer}>
                    <DeliveryHeader
                        batter={this.props.inProgress.currentBatter}
                        bowler={this.props.inProgress.currentBowler}
                    />
                    <Entry
                        batters={this.batters}
                        bowler={this.props.inProgress.currentBowler}
                        fielders={this.fielders}
                        batterIndex={this.state.batterIndex}
                        howout={this.state.howout}
                        fielderIndex={this.state.fielderIndex}
                        crossed={this.state.crossed}
                        scores={this.state.scores}
                        batterChange={this.batterChange}
                        howoutChange={this.howoutChange}
                        fielderChange={this.fielderChange}
                        crossedChange={this.crossedChange}
                        scoresChange={this.scoresChange}
                        deliveryOutcomeChange={this.deliveryOutcomeChange}
                        availableHowouts={this.availableHowouts}
                        fielderRequired={this.fielderRequired}
                        couldCross={this.couldCross}
                        couldScoreRuns={this.couldScoreRuns}
                        couldBeNoBall={this.couldBeNoBall}
                        couldBeWide={this.couldBeWide}
                        deliveryOutcome={this.state.deliveryOutcome}
                    />
                </div>
                <SaveButton enabled={this.canSave} save={this.save} />
            </React.Fragment>);
    }
}

export default WithNavBar(withRouter(Wicket));
