import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import { StaticRouter } from 'react-router';
import InProgress from '../../../../components/match/inprogress/InProgress';
import { blankMatch, matchWithStartedInnings, matchWithOverReadyToComplete } from '../../../testData/matches';

describe.skip('InProgress', () => {
    beforeEach(cleanup);

    const userProfile = { id: 'TestUser', name: 'a test user' };
    const defaultProgress = {
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
        startMatch: jest.fn(),
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
        setFromStoredMatch: jest.fn(),
        changeOrders: jest.fn(),
        rolledBackInnings: jest.fn(),
        rollback: jest.fn(),
        updateOvers: jest.fn(),
        startBreak: jest.fn(),
        undoToss: jest.fn(),
        updateTeams: jest.fn(),
        changeBowler: jest.fn(),
        version: 1,
    };

    const notStartedMatchProgress = {
        ...defaultProgress,
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

    it('should render correctly for match that has not started', () => {
        const { container } = render(
            <StaticRouter context={{}}>
                <InProgress inProgress={notStartedMatchProgress} storeMatch={storeMatch} userProfile={userProfile} />
            </StaticRouter>,
        );

        expect(container).toMatchSnapshot();
    });

    it('should render correctly for match with started innings', () => {
        const { container } = render(
            <StaticRouter context={{}}>
                <InProgress
                    inProgress={matchWithStartedInningsProgress}
                    storeMatch={storeMatch}
                    userProfile={userProfile}
                />
            </StaticRouter>,
        );

        expect(container).toMatchSnapshot();
    });

    it('should render correctly when there is a previous bowler', () => {
        const withPreviousBowler = {
            ...matchWithStartedInningsProgress,
            previousBowler: matchWithOverReadyToComplete.innings[0].bowlers[0],
        };

        const { container } = render(
            <StaticRouter context={{}}>
                <InProgress inProgress={withPreviousBowler} storeMatch={storeMatch} userProfile={userProfile} />
            </StaticRouter>,
        );

        expect(container).toMatchSnapshot();
    });

    it('should render correctly when there is a previous bowler from the current end', () => {
        const withPreviousBowlerFromEnd = {
            ...matchWithStartedInningsProgress,
            previousBowlerFromEnd: matchWithOverReadyToComplete.innings[0].bowlers[0],
        };

        const { container } = render(
            <StaticRouter context={{}}>
                <InProgress inProgress={withPreviousBowlerFromEnd} storeMatch={storeMatch} userProfile={userProfile} />
            </StaticRouter>,
        );

        expect(container).toMatchSnapshot();
    });

    it('should render correctly for match during an over', () => {
        const { container } = render(
            <StaticRouter context={{}}>
                <InProgress inProgress={matchDuringOverProgress} storeMatch={storeMatch} userProfile={userProfile} />
            </StaticRouter>,
        );

        expect(container).toMatchSnapshot();
    });
});
