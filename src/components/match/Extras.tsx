import * as React from 'react';
import { Extras as InningsExtras } from '../../domain';
import * as styles from './styles';

const extrasLine = ({ noBalls, wides, byes, legByes }: InningsExtras) =>
    `${noBalls}nb ${wides}wd ${byes}b ${legByes}lb`;
    
export interface ExtrasProps { extras: InningsExtras; }

export const Extras = ({ extras }: ExtrasProps) => (
    <div className="row" style={styles.itemRow}>
        <div className="col-4 col-md-3">Extras</div>
        <div className="col-6 col-md-4">{extrasLine(extras)}</div>
        <div
            className="col-2 col-md-1"
            style={styles.runsCell}
        >{extras.byes + extras.legByes + extras.wides + extras.noBalls}
        </div>
    </div>
);
