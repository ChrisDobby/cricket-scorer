import * as React from 'react';
import HelpContext from './HelpContext';

export default (props: any) => {
    const [visible, setVisible] = React.useState(false);
    const toggleVisible = () => setVisible(!visible);

    return <HelpContext.Provider value={{ visible, toggleVisible }}>{props.children}</HelpContext.Provider>;
};
