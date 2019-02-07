import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Hidden from '@material-ui/core/Hidden';
import Tooltip from '../../Tooltip';

export enum ScoreType {
    Runs,
    Byes,
    LegByes,
    Wide,
}

const radioStyle: React.CSSProperties = {
    marginRight: '22px',
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
            {items.map((item, idx) => (
                <React.Fragment key={item.scoreType}>
                    {(!props.noBall || item.availableForNoBall) && (
                        <Tooltip title={`Set the delivery to be ${item.label}`}>
                            <FormControlLabel
                                label={item.xsLabel}
                                style={idx < items.length - 1 ? radioStyle : {}}
                                control={
                                    <Radio
                                        checked={props.selectedType === item.scoreType}
                                        onChange={() => props.scoreTypeChange(item.scoreType)}
                                    />
                                }
                            />
                        </Tooltip>
                    )}
                </React.Fragment>
            ))}
        </Hidden>
        <Hidden xsDown>
            {items.map(item => (
                <React.Fragment key={item.scoreType}>
                    {(!props.noBall || item.availableForNoBall) && (
                        <Tooltip title={`Set the delivery to be ${item.label}`}>
                            <FormControlLabel
                                label={item.label}
                                style={radioStyle}
                                control={
                                    <Radio
                                        checked={props.selectedType === item.scoreType}
                                        onChange={() => props.scoreTypeChange(item.scoreType)}
                                    />
                                }
                            />
                        </Tooltip>
                    )}
                </React.Fragment>
            ))}
        </Hidden>
    </>
);
