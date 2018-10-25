import * as React from 'react';
import { InProgressMatchStore } from '../../stores/inProgressMatchStore';
import storeMatch from '../../storeMatch';
import { bindMatchStorage } from '../../stores/withMatchStorage';

const actionProps = (inProgressMatchStore: InProgressMatchStore) => {
    const bindStorage = bindMatchStorage(storeMatch(inProgressMatchStore.setId), () => inProgressMatchStore);
    return bindStorage({
        delivery: inProgressMatchStore.delivery,
        undoPreviousDelivery: inProgressMatchStore.undoPreviousDelivery,
        completeOver: inProgressMatchStore.completeOver,
        changeEnds: inProgressMatchStore.flipBatters,
        completeInnings: inProgressMatchStore.completeInnings,
        completeMatch: inProgressMatchStore.completeMatch,
        batterUnavailable: inProgressMatchStore.batterUnavailable,
    });
};

export default (Component: any) => (props: any) => {
    return (
        <Component {...props} {...actionProps(props.inProgressMatchStore)} />);
};