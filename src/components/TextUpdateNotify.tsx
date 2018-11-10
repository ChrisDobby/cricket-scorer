import * as React from 'react';

interface TextUpdateNotifyProps {
    text: string | undefined;
    highlightBackgroundColour?: string;
}

const defaultColour = '#9b34ee';
const textStyle: React.CSSProperties = {
    transition: 'background-color 1s',
};

export default class extends React.PureComponent<TextUpdateNotifyProps> {
    textComponent: HTMLSpanElement | null | undefined = undefined;

    showUpdate = () => {
        if (!this.textComponent) { return; }

        const originalColor = this.textComponent.style.backgroundColor;
        this.textComponent.style.backgroundColor = this.props.highlightBackgroundColour || defaultColour;
        setTimeout(
            () => {
                if (this.textComponent) {
                    this.textComponent.style.backgroundColor = originalColor;
                }
            },
            1000);
    }

    componentDidUpdate(prevProps: TextUpdateNotifyProps) {
        if (this.props.text !== prevProps.text) {
            this.showUpdate();
        }
    }

    render() {
        return <span style={textStyle} ref={c => this.textComponent = c}>{this.props.text}</span>;
    }
}
