import * as React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { default as ReactSwipeableViews } from 'react-swipeable-views';
import { Match, BattingInnings, Innings as MatchInnings } from '../../domain';
import Innings from './Innings';
import { getTeam } from '../../match/utilities';
import getPlayers from '../../match/getPlayers';
import battingMinutes from '../../match/innings/battingMinutes';

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

interface InningsTabsProps {
    match: Match;
}

export default (props: InningsTabsProps) => {
    const [selectedInningsIndex, setSelectedInnings] = React.useState(
        props.match && props.match.innings.length > 0 ? props.match.innings.length - 1 : -1,
    );

    const get = (innings: MatchInnings) => getPlayers(props.match, innings);
    const calculateMinutes = (innings: BattingInnings) =>
        battingMinutes(() => new Date().getTime())(
            innings,
            props.match.breaks,
            props.match.innings[selectedInningsIndex].completeTime,
        );

    return (
        <>
            <Tabs
                value={selectedInningsIndex}
                onChange={(event, index) => setSelectedInnings(index)}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                {props.match.innings.map((_, index) => (
                    <Tab key={index} label={inningsNumberDescription(index + 1)} />
                ))}
            </Tabs>
            <ReactSwipeableViews index={selectedInningsIndex} onChangeIndex={setSelectedInnings}>
                {props.match.innings.map((inn, idx) => (
                    <Innings
                        key={idx}
                        innings={inn}
                        getTeam={type => getTeam(props.match, type)}
                        getBowlerAtIndex={get(inn).getBowlerAtIndex}
                        getFielderAtIndex={get(inn).getFielderAtIndex}
                        sameBowlerAndFielder={get(inn).sameBowlerAndFielder}
                        calculateMinutes={calculateMinutes}
                    />
                ))}
            </ReactSwipeableViews>
        </>
    );
};
