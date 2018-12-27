import * as React from 'react';
import WithAuth from './WithAuth';
import { OFFLINE } from '../context/networkStatus';

export default (Component: any) => WithAuth(class extends React.PureComponent<any> {
    get loginRequired() {
        return this.props.status !== OFFLINE && !this.props.isAuthenticated;
    }

    loginIfRequired = () => {
        if (!this.props.login) {
            return;
        }

        if (this.loginRequired) {
            this.props.login(this.props.location.pathname);
        }
    }

    componentDidMount() {
        this.loginIfRequired();
    }

    componentDidUpdate() {
        this.loginIfRequired();
    }

    render() {
        if (!this.props.login) {
            return <div />;
        }

        if (this.loginRequired) {
            return <div />;
        }

        return (
            <Component
                {...this.props}
                userProfile={!this.props.isAuthenticated ? this.props.offlineUser : this.props.userProfile}
            />);
    }
});
