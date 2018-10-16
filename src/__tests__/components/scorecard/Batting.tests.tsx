import * as React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';
import Batting from '../../../components/scorecard/Batting';

describe('Batting', () => {
    const batting = {
        extras: {
            byes: 0,
            legByes: 0,
            noBalls: 0,
            wides: 0,
            penaltyRuns: 0,
        },
    };

    it('should render correctly when batter has no innings', () => {
        const battingWithNoInnings = {
            ...batting,
            batters: [
                {
                    position: 1,
                    name: 'A Player',
                    playerIndex: 0,
                },
            ],
        };

        const battingView = ReactTestRenderer
            .create(<Batting batting={battingWithNoInnings} score={100} wickets={1} totalOvers={'20'} />);

        expect(battingView.toJSON()).toMatchSnapshot();
    });
});
