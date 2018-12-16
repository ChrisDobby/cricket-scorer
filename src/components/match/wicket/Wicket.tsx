import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import EditForm from '../EditForm';
import * as domain from '../../../domain';
import DeliveryHeader from '../DeliveryHeader';
import Entry from './Entry';
import { bindMatchStorage } from '../../../stores/withMatchStorage';
import { getTeam } from '../../../match/utilities';

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: '20px',
    },
});

const nonDeliveryHowouts = [domain.Howout.TimedOut];

type WicketProps = RouteComponentProps<{}> & {
    inProgress: domain.InProgressMatch;
    storeMatch: (m: domain.InProgressMatch) => void;
    history: any;
    classes: any;
    userProfile: domain.Profile;
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
    bindStorage = bindMatchStorage(this.props.storeMatch, () => this.props.inProgress, () => this.props.userProfile.id);
    delivery = this.bindStorage(this.props.inProgress.delivery);
    nonDeliveryWicket = this.bindStorage(this.props.inProgress.nonDeliveryWicket);

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

    batterChange = (batterIndex: number) => {
        this.setState({
            batterIndex,
            howout: undefined,
            fielderIndex: undefined,
            crossed: false,
            runs: undefined,
        });
    }

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
        nonDeliveryHowouts.find(h => h === this.state.howout)
            ? this.nonDeliveryWicket(this.state.howout)
            : this.delivery(
                this.state.deliveryOutcome,
                this.state.scores,
                this.deliveryWicket,
            );

        this.props.history.push('/match/inprogress');
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
            : getTeam(
                this.props.inProgress.match as domain.Match,
                this.props.inProgress.currentInnings.bowlingTeam).players;
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
            <Paper className={this.props.classes.root}>
                <EditForm
                    heading="Wicket"
                    save={this.save}
                    canSave={() => this.canSave}
                >
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

                </EditForm>
            </Paper>);
    }
}

export default withStyles(styles)(withRouter(Wicket));
