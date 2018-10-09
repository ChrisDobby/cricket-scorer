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

export interface DeliveryDisplayProps { outcome: Outcome; }

export class DeliveryDisplay extends React.Component<DeliveryDisplayProps, {}> {
    symbolCanvas: HTMLCanvasElement | undefined;

    getCanvas = (canvas: HTMLCanvasElement) => {
        this.symbolCanvas = canvas;
    }

    componentDidMount() {
        deliveryDrawCanvas.drawOutcome(this.symbolCanvas, this.props.outcome);
    }

    render() {
        return (
            <div
                style={this.props.outcome.deliveryOutcome === DeliveryOutcome.Noball ||
                    this.props.outcome.deliveryOutcome === DeliveryOutcome.Wide
                    ? noBallDisplayStyle
                    : validDisplayStyle}
            >
                <canvas ref={this.getCanvas} />
            </div>
        );
    }
}
