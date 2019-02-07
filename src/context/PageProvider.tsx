import * as React from 'react';
import PageContext, { PageOptions } from './PageContext';

const defaultOptions: PageOptions = {
    title: 'Cricket scores live',
    stayWhenLoggingOut: false,
    showMatchesLink: false,
    button: undefined,
    openDrawer: undefined,
};

export default (props: any) => {
    const [options, setOptions] = React.useState(defaultOptions);

    const setPageOptions = (pageOptions?: any) => setOptions({ ...defaultOptions, ...pageOptions });

    return (
        <PageContext.Provider
            value={{
                ...options,
                setOptions: setPageOptions,
            }}
        >
            {props.children}
        </PageContext.Provider>
    );
};
