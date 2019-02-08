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
                    playerIndex: 0,
                },
            ],
        };

        const { container } = render(
            <Batting
                batting={battingWithNoInnings}
                battingTeamPlayers={['A Player']}
                getBowlerAtIndex={() => 'A player'}
                getFielderAtIndex={() => 'A player'}
                sameBowlerAndFielder={() => false}
                score={100}
                wickets={1}
                totalOvers={'20'}
                calculateMinutes={() => 1}
            />,
        );

        expect(container).toMatchSnapshot();
    });
});
