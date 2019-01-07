import * as React from 'react';

interface TextUpdateNotifyProps {
    text: string | undefined;
    highlightBackgroundColour?: string;
}

const defaultColour = '#9b34ee';
const textStyle: React.CSSProperties = {
    transition: 'background-color 1s',
};

export default (props: TextUpdateNotifyProps) => {
    const [initialised, setInitialised] = React.useState(false);
    const textComponent = React.useRef(null as HTMLSpanElement | null);

    React.useEffect(
        () => {
            if (!initialised || !textComponent.current) {
                setInitialised(true);
                return;
            }
            const originalColor = textComponent.current.style.backgroundColor;
            textComponent.current.style.backgroundColor = props.highlightBackgroundColour || defaultColour;
            setTimeout(
                () => {
                    if (textComponent.current) {
                        textComponent.current.style.backgroundColor = originalColor;
                    }
                },
                1000);
        },
        [props.text]);

    return <span style={textStyle} ref={textComponent}>{props.text}</span>;
};
