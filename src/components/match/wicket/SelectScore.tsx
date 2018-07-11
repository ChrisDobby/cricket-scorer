import * as React from 'react';

interface SelectScoreProps {
    fieldName: string;
    selected?: number;
    changed: (score: number, fieldName: string) => void;
}

export default ({ fieldName, selected, changed }: SelectScoreProps) => (
    <select
        className="custom-select"
        value={selected}
        onChange={event => changed(Number(event.currentTarget.value), fieldName)}
    >
        <option>0</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
    </select>);
