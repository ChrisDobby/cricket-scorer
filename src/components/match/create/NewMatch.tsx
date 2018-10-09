import * as React from 'react';
import WithNavBar from '../../WithNavBar';
import MatchForm from './MatchForm';

type NewMatchProps = { storage: any; };

const NewMatch = ({ storage }: NewMatchProps) => (
    <MatchForm />
);

export default WithNavBar(NewMatch);
