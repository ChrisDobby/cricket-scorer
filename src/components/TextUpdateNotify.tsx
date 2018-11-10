import * as React from 'react';

interface TextUpdateNotifyProps {
    text: string;
    highlightBackgroundColour: string;
}

const textStyle: React.CSSProperties = {
    transition: 'background-color 1s',
};

export default class extends React.PureComponent<TextUpdateNotifyProps> {
    textComponent: HTMLSpanElement | null | undefined = undefined;

    showUpdate = () => {
        if (!this.textComponent) { return; }

        const original = {
            backgroundColor: this.textComponent.style.backgroundColor,
            fontWeight: this.textComponent.style.fontWeight,
        };
        this.textComponent.style.backgroundColor = this.props.highlightBackgroundColour;
        this.textComponent.style.fontWeight = '700';
        setTimeout(
            () => {
                if (this.textComponent) {
                    this.textComponent.style.backgroundColor = original.backgroundColor;
                    this.textComponent.style.fontWeight = original.fontWeight;
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
