import * as React from 'react';
import Card from '../components/scorecard/Card';
import matchStorage from '../stores/matchStorage';
import fetchMatch from '../match/fetchMatch';
import WithMatchApi from '../components/WithMatchApi';
import liveUpdates, { UpdateType } from '../liveUpdates';
import PageContext from '../context/PageContext';

const updates = liveUpdates(process.env.API_URL as string, UpdateType.Scorecard);
const matchUser = (match: any) => match.user;

export default WithMatchApi((props: any) => {
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(
        () =>
            setOptions({
                stayWhenLoggingOut: true,
                title: 'Cricket scores live',
                button: undefined,
                openDrawer: undefined,
            }),
        [],
    );

    return (
        <Card
            {...props}
            fetchMatch={fetchMatch(props.matchApi, matchStorage(localStorage))}
            matchUser={matchUser}
            updates={updates}
            getStoredMatch={matchStorage(localStorage).getMatch}
        />
    );
});
