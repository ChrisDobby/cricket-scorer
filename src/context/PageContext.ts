import * as React from 'react';

export type PageOptions = {
    stayWhenLoggingOut: boolean;
    title: string;
    showMatchesLink: boolean;
    button: ((props: any) => React.ReactNode) | undefined;
    openDrawer: (() => void) | undefined;
};

export default React.createContext({
    stayWhenLoggingOut: false,
    title: 'Cricket scores live',
    showMatchesLink: false,
    button: undefined as ((props: any) => React.ReactNode) | undefined,
    openDrawer: undefined as (() => void) | undefined,
    setOptions: (options?: any) => {},
});
