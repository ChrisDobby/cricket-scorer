import * as React from 'react';

export type PageOptions = {
    stayWhenLoggingOut: boolean;
    title: string;
    button: ((props: any) => React.ReactNode) | undefined;
};

export default React.createContext({
    stayWhenLoggingOut: false,
    title: 'Cricket scores live',
    button: undefined as ((props: any) => React.ReactNode) | undefined,
    setOptions: (options?: PageOptions) => { },
});
