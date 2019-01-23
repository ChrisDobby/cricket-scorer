import * as React from 'react';
import { History } from 'history';

interface AuthCallbackProps {
    history: History;
    location: Location;
}

export default (props: AuthCallbackProps) => {
    React.useEffect(
        () => {
            import('./auth0')
                .then(auth0 =>
                    auth0.default.handleAuthentication(
                        props.location,
                        path => props.history.replace(path ? path : '/'),
                    ));
        },
        []);

    return <div />;
};
