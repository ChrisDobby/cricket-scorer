import * as React from 'react';
import MatchNetworkStatusDialog from './MatchNetworkStatusDialog';

export default (Component: any) => (props: any) => {
    const [showDialog, setShowDialog] = React.useState(false);
    const intialised = React.useRef(false);

    React.useEffect(() => {
        if (intialised.current && props.isAuthenticated) {
            setShowDialog(true);
        }

        intialised.current = true;
    }, [props.status]);

    return (
        <>
            <Component {...props} />
            {showDialog && <MatchNetworkStatusDialog status={props.status} close={() => setShowDialog(false)} />}
        </>
    );
};
