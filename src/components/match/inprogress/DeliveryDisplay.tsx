import * as React from 'react';
import { Outcome, DeliveryOutcome } from '../../../domain';
import deliveryDrawCanvas from './deliveryDrawCanvas';

const displayStyle: React.CSSProperties = {
    width: '30px',
    height: '30px',
    marginRight: '4px',
    color: '#ffffff',
    display: 'inline-block',
    borderRadius: '4px',
    fontSize: '14px',
};

const validDisplayStyle: React.CSSProperties = {
    ...displayStyle,
    backgroundColor: '#28a745',
};

const noBallDisplayStyle: React.CSSProperties = {
    ...displayStyle,
    backgroundColor: '#dc3545',
};

interface DeliveryDisplayProps {
    outcome: Outcome;
}

export default (props: DeliveryDisplayProps) => {
    const symbolCanvas = React.useRef(null as HTMLCanvasElement | null);

    React.useEffect(() => {
        if (symbolCanvas.current) {
            deliveryDrawCanvas.drawOutcome(symbolCanvas.current, props.outcome);
        }
    }, []);

    return (
        <div
            style={
                props.outcome.deliveryOutcome === DeliveryOutcome.Noball ||
                props.outcome.deliveryOutcome === DeliveryOutcome.Wide
                    ? noBallDisplayStyle
                    : validDisplayStyle
            }
        >
            <canvas width={30} height={30} ref={symbolCanvas} />
        </div>
    );
};
