import * as React from 'react';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import WithMatchApi from '../components/WithMatchApi';
import WithInProgressMatches from '../components/WithInProgressMatches';
import { default as MatchCentreComponent } from '../components/MatchCentre';
import matchStorage from '../stores/matchStorage';
import fetchMatch from '../match/fetchMatch';
import PageContext from '../context/PageContext';

const createMatchRoute = '/match/create';
const getAddButton = (props: any) => (
    <Button
        variant="fab"
        color="secondary"
        onClick={() => props.history.push(createMatchRoute)}
    >
        <Add />
    </Button>);

export default WithInProgressMatches(WithMatchApi((props: any) => (
    <PageContext.Consumer>{({ setOptions }) =>
        <MatchCentreComponent
            {...props}
            storedMatch={matchStorage(localStorage).getMatch()}
            removeStoredMatch={matchStorage(localStorage).removeMatch}
            fetchMatch={fetchMatch(props.matchApi, matchStorage(localStorage))}
            removeMatch={props.matchApi.removeMatch}
            setPageOptions={() => setOptions({ stayWhenLoggingOut: true, title: 'Matches', button: getAddButton })}
        />}
    </PageContext.Consumer>)));
