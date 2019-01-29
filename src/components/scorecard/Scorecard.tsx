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

export default withStyles(styles)((props: ScorecardProps) => {
    const [selectedInningsIndex, setSelectedInnings] = React.useState(
        props.cricketMatch && props.cricketMatch.innings.length > 0 ? props.cricketMatch.innings.length - 1 : -1,
    );

    return (
        <Paper className={props.classes.root} elevation={1}>
            <MatchHeading
                homeTeam={props.cricketMatch.homeTeam.name}
                awayTeam={props.cricketMatch.awayTeam.name}
                date={props.cricketMatch.date}
                matchStatus={props.cricketMatch.status}
                lastEvent={props.lastEvent}
            />
            {props.canContinue && (
                <div style={textCentre}>
                    <Button color="secondary" onClick={props.continue}>
                        Continue scoring
                    </Button>
                </div>
            )}
            <Divider />
            <Tabs
                value={selectedInningsIndex}
                onChange={(event, index) => setSelectedInnings(index)}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                {props.cricketMatch.innings.map((_, index) => (
                    <Tab key={index} label={inningsNumberDescription(index + 1)} />
                ))}
            </Tabs>
            <ReactSwipeableViews index={selectedInningsIndex} onChangeIndex={setSelectedInnings}>
                {props.cricketMatch.innings.map((inn, idx) => (
                    <Innings key={idx} innings={inn} getTeam={type => getTeam(props.cricketMatch, type)} />
                ))}
            </ReactSwipeableViews>
        </Paper>
    );
});
