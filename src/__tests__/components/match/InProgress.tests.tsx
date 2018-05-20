import * as React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';
import InProgress from '../../../components/match/InProgress';
import { blankMatch, matchWithStartedInnings } from '../../testData/matches';
import inProgressMatchStore from '../../../stores/inProgressMatchStore';


describe('InProgress', () => {
    it('should render correctly for match that hasn not started', () => {
        inProgressMatchStore.match = blankMatch;
        const inProgress = ReactTestRenderer.create(<InProgress inProgress={inProgressMatchStore} />);

        expect(inProgress.toJSON()).toMatchSnapshot();
    });

    it('should render correctly for match with started innings', () => {
        const inProgressMatchWithStartedInnings = {
            ...matchWithStartedInnings,
            currentInnings: matchWithStartedInnings.innings[0],
        };
        inProgressMatchStore.match = inProgressMatchWithStartedInnings;

        const inProgress = ReactTestRenderer.create(<InProgress inProgress={inProgressMatchStore} />);

        expect(inProgress.toJSON()).toMatchSnapshot();
    });
});
