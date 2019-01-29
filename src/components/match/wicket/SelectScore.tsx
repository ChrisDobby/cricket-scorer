import * as React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

interface SelectScoreProps {
    fieldName: string;
    selected?: number;
    changed: (score: number, fieldName: string) => void;
}

export default ({ fieldName, selected, changed }: SelectScoreProps) => (
    <Select
        value={typeof selected === 'undefined' ? 0 : selected}
        onChange={event => changed(Number(event.target.value), fieldName)}
    >
        <MenuItem value={0}>0</MenuItem>
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={6}>6</MenuItem>
    </Select>
);
