import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import Batting from '../../../components/scorecard/Batting';

describe.skip('Batting', () => {
    beforeEach(cleanup);
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

        const { container } = render(
            <Batting batting={battingWithNoInnings} score={100} wickets={1} totalOvers={'20'} />,
        );

        expect(container).toMatchSnapshot();
    });
});
