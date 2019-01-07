import * as React from 'react';
import WithAuth from './WithAuth';
import { OFFLINE } from '../context/networkStatus';
import { Profile } from '../domain';

interface WithRequireAuthProps {
    isAuthenticated: boolean;
    login: (ret?: string) => void;
    userProfile: Profile | undefined;
    offlineUser: Profile;
    status: string;
    location: Location;
}

export default (Component: any) => WithAuth((props: WithRequireAuthProps) => {
    const isLoginRequired = () => props.status !== OFFLINE && !props.isAuthenticated;
    const loginIfRequired = () => {
        if (!props.login) {
            return;
        }

        if (isLoginRequired()) {
            props.login(props.location.pathname);
        }
    };

    React.useEffect(loginIfRequired);

    if (!props.login) {
        return <div />;
    }

    if (isLoginRequired()) {
        return <div />;
    }

    return (
        <Component
            {...props}
            userProfile={!props.isAuthenticated ? props.offlineUser : props.userProfile}
        />);
});
