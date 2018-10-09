import * as React from 'react';
import NewMatch from '../../components/match/create/NewMatch';
import matchStorage from '../../stores/matchStorage';

export default (props: any) => <NewMatch storage={matchStorage(localStorage)} {...props} />;
