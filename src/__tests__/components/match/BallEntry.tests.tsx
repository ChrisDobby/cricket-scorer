import * as React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';
import * as matches from '../../testData/matches';
import { BallEntry } from '../../../components/match/BallEntry';

describe('BallEntry', () => {
    const ballFunctions = {
        delivery: jest.fn(),
        completeOver: jest.fn(),
        changeEnds: jest.fn(),
    };

    it('should render correctly', () => {
        const ballEntry = ReactTestRenderer.create(
            <BallEntry
                innings={matches.inningsWithStartedOver}
                batter={matches.inningsWithStartedOver.batting.batters[0]}
                bowler={matches.inningsWithStartedOver.bowlers[0]}
                overComplete={false}
                currentOver={{ bowlingRuns: 0, wickets: 0, deliveries: matches.inningsWithStartedOver.deliveries }}
                ballFunctions={ballFunctions}
            />);

        expect(ballEntry.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when over complete', () => {
        const ballEntry = ReactTestRenderer.create(
            <BallEntry
                innings={matches.inningsWithStartedOver}
                batter={matches.inningsWithStartedOver.batting.batters[0]}
                bowler={matches.inningsWithStartedOver.bowlers[0]}
                overComplete={true}
                currentOver={{ bowlingRuns: 0, wickets: 0, deliveries: matches.inningsWithStartedOver.deliveries }}
                ballFunctions={ballFunctions}
            />);

        expect(ballEntry.toJSON()).toMatchSnapshot();
    });
});
