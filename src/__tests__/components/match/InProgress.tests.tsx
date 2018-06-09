import * as React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';
import InProgress from '../../../components/match/InProgress';
import { blankMatch, matchWithStartedInnings, matchWithOverReadyToComplete } from '../../testData/matches';


describe('InProgress', () => {
    const noMatchProgress = {
        match: undefined,
        currentInnings: undefined,
        currentBatter: undefined,
        currentBowler: undefined,
        previousBowler: undefined,
        previousBowlerFromEnd: undefined,
        currentOver: undefined,
        currentOverComplete: undefined,
        startInnings: jest.fn(),
        newBowler: jest.fn(),
        delivery: jest.fn(),
        completeOver: jest.fn(),
        flipBatters: jest.fn(),
    };

    const notStartedMatchProgress = {
        ...noMatchProgress,
        match: blankMatch,
    };

    const matchWithStartedInningsProgress = {
        ...notStartedMatchProgress,
        match: matchWithStartedInnings,
        currentInnings: matchWithStartedInnings.innings[0],
    };

    const matchDuringOverProgress = {
        ...matchWithStartedInningsProgress,
        match: matchWithOverReadyToComplete,
        currentInnings: matchWithOverReadyToComplete.innings[0],
        currentBatter: matchWithOverReadyToComplete.innings[0].batting.batters[0],
        currentBowler: matchWithOverReadyToComplete.innings[0].bowlers[0],
        currentOver: {
            bowlingRuns: 0,
            wickets: 0,
            deliveries: [],
        },
    };

    it('should render correctly when no match', () => {
        const inProgress = ReactTestRenderer.create(<InProgress inProgress={noMatchProgress} />);

        expect(inProgress.toJSON()).toMatchSnapshot();
    });

    it('should render correctly for match that has not started', () => {
        const inProgress = ReactTestRenderer.create(<InProgress inProgress={notStartedMatchProgress} />);

        expect(inProgress.toJSON()).toMatchSnapshot();
    });

    it('should render correctly for match with started innings', () => {
        const inProgress = ReactTestRenderer.create(<InProgress inProgress={matchWithStartedInningsProgress} />);

        expect(inProgress.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when there is a previous bowler', () => {
        const withPreviousBowler = {
            ...matchWithStartedInningsProgress,
            previousBowler: matchWithOverReadyToComplete.innings[0].bowlers[0],
        };

        const inProgress = ReactTestRenderer.create(<InProgress inProgress={withPreviousBowler} />);

        expect(inProgress.toJSON()).toMatchSnapshot();
    });

    it('should render correctly when there is a previous bowler from the current end', () => {
        const withPreviousBowlerFromEnd = {
            ...matchWithStartedInningsProgress,
            previousBowlerFromEnd: matchWithOverReadyToComplete.innings[0].bowlers[0],
        };

        const inProgress = ReactTestRenderer.create(<InProgress inProgress={withPreviousBowlerFromEnd} />);

        expect(inProgress.toJSON()).toMatchSnapshot();
    });

    it('should render correctly for match during an over', () => {
        const inProgress = ReactTestRenderer.create(<InProgress inProgress={matchDuringOverProgress} />);

        expect(inProgress.toJSON()).toMatchSnapshot();
    });
});
