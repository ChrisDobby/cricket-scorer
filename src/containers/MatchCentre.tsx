import * as React from 'react';
import WithNavBar from '../components/WithNavBar';
import WithMatchApi from '../components/WithMatchApi';
import { default as MatchCentreComponent } from '../components/MatchCentre';
import matchStorage from '../stores/matchStorage';

const MatchCentre = (props: any) =>
    <MatchCentreComponent {...props} storedMatch={matchStorage(localStorage).getMatch()} />;

export default WithNavBar(WithMatchApi(MatchCentre));
