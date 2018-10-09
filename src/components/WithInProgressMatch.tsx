import * as React from 'react';

export default (Component: any) => class extends React.PureComponent<any> {
    componentDidMount() {
        if (typeof this.props.inProgressMatchStore === 'undefined' ||
            typeof this.props.inProgressMatchStore.match === 'undefined') {
            this.props.history.replace('/match/create');
        }
    }

    render() {
        if (typeof this.props.inProgressMatchStore === 'undefined' ||
            typeof this.props.inProgressMatchStore.match === 'undefined') {
            return null;
        }

        return <Component {...this.props} />;
    }
};
