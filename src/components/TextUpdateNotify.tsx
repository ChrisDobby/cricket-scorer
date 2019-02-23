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
    const updateTimer = React.useRef(null as number | NodeJS.Timer | null);

    React.useEffect(() => {
        if (updateTimer.current) return;
        if (!initialised || !textComponent.current) {
            setInitialised(true);
            return;
        }
        textComponent.current.style.borderRadius = '5px';
        const colourToChangeTo = props.highlightBackgroundColour || defaultColour;
        const originalColor = textComponent.current.style.backgroundColor;

        textComponent.current.style.backgroundColor = colourToChangeTo;
        updateTimer.current = setTimeout(() => {
            if (textComponent.current) {
                textComponent.current.style.backgroundColor = originalColor;
            }
            updateTimer.current = null;
        }, 1000);
    }, [props.text]);

    return (
        <span style={textStyle} ref={textComponent}>
            {props.text}
        </span>
    );
};
