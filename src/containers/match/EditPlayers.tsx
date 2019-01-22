import * as React from 'react';
import { inject, observer } from 'mobx-react';
import storeMatch from '../../storeMatch';
import WithInProgressMatch from '../../components/WithInProgressMatch';
import WithInProgressStore from '../../components/WithInProgressStore';
import Players from '../../components/match/edit/Players';
import PageContext from '../../context/PageContext';

const InProgress = observer((props: any) => (
    <PageContext.Consumer>{({ setOptions }) =>
        <Players
            {...props}
            inProgress={props.inProgressMatchStore}
            storeMatch={storeMatch(props.inProgressMatchStore.setId)}
            setPageOptions={setOptions}
        />}
    </PageContext.Consumer>));

export default WithInProgressStore()(
    inject('inProgressMatchStore')(
        WithInProgressMatch(InProgress)));
