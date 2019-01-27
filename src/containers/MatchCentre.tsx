import * as React from 'react';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import WithMatchApi from '../components/WithMatchApi';
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

export default WithMatchApi((props: any) => {
    const { setOptions } = React.useContext(PageContext);
    React.useEffect(
        () => setOptions({ stayWhenLoggingOut: true, title: 'Matches', button: getAddButton }),
        []);

    return (
        <MatchCentreComponent
            {...props}
            fetchMatch={fetchMatch(props.matchApi, matchStorage(localStorage))}
        />);
});
