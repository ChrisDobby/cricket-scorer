import * as React from 'react';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import WithNavBar from '../components/WithNavBar';
import WithMatchApi from '../components/WithMatchApi';
import { default as MatchCentreComponent } from '../components/MatchCentre';
import matchStorage from '../stores/matchStorage';

const MatchCentre = (props: any) => (
    <MatchCentreComponent {...props} storedMatch={matchStorage(localStorage).getMatch()} />);

const createMatchRoute = '/match/create';

const getAddButton = (props: any) => (
    <Button
        variant="fab"
        color="secondary"
        onClick={() => props.history.push(createMatchRoute)}
    >
        <Add />
    </Button>);

export default
    WithNavBar({ stayWhenLoggingOut: true, title: 'Matches', button: getAddButton })(WithMatchApi(MatchCentre));
