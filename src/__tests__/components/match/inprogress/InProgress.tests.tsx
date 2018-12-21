import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import { StaticRouter } from 'react-router';
import InProgress from '../../../../components/match/inprogress/InProgress';
import { blankMatch, matchWithStartedInnings, matchWithOverReadyToComplete } from '../../../testData/matches';

describe('InProgress', () => {
    beforeEach(cleanup);

    const noMatchProgress = {
        match: undefined,
        currentInnings: undefined,
        currentBatter: undefined,
        currentBowler: undefined,
        previousBowler: undefined,
        previousBowlerFromEnd: undefined,
        currentOver: undefined,
        currentOverComplete: undefined,
        canSelectBattingTeamForInnings: false,
        provisionalMatchComplete: false,
        newBatterRequired: false,
        startInnings: jest.fn(),
        newBowler: jest.fn(),
        newBatter: jest.fn(),
        delivery: jest.fn(),
        undoPreviousDelivery: jest.fn(),
        completeOver: jest.fn(),
        flipBatters: jest.fn(),
        completeInnings: jest.fn(),
        completeMatch: jest.fn(),
        nonDeliveryWicket: jest.fn(),
        batterUnavailable: jest.fn(),
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

    const storeMatch = jest.fn();

    it('should render correctly when no match', () => {
        const { container } = render(
            <StaticRouter context={{}}>
                <InProgress inProgress={noMatchProgress} storeMatch={storeMatch} />
            </StaticRouter>);

        expect(container).toMatchSnapshot();
    });

    it('should render correctly for match that has not started', () => {
        const { container } = render(
            <StaticRouter context={{}}>
                <InProgress
                    inProgress={notStartedMatchProgress}
                    storeMatch={storeMatch}
                />
            </StaticRouter>);

        expect(container).toMatchSnapshot();
    });

    it('should render correctly for match with started innings', () => {
        const { container } = render(
            <StaticRouter context={{}}>
                <InProgress
                    inProgress={matchWithStartedInningsProgress}
                    storeMatch={storeMatch}
                />
            </StaticRouter>);

        expect(container).toMatchSnapshot();
    });

    it('should render correctly when there is a previous bowler', () => {
        const withPreviousBowler = {
            ...matchWithStartedInningsProgress,
            previousBowler: matchWithOverReadyToComplete.innings[0].bowlers[0],
        };

        const { container } = render(
            <StaticRouter context={{}}>
                <InProgress inProgress={withPreviousBowler} storeMatch={storeMatch} />
            </StaticRouter>);

        expect(container).toMatchSnapshot();
    });

    it('should render correctly when there is a previous bowler from the current end', () => {
        const withPreviousBowlerFromEnd = {
            ...matchWithStartedInningsProgress,
            previousBowlerFromEnd: matchWithOverReadyToComplete.innings[0].bowlers[0],
        };

        const { container } = render(
            <StaticRouter context={{}}>
                <InProgress
                    inProgress={withPreviousBowlerFromEnd}
                    storeMatch={storeMatch}
                />
            </StaticRouter>);

        expect(container).toMatchSnapshot();
    });

    it('should render correctly for match during an over', () => {
        const { container } = render(
            <StaticRouter context={{}}>
                <InProgress
                    inProgress={matchDuringOverProgress}
                    storeMatch={storeMatch}
                />
            </StaticRouter>);

        expect(container).toMatchSnapshot();
    });
});
