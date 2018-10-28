import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import MatchStatus from './MatchStatus';
import aboutText from './aboutText';

const Logo = require('../../images/icon_512.png');

const styles = (theme: any) => ({
    rootStyle: {
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paperStyle: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        marginBottom: theme.spacing.unit * 4,
    },
    mainContentStyle: {
        padding: `${theme.spacing.unit * 6}px`,
        [theme.breakpoints.up('md')]: {
            paddingRight: 0,
        },
    },
    toolbar: theme.mixins.toolbar,
    logoStyle: {
        maxHeight: '200px',
        margin: '30px',
    },
    linkStyle: {
        color: theme.palette.primary.contrastText,
    },
    cardStyle: {
        display: 'flex',
    },
    cardDetailsStyle: {
        flex: 1,
    },
});

export default withStyles(styles)(class extends React.PureComponent<any> {
    state = { inProgressMatches: [] };

    async componentDidMount() {
        try {
            const inProgressMatches = await this.props.matchApi.getInProgressMatches();
            this.setState({ inProgressMatches });
        } catch (e) {
            this.setState({ inProgressMatches: [] });
        }
    }

    showScorecard = (id: string) => this.props.history.push(`/scorecard/${id}`);
    goToMatchCentre = () => this.props.history.push('/matchcentre');
    goToCreateMatch = () => this.props.history.push('/match/create');

    render() {
        return (
            <div className={this.props.classes.rootStyle}>
                <div className={this.props.classes.toolbar}>
                    {this.state.inProgressMatches.length > 0 &&
                        <MatchStatus
                            inProgressMatches={this.state.inProgressMatches}
                            showScorecard={this.showScorecard}
                        />}
                </div>
                <Paper className={this.props.classes.paperStyle}>
                    <Grid container>
                        <Grid item sm={6} style={{ textAlign: 'center' }}>
                            <img src={Logo} className={this.props.classes.logoStyle} />
                        </Grid>
                        <Grid item sm={6}>
                            <div className={this.props.classes.mainContentStyle}>
                                <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                                    Cricket scores live
                                </Typography>
                                {this.state.inProgressMatches.length === 0 &&
                                    <Typography variant="h5" color="inherit" paragraph>
                                        {'To look at the current matches or start a new match go to the '}
                                        <Link className={this.props.classes.linkStyle} to={'/matchcentre'}>
                                            Match Centre
                                        </Link>
                                    </Typography>}
                                {this.state.inProgressMatches.length > 0 &&
                                    <React.Fragment>
                                        <Typography variant="h5" color="inherit">
                                            {`There are ${this.state.inProgressMatches.length} matches in progress`}
                                        </Typography>
                                        <Typography variant="h5" color="inherit" paragraph>
                                            {'To view them or start a new match go to the '}
                                            <Link className={this.props.classes.linkStyle} to={'/matchcentre'}>
                                                Match Centre
                                            </Link>
                                        </Typography>
                                    </React.Fragment>}
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
                <Grid container spacing={40}>
                    <Grid item xs={12} md={6}>
                        <Card className={this.props.classes.cardStyle}>
                            <div className={this.props.classes.cardDetailsStyle}>
                                <CardContent>
                                    <Typography component="h2" variant="h5">
                                        About Cricket scores live
                                    </Typography>
                                    <Typography variant="subtitle1" paragraph>{aboutText}</Typography>
                                </CardContent>
                            </div>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card className={this.props.classes.cardStyle}>
                            <div className={this.props.classes.cardDetailsStyle}>
                                <CardContent>
                                    <Typography component="h2" variant="h5">
                                        Matches
                                    </Typography>
                                    {this.state.inProgressMatches.length > 0 &&
                                        <Typography variant="subtitle1" color="textSecondary">
                                            {`There are ${this.state.inProgressMatches.length} matches in progress`}
                                        </Typography>}
                                    <Typography variant="subtitle1">
                                        To see all of the current and past matches
                                    </Typography>
                                    <Button color="secondary" onClick={this.goToMatchCentre}>
                                        Go to the Match Centre
                                    </Button>
                                    <Typography variant="subtitle1">
                                        To start scoring a new match
                                    </Typography>
                                    <Button color="secondary" onClick={this.goToCreateMatch}>
                                        {`${this.props.isAuthenticated ? 'Create match' : 'Login and create match'}`}
                                    </Button>
                                </CardContent>
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </div>);
    }
});

