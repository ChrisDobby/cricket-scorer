import * as React from 'react';
import { Delivery } from '../../domain';
import { DeliveryDisplay } from './DeliveryDisplay';

const overRowStyle: React.CSSProperties = {
    paddingLeft: '20px',
};

export interface CurrentOverProps { deliveries: Delivery[]; }

export const CurrentOver = ({ deliveries }: CurrentOverProps) => (
    <div>
        <div className="row">
            <div className="col-12"><h6>This over</h6></div>
        </div>
        <div className="row" style={overRowStyle}>
            {deliveries.map((delivery, index) => <DeliveryDisplay key={index} outcome={delivery.outcome} />)}
        </div>
    </div>
);
