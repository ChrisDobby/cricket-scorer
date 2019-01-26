import * as React from 'react';
import WithInProgressMatches from '../components/WithInProgressMatches';
import WithMatchApi from '../components/WithMatchApi';
import { default as HomeComponent } from '../components/Home';
import matchStorage from '../stores/matchStorage';
import fetchMatch from '../match/fetchMatch';
import PageContext from '../context/PageContext';

const Home = WithMatchApi((props: any) => {
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(setOptions, []);

    return (
        <HomeComponent
            {...props}
            storedMatch={matchStorage(localStorage).getMatch()}
            fetchMatch={fetchMatch(props.matchApi, matchStorage(localStorage))}
        />);
});

export default WithInProgressMatches(Home);
