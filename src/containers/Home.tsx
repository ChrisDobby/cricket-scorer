import * as React from 'react';
import WithNavBar from '../components/WithNavBar';
import WithInProgressMatches from '../components/WithInProgressMatches';
import WithOutOfDateMatches from '../components/WithOutOfDateMatches';
import WithMatchApi from '../components/WithMatchApi';
import { default as HomeComponent } from '../components/Home';
import matchStorage from '../stores/matchStorage';
import fetchMatch from '../match/fetchMatch';

const Home = WithMatchApi((props: any) => (
    <HomeComponent
        {...props}
        storedMatch={matchStorage(localStorage).getMatch()}
        fetchMatch={fetchMatch(props.matchApi, matchStorage(localStorage))}
    />));

export default WithOutOfDateMatches(WithNavBar({})(
    WithInProgressMatches(Home),
));
