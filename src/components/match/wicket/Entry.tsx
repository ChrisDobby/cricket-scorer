import * as React from 'react';
import { Batter, Bowler, Howout, DeliveryOutcome, DeliveryScores } from '../../../domain';
import SelectScore from './SelectScore';

const entryRowStyle: React.CSSProperties = {
    marginBottom: '8px',
};

const allDescriptions: { howout: Howout, description: string }[] = [];

const descriptionFromPascalCase = (pascalCaseString: string): string =>
    Array.from(pascalCaseString).reduce(
        (str, ch) =>
            str === '' || ch.charCodeAt(0) < 65 || ch.charCodeAt(0) > 90
                ? `${str}${ch}`
                : `${str} ${String.fromCharCode(ch.charCodeAt(0) + 32)}`,
        '');

const description = (howout: Howout): string => {
    const found = allDescriptions.find(desc => desc.howout === howout);
    if (typeof found !== 'undefined') { return found.description; }
    const description = descriptionFromPascalCase(Howout[howout]);

    allDescriptions.push({
        howout,
        description,
    });

    return description;
};

const scoreChange = (scores: DeliveryScores, change: (scores: DeliveryScores) => void) =>
    (updated: number, fieldName: string) =>
        change({
            ...scores,
            [fieldName]: updated,
        });

interface EntryProps {
    batters: Batter[];
    bowler: Bowler;
    fielders: string[];
    batterIndex: number;
    howout?: Howout;
    fielderIndex?: number;
    crossed: boolean;
    scores: DeliveryScores;
    availableHowouts: Howout[];
    fielderRequired: boolean;
    couldCross: boolean;
    couldScoreRuns: boolean;
    couldBeNoBall: boolean;
    couldBeWide: boolean;
    deliveryOutcome: DeliveryOutcome;
    batterChange: (batterIndex: Number) => void;
    howoutChange: (howout: Howout | undefined) => void;
    fielderChange: (fielderIndex: Number | undefined) => void;
    crossedChange: (crossed: boolean) => void;
    scoresChange: (scores: DeliveryScores) => void;
    deliveryOutcomeChange: (outcome: DeliveryOutcome) => void;
}

export default (props: EntryProps) => (
    <React.Fragment>
        <div className="row" style={entryRowStyle}>
            <div className="col-12 col-md-3">
                <h5>Batter</h5>
            </div>
            <div className="col-12 col-md-9">
                <select
                    className="custom-select"
                    value={props.batterIndex}
                    onChange={event => props.batterChange(Number(event.currentTarget.value))}
                >
                    {props.batters.map((batter, idx) =>
                        <option key={idx} value={idx}>{batter.name}</option>)}
                </select>
            </div>
        </div>
        <div className="row" style={entryRowStyle}>
            <div className="col-12 col-md-3">
                <h5>Howout</h5>
            </div>
            <div className="col-12 col-md-9">
                <select
                    className="custom-select"
                    value={props.howout}
                    onChange={event =>
                        props.howoutChange(props.availableHowouts[Number(event.currentTarget.value)])}
                >
                    <option>Select...</option>
                    {props.availableHowouts.map((howout, idx) =>
                        <option key={idx} value={idx}>{description(howout)}</option>)}
                </select>
            </div>
        </div>
        {props.fielderRequired &&
            <div className="row" style={entryRowStyle}>
                <div className="col-12 col-md-3">
                    <h5>Fielder</h5>
                </div>
                <div className="col-12 col-md-9">
                    <select
                        className="custom-select"
                        value={props.fielderIndex}
                        onChange={event => props.fielderChange(Number(event.currentTarget.value))}
                    >
                        <option>Select...</option>
                        {props.fielders.map((fielder, idx) =>
                            <option key={idx} value={idx}>{fielder}</option>)}
                    </select>
                </div>
            </div>}
        {props.couldCross &&
            <div className="row" style={entryRowStyle}>
                <div className="col-12 col-md-3">
                    <h5>Batters crossed</h5>
                </div>
                <div className="col-12 col-md-9">
                    <div className="form-check">
                        <input
                            id="notCrossed"
                            className="form-check-input"
                            type="radio"
                            checked={!props.crossed}
                            value="no"
                            onChange={() => props.crossedChange(false)}
                        />
                        <label className="form-check-label" htmlFor="notCrossed">
                            No
                    </label>
                    </div>
                    <div className="form-check">
                        <input
                            id="crossed"
                            className="form-check-input"
                            type="radio"
                            checked={props.crossed}
                            value="yes"
                            onChange={() => props.crossedChange(true)}
                        />
                        <label className="form-check-label" htmlFor="notCrossed">
                            Yes
                    </label>
                    </div>
                </div>
            </div>}
        {props.couldScoreRuns &&
            <React.Fragment>
                <div className="row" style={entryRowStyle}>
                    <div className="col-12 col-md-3">
                        <h5>Runs</h5>
                    </div>
                    <div className="col-12 col-md-9">
                        <SelectScore
                            fieldName="runs"
                            selected={props.scores.runs}
                            changed={scoreChange(props.scores, props.scoresChange)}
                        />
                    </div>
                </div>
                <div className="row" style={entryRowStyle}>
                    <div className="col-12 col-md-3">
                        <h5>Byes</h5>
                    </div>
                    <div className="col-12 col-md-9">
                        <SelectScore
                            fieldName="byes"
                            selected={props.scores.byes}
                            changed={scoreChange(props.scores, props.scoresChange)}
                        />
                    </div>
                </div>
                <div className="row" style={entryRowStyle}>
                    <div className="col-12 col-md-3">
                        <h5>Leg byes</h5>
                    </div>
                    <div className="col-12 col-md-9">
                        <SelectScore
                            fieldName="legByes"
                            selected={props.scores.legByes}
                            changed={scoreChange(props.scores, props.scoresChange)}
                        />
                    </div>
                </div>
            </React.Fragment>}
        {props.couldBeNoBall &&
            <div className="row" style={entryRowStyle}>
            <div className="col-12 col-md-3">
                <h5>No ball</h5>
            </div>
            <div className="col-12 col-md-9">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={props.deliveryOutcome === DeliveryOutcome.Noball}
                        onChange={ev => props.deliveryOutcomeChange(
                            ev.currentTarget.checked ? DeliveryOutcome.Noball : DeliveryOutcome.Valid)}
                    />
                </div>
            </div>
        </div>}
        {props.couldBeWide &&
            <div className="row" style={entryRowStyle}>
            <div className="col-12 col-md-3">
                <h5>Wide</h5>
            </div>
            <div className="col-12 col-md-9">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={props.deliveryOutcome === DeliveryOutcome.Wide}
                        onChange={ev => props.deliveryOutcomeChange(
                            ev.currentTarget.checked ? DeliveryOutcome.Wide : DeliveryOutcome.Valid)}
                    />
                </div>
            </div>
        </div>}
</React.Fragment>);
