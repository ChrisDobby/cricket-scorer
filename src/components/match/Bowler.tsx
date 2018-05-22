import * as React from 'react';
import * as styles from './styles';
import * as globalStyles from '../styles';

const indicatorStyle: React.CSSProperties = {
    ...globalStyles.primaryColour,
    float: 'left',
    width: '30px',
    textAlign: 'center',
};

const nonSelectableStyle: React.CSSProperties = {
    color: 'rgb(233, 236, 239)',
};

interface SelectionIndicatorProps {
    playerIndex: number;
    selected: boolean;
}

const SelectionIndicator = ({ playerIndex, selected }: SelectionIndicatorProps) => {
    return (
        <div style={indicatorStyle}>
            {selected && <i className="fa fa-circle" />}
        </div>
    );
};

export interface BowlerProps {
    index: number;
    selected: boolean;
    name: string;
    allowed: boolean;
    selectBowler: (bowler: number) => void;
}

export const Bowler = ({ index, selected, name, allowed, selectBowler }: BowlerProps) => (
    <div
        className="row bowler-row"
        style={allowed ? styles.selectablePlayerStyle : nonSelectableStyle}
        onClick={() => { if (allowed) { selectBowler(index); } }}
    >
        <SelectionIndicator
            playerIndex={index}
            selected={selected}
        />
        <h6>{name}</h6>
    </div>
);
