import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { default as ReactSwipeableViews } from 'react-swipeable-views';
import { Match as MatchEntity } from '../../domain';
import Innings from './Innings';
import MatchHeading from './MatchHeading';
import { getTeam } from '../../match/utilities';
import { Button } from '@material-ui/core';
import { textCentre } from './styles';

const inningsNumberDescription = (innings: number): string => {
    const numberDescription = (): string => {
        switch (innings) {
        case 1:
            return '1st';
        case 2:
            return '2nd';
        case 3:
            return '3rd';
        default:
            return `${innings}th`;
        }
    };

    return `${numberDescription()} innings`;
};

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: '20px',
    },
});

interface ScorecardProps {
    cricketMatch: MatchEntity;
    lastEvent: string | undefined;
    classes: any;
    canContinue: boolean;
    continue: () => void;
}

class Scorecard extends React.Component<ScorecardProps, {}> {
    state = {
        selectedInningsIndex: this.props.cricketMatch && this.props.cricketMatch.innings.length > 0
            ? this.props.cricketMatch.innings.length - 1
            : -1,
    };

    inningsSelected = (event: any, index: number) => {
        this.changeIndex(index);
    }

    changeIndex = (index: number) => {
        this.setState({ selectedInningsIndex: index });
    }

    render() {
        return (
            <Paper className={this.props.classes.root} elevation={1}>
                <MatchHeading
                    homeTeam={this.props.cricketMatch.homeTeam.name}
                    awayTeam={this.props.cricketMatch.awayTeam.name}
                    date={this.props.cricketMatch.date}
                    matchStatus={this.props.cricketMatch.status}
                    lastEvent={this.props.lastEvent}
                />
                {this.props.canContinue &&
                    <div style={textCentre}>
                        <Button color="secondary" onClick={this.props.continue}>
                            Continue scoring
                        </Button>
                    </div>}
                <Divider />
                <Tabs
                    value={this.state.selectedInningsIndex}
                    onChange={this.inningsSelected}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    {this.props.cricketMatch.innings.map((_, index) => (
                        <Tab key={index} label={inningsNumberDescription(index + 1)} />
                    ))}
                </Tabs>
                <ReactSwipeableViews
                    index={this.state.selectedInningsIndex}
                    onChangeIndex={this.changeIndex}
                >
                    {this.props.cricketMatch.innings.map((inn, idx) => (
                        <Innings
                            key={idx}
                            innings={inn}
                            getTeam={type => getTeam(this.props.cricketMatch as MatchEntity, type)}
                        />
                    ))}
                </ReactSwipeableViews>
            </Paper>);
    }
}

export default withStyles(styles)(Scorecard);
