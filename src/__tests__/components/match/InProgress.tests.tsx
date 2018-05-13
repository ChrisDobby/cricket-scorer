import * as React from 'react';
import * as ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import InProgress from '../../../components/match/InProgress';
import { match as matchReducer } from '../../../reducers/matchReducer';
import { blankMatch, matchWithStartedInnings } from '../../testData/matches';

describe('InProgress', () => {
    it('should render correctly for match that hasn not started', () => {
        const store = createStore(matchReducer, { match: blankMatch });
        const inProgress = ReactTestRenderer.create(<Provider store={store}><InProgress /></Provider>);

        expect(inProgress.toJSON()).toMatchSnapshot();
    });

    it('should render correctly for match with started innings', () => {
        const store = createStore(
            matchReducer,
            { match: matchWithStartedInnings, currentInnings: matchWithStartedInnings.innings[0] },
        );
        const inProgress = ReactTestRenderer.create(<Provider store={store}><InProgress /></Provider>);

        expect(inProgress.toJSON()).toMatchSnapshot();
    });
});
