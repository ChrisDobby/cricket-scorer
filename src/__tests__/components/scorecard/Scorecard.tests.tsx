import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import Scorecard from '../../../components/scorecard/Scorecard';
import { Innings, InningsStatus, TeamType } from '../../../domain';
import { match } from '../../testData/testMatch';

describe.skip('Scorecard', () => {
    beforeEach(cleanup);

    it('should render correctly', () => {
        const { container } = render(
            <Scorecard cricketMatch={match} canContinue={false} continue={jest.fn()} lastEvent={undefined} />,
        );
        expect(container).toMatchSnapshot();
    });

    it('should render correctly when match has four innings', () => {
        const thirdInnings: Innings = {
            battingTeam: TeamType.HomeTeam,
            bowlingTeam: TeamType.AwayTeam,
            score: 0,
            wickets: 0,
            completedOvers: 0,
            totalOvers: '0',
            events: [],
            status: InningsStatus.InProgress,
            batting: {
                extras: {
                    byes: 0,
                    legByes: 0,
                    noBalls: 0,
                    wides: 0,
                    penaltyRuns: 0,
                },
                batters: [],
            },
            bowlers: [],
            fallOfWickets: [],
        };
        const fourthInnings: Innings = {
            battingTeam: TeamType.AwayTeam,
            bowlingTeam: TeamType.HomeTeam,
            score: 0,
            wickets: 0,
            completedOvers: 0,
            totalOvers: '0',
            events: [],
            status: InningsStatus.InProgress,
            batting: {
                extras: {
                    byes: 0,
                    legByes: 0,
                    noBalls: 0,
                    wides: 0,
                    penaltyRuns: 0,
                },
                batters: [],
            },
            bowlers: [],
            fallOfWickets: [],
        };
        const fourInningsMatch = {
            ...match,
            innings: [...match.innings, thirdInnings, fourthInnings],
        };

        const { container } = render(
            <Scorecard
                cricketMatch={fourInningsMatch}
                canContinue={false}
                continue={jest.fn()}
                lastEvent={undefined}
            />,
        );
        expect(container).toMatchSnapshot();
    });
});
