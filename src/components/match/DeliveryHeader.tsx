import * as React from 'react';
import { Batter, Bowler } from '../../domain';
import * as globalStyles from '../styles';

const headerStyle: React.CSSProperties = {
    ...globalStyles.singleHeadingRow,
    marginBottom: '4px',
};

interface DeliveryHeaderProps {
    batter: Batter;
    bowler: Bowler;
}

export default ({ batter, bowler }: DeliveryHeaderProps) => (
    <div className="row" style={headerStyle}>
        <h4>{`${bowler.name} to ${batter.name}`}</h4>
    </div>);
