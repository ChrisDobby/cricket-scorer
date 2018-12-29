import * as React from 'react';

interface AuthCallbackProps {
    history: any;
    location: Location;
}

export default class extends React.Component<AuthCallbackProps> {
    async componentDidMount() {
        const auth0 = await import('./auth0');
        auth0.default.handleAuthentication(
            this.props.location,
            path => this.props.history.replace(path ? path : '/'),
        );
    }

    render() {
        return <div />;
    }
}
