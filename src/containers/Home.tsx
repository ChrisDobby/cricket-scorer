import * as React from 'react';
import { default as HomeComponent } from '../components/Home';
import matchStorage from '../stores/matchStorage';
import fetchMatch from '../match/fetchMatch';
import PageContext from '../context/PageContext';
import WithMatchApi from '../components/WithMatchApi';

export default WithMatchApi((props: any) => {
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(() => setOptions({ showMatchesLink: true }), []);

    return (
        <HomeComponent
            {...props}
            storedMatch={matchStorage(localStorage).getMatch()}
            fetchMatch={fetchMatch(props.matchApi, matchStorage(localStorage))}
        />
    );
});
