import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Hidden from '@material-ui/core/Hidden';

export enum ScoreType {
    Runs,
    Byes,
    LegByes,
    Wide,
}

const radioStyle: React.CSSProperties = {
    marginRight: '26px',
};

interface ScoreTypeSelectProps {
    noBall: boolean;
    selectedType: ScoreType;
    scoreTypeChange: (st: ScoreType) => void;
}

const items = [
    { label: 'runs', xsLabel: 'ru', scoreType: ScoreType.Runs, availableForNoBall: true },
    { label: 'byes', xsLabel: 'b', scoreType: ScoreType.Byes, availableForNoBall: true },
    { label: 'leg byes', xsLabel: 'lb', scoreType: ScoreType.LegByes, availableForNoBall: true },
    { label: 'wide', xsLabel: 'wd', scoreType: ScoreType.Wide, availableForNoBall: false },
];

export default (props: ScoreTypeSelectProps) => (
    <>
        <Hidden smUp>
            {items.map(item =>
                <React.Fragment key={item.scoreType}>
                    {(!props.noBall || item.availableForNoBall) &&
                        <FormControlLabel
                            label={item.xsLabel}
                            style={radioStyle}
                            control={
                                <Radio
                                    checked={props.selectedType === item.scoreType}
                                    onChange={() => props.scoreTypeChange(item.scoreType)}
                                />}
                        />}
                </React.Fragment>)}
        </Hidden>
        <Hidden xsDown>
            {items.map(item =>
                <React.Fragment key={item.scoreType}>
                    {(!props.noBall || item.availableForNoBall) &&
                        <FormControlLabel
                            label={item.label}
                            style={radioStyle}
                            control={
                                <Radio
                                    checked={props.selectedType === item.scoreType}
                                    onChange={() => props.scoreTypeChange(item.scoreType)}
                                />}
                        />}
                </React.Fragment>)}
        </Hidden>
    </>);
