import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { History } from 'history';
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
    history: History;
    classes: any;
    userProfile: domain.Profile;
};

const Wicket = (props: WicketProps) => {
    const [batterIndex, setBatterIndex] = React.useState(0);
    const [fielderIndex, setFielderIndex] = React.useState(undefined as number | undefined);
    const [crossed, setCrossed] = React.useState(false);
    const [scores, setScores] = React.useState({} as domain.DeliveryScores);
    const [deliveryOutcome, setDeliveryOutcome] = React.useState(domain.DeliveryOutcome.Valid);
    const [howout, setHowout] = React.useState(undefined as domain.Howout | undefined);

    const bindStorage = bindMatchStorage(props.storeMatch, () => props.inProgress, () => props.userProfile.id);
    const delivery = bindStorage(props.inProgress.delivery);
    const nonDeliveryWicket = bindStorage(props.inProgress.nonDeliveryWicket);

    const getHowouts =
        typeof props.inProgress.currentBatter === 'undefined'
            ? () => []
            : domain.howouts(props.inProgress.currentBatter);

    const batters = (): domain.Batter[] => {
        if (
            typeof props.inProgress.currentInnings === 'undefined' ||
            typeof props.inProgress.currentBatter === 'undefined'
        ) {
            return [];
        }

        return [
            props.inProgress.currentBatter,
            ...props.inProgress.currentInnings.batting.batters.filter(
                batter =>
                    batter !== props.inProgress.currentBatter &&
                    typeof batter.innings !== 'undefined' &&
                    typeof batter.innings.wicket === 'undefined',
            ),
        ];
    };

    const fielders = () =>
        typeof props.inProgress.currentInnings === 'undefined'
            ? []
            : getTeam(props.inProgress.match as domain.Match, props.inProgress.currentInnings.bowlingTeam).players;

    const deliveryWicket = (): domain.DeliveryWicket | undefined => {
        if (typeof howout === 'undefined') {
            return undefined;
        }

        return {
            fielderIndex,
            howOut: howout,
            changedEnds: crossed,
        };
    };

    const fielderRequired = () => typeof howout !== 'undefined' && domain.howoutRequiresFielder(howout);
    const couldCross = () => typeof howout !== 'undefined' && domain.howoutBattersCouldCross(howout);
    const couldScoreRuns = () => typeof howout !== 'undefined' && domain.howoutCouldScoreRuns(howout);
    const couldBeNoBall = () => typeof howout !== 'undefined' && domain.howoutCouldBeNoBall(howout);
    const couldBeWide = () => typeof howout !== 'undefined' && domain.howoutCouldBeWide(howout);

    const save = () => {
        nonDeliveryHowouts.find(h => h === howout)
            ? nonDeliveryWicket(howout)
            : delivery(deliveryOutcome, scores, deliveryWicket());

        props.history.push('/match/inprogress');
    };

    const canSave = () =>
        typeof howout !== 'undefined' &&
        ((domain.howoutRequiresFielder(howout) && typeof fielderIndex !== 'undefined') ||
            (!domain.howoutRequiresFielder(howout) && typeof fielderIndex === 'undefined'));

    const batterChange = (batterIndex: number) => {
        setBatterIndex(batterIndex);
        setHowout(undefined);
        setFielderIndex(undefined);
        setCrossed(false);
    };

    const howoutChange = (howout: domain.Howout | undefined) => {
        setHowout(howout);
        setFielderIndex(undefined);
        setCrossed(false);
        setDeliveryOutcome(domain.DeliveryOutcome.Valid);
    };

    const fielderChange = (fielderIndex: number) =>
        setFielderIndex(Number.isNaN(fielderIndex) ? undefined : fielderIndex);

    if (
        typeof props.inProgress.currentBatter === 'undefined' ||
        typeof props.inProgress.currentBowler === 'undefined'
    ) {
        return (
            <div className="alert alert-danger" role="alert">
                No current delivery
            </div>
        );
    }

    const battingTeam = getTeam(
        props.inProgress.match,
        (props.inProgress.currentInnings as domain.Innings).battingTeam,
    );
    const bowlingTeam = getTeam(
        props.inProgress.match,
        (props.inProgress.currentInnings as domain.Innings).bowlingTeam,
    );

    return (
        <Paper className={props.classes.root}>
            <EditForm heading="Wicket" save={save} canSave={canSave}>
                <DeliveryHeader
                    batter={battingTeam.players[props.inProgress.currentBatter.playerIndex]}
                    bowler={bowlingTeam.players[props.inProgress.currentBowler.playerIndex]}
                    battingPlayers={battingTeam.players}
                />
                <Entry
                    batters={batters()}
                    bowler={props.inProgress.currentBowler}
                    fielders={fielders()}
                    batterIndex={batterIndex}
                    howout={howout}
                    fielderIndex={fielderIndex}
                    crossed={crossed}
                    scores={scores}
                    batterChange={batterChange}
                    howoutChange={howoutChange}
                    fielderChange={fielderChange}
                    crossedChange={setCrossed}
                    scoresChange={setScores}
                    deliveryOutcomeChange={setDeliveryOutcome}
                    availableHowouts={getHowouts(batters()[batterIndex])}
                    fielderRequired={fielderRequired()}
                    couldCross={couldCross()}
                    couldScoreRuns={couldScoreRuns()}
                    couldBeNoBall={couldBeNoBall()}
                    couldBeWide={couldBeWide()}
                    deliveryOutcome={deliveryOutcome}
                    battingPlayers={battingTeam.players}
                />
            </EditForm>
        </Paper>
    );
};

export default withStyles(styles)(withRouter(Wicket));
