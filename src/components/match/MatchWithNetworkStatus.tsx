import * as React from 'react';
import WithNetworkStatus from '../WithNetworkStatus';
import MatchOnlineWarning from './MatchOnlineWarning';
import { OFFLINE } from '../../context/networkStatus';
import auth0 from '../auth0';

interface WithNetworkStatusProps {
    isAuthenticated: boolean;
    networkStatus: string;
    location: Location;
}

const MatchWithNetworkStatus = (login: (path: string) => void) =>
    (Component: any) => WithNetworkStatus((props: WithNetworkStatusProps) => {
        const [showingOnlineWarning, setShowingOnlineWarning] = React.useState(false);
        const doLogin = () => {
            setShowingOnlineWarning(false);
            login(props.location.pathname);
        };

        React.useEffect(
            () => {
                if (showingOnlineWarning || props.isAuthenticated || props.networkStatus === OFFLINE) { return; }
                setShowingOnlineWarning(true);
            },
            [props.networkStatus]);

        return (
            <>
                <Component {...props} />
                {showingOnlineWarning &&
                    <MatchOnlineWarning login={doLogin} doNotLogin={() => setShowingOnlineWarning(false)} />}
            </>);

    });

export default MatchWithNetworkStatus(auth0.login);
