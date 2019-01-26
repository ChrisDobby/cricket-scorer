import * as React from 'react';
import MatchOnlineWarning from './MatchOnlineWarning';
import { OFFLINE } from '../../context/networkStatus';
import auth0 from '../auth0';
import NetworkStatusContext from '../../context/NetworkStatusContext';

interface WithNetworkStatusProps {
    isAuthenticated: boolean;
    location: Location;
}

const MatchWithNetworkStatus = (login: (path: string) => void) =>
    (Component: any) => (props: WithNetworkStatusProps) => {
        const { status } = React.useContext(NetworkStatusContext);
        const [showingOnlineWarning, setShowingOnlineWarning] = React.useState(false);
        const doLogin = () => {
            setShowingOnlineWarning(false);
            login(props.location.pathname);
        };

        React.useEffect(
            () => {
                if (showingOnlineWarning || props.isAuthenticated || status === OFFLINE) { return; }
                setShowingOnlineWarning(true);
            },
            [status]);

        return (
            <>
                <Component {...props} />
                {showingOnlineWarning &&
                    <MatchOnlineWarning login={doLogin} doNotLogin={() => setShowingOnlineWarning(false)} />}
            </>);

    };

export default MatchWithNetworkStatus(auth0.login);
