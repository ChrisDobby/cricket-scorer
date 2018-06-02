import * as React from 'react';
import { Over } from '../../domain';
import { DeliveryDisplay } from './DeliveryDisplay';

const overRowStyle: React.CSSProperties = {
    paddingLeft: '20px',
};

export interface CurrentOverProps { over: Over; }

export const CurrentOver = ({ over }: CurrentOverProps) => (
    <div>
        <div className="row">
            <div className="col-12"><h6>{`This over ${over.wickets} - ${over.bowlingRuns}`}</h6></div>
        </div>
        <div className="row" style={overRowStyle}>
            {over.deliveries.map((delivery, index) => <DeliveryDisplay key={index} outcome={delivery.outcome} />)}
        </div>
    </div>
);
