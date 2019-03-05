import * as React from 'react';
import HelpContext from '../context/HelpContext';
import IconButton from '@material-ui/core/IconButton';
import HelpOutline from '@material-ui/icons/HelpOutline';
import HelpTooltip from './HelpTooltip';
import HelpContent from './HelpContent';

export default () => {
    const { toggleVisible } = React.useContext(HelpContext);

    return (
        <HelpTooltip title={<HelpContent.CloseHelp />}>
            <IconButton style={{ marginRight: '8px', color: '#ffffff' }} onClick={toggleVisible}>
                <HelpOutline />
            </IconButton>
        </HelpTooltip>
    );
};
