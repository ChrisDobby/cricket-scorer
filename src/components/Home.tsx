import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { History } from 'history';
import { Link } from 'react-router-dom';
import MatchStatus from './MatchStatus';
import aboutText from './aboutText';
import homePageStyles from './homePageStyles';
import { ONLINE } from '../context/networkStatus';
import { StoredMatch, Profile } from '../domain';
import useInProgressMatches from './useInProgressMatches';
import outOfDate from '../match/outOfDate';

const Logo = require('../../images/icon_192.png');

interface HomeProps {
    storedMatch: StoredMatch;
    userProfile: Profile;
    isAuthenticated: boolean;
    canAuthenticate: boolean;
    status: string;
    history: History;
    classes: any;
    fetchMatch: (id: string) => Promise<void>;
}

export default withStyles(homePageStyles)((props: HomeProps) => {
    const canContinueCurrentMatch =
        props.storedMatch &&
        !props.storedMatch.match.complete &&
        !outOfDate(props.storedMatch.match.date) &&
        props.userProfile.id === props.storedMatch.match.user;
    const showScorecard = (id: string | undefined) => props.history.push(`/scorecard${id ? `/${id}` : ''}`);

    const goToMatchCentre = () => props.history.push('/matchcentre');
    const goToCreateMatch = () => props.history.push('/match/create');
    const continueScoring = async () => {
        if (typeof props.storedMatch.match.id !== 'undefined' && props.status === ONLINE) {
            await props.fetchMatch(props.storedMatch.match.id);
        }

        props.history.push('/match/inprogress');
    };
    const [inProgressMatches] = useInProgressMatches(props.status, props.userProfile);

    return (
        <div className={props.classes.rootStyle}>
            <div className={props.classes.toolbar}>
                {inProgressMatches.length > 0 && (
                    <MatchStatus inProgressMatches={inProgressMatches} showScorecard={showScorecard} />
                )}
            </div>
            <Paper className={props.classes.paperStyle}>
                <Grid container>
                    <Grid item sm={6} style={{ textAlign: 'center' }}>
                        <img src={Logo} alt="cricket scorer" className={props.classes.logoStyle} />
                    </Grid>
                    <Grid item sm={6}>
                        <div className={props.classes.mainContentStyle}>
                            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                                Cricket scorer
                            </Typography>
                            {inProgressMatches.length === 0 && (
                                <Typography variant="h5" color="inherit" paragraph>
                                    {'To look at the current matches or start a new match go to the '}
                                    <Link className={props.classes.linkStyle} to={'/matchcentre'}>
                                        Match Centre
                                    </Link>
                                </Typography>
                            )}
                            {inProgressMatches.length > 0 && (
                                <>
                                    <Typography variant="h5" color="inherit">
                                        {`There are ${inProgressMatches.length} matches in progress`}
                                    </Typography>
                                    <Typography variant="h5" color="inherit" paragraph>
                                        {'To view them or start a new match go to the '}
                                        <Link className={props.classes.linkStyle} to={'/matchcentre'}>
                                            Match Centre
                                        </Link>
                                    </Typography>
                                </>
                            )}
                        </div>
                    </Grid>
                </Grid>
            </Paper>
            <Grid container spacing={40}>
                <Grid item xs={12} md={6}>
                    <Card className={props.classes.cardStyle}>
                        <div className={props.classes.cardDetailsStyle}>
                            <CardContent>
                                <Typography component="h2" variant="h5">
                                    About Cricket scorer
                                </Typography>
                                <Typography variant="subtitle1" paragraph>
                                    {aboutText}
                                </Typography>
                            </CardContent>
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card className={props.classes.cardStyle}>
                        <div className={props.classes.cardDetailsStyle}>
                            <CardContent>
                                <Typography component="h2" variant="h5">
                                    Matches
                                </Typography>
                                {inProgressMatches.length > 0 && (
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {`There are ${inProgressMatches.length} matches in progress`}
                                    </Typography>
                                )}
                                {canContinueCurrentMatch && (
                                    <>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            {`You were scoring the match ${props.storedMatch.match.homeTeam.name}` +
                                                ` v ${props.storedMatch.match.awayTeam.name}`}
                                        </Typography>
                                        <Button color="primary" onClick={continueScoring}>
                                            Continue scoring
                                        </Button>
                                    </>
                                )}
                                <Typography variant="subtitle1">To see all of the current and past matches</Typography>
                                <Button color="primary" onClick={goToMatchCentre}>
                                    Go to the Match Centre
                                </Button>
                                <Typography variant="subtitle1">To start scoring a new match</Typography>
                                <Button color="primary" onClick={goToCreateMatch}>
                                    Create match
                                </Button>
                            </CardContent>
                        </div>
                    </Card>
                </Grid>
            </Grid>
            <footer style={{ bottom: 0 }}>
                <Typography variant="subtitle2" color="inherit">
                    {'Icons made by '}
                    <a href="http://www.freepik.com" title="Freepik">
                        Freepik
                    </a>
                    {' from '}
                    <a href="https://www.flaticon.com/" title="Flaticon">
                        www.flaticon.com
                    </a>
                    {' is licensed by '}
                    <a
                        href="http://creativecommons.org/licenses/by/3.0/"
                        title="Creative Commons BY 3.0"
                        target="_blank"
                        rel="noreferrer"
                    >
                        CC 3.0 BY
                    </a>
                </Typography>
            </footer>
        </div>
    );
});
