import * as React from 'react';
import WithNavBar from '../components/WithNavBar';
import WithMatchApi from '../components/WithMatchApi';
import { default as MatchCentreComponent } from '../components/MatchCentre';

const MatchCentre = (props: any) => <MatchCentreComponent {...props} />;

export default WithNavBar(WithMatchApi(MatchCentre));
