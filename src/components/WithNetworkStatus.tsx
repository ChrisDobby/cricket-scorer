import * as React from 'react';
import NetworkStatusContext from '../context/NetworkStatusContext';

export default (Component: any) => (props: any) => (
    <NetworkStatusContext.Consumer>{({
        status,
    }) =>
        <Component {...props} networkStatus={status} />
    }
    </NetworkStatusContext.Consumer>);
