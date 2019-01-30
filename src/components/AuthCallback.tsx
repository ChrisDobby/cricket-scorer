import * as React from 'react';
import { History } from 'history';
import auth0 from './auth0';

interface AuthCallbackProps {
    history: History;
    location: Location;
}

export default (props: AuthCallbackProps) => {
    React.useEffect(() => {
        auth0.handleAuthentication(props.location, path => props.history.replace(path ? path : '/'));
    }, []);

    return <div />;
};
